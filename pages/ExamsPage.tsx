
import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table, { ColumnDefinition } from '../components/common/Table';
import { ICONS, MOCK_EXAMS, MOCK_PATIENTS, MOCK_DOCTORS, MOCK_SERVICES, getStatusColor, formatShortDate } from '../constants';
import { Exam, ExamStatus, Patient, Doctor, Service } from '../types';

const ExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [services] = useState<Service[]>(MOCK_SERVICES.filter(s => s.category === 'Exam'));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState<Partial<Exam> | null>(null);
  const [resultSummary, setResultSummary] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExamStatus | ''>('');

  const openModal = (exam?: Exam) => {
    setCurrentExam(exam ? { ...exam } : { requestDate: new Date().toISOString(), status: ExamStatus.REQUESTED });
    setIsModalOpen(true);
  };

  const openResultModal = (exam: Exam) => {
    setCurrentExam(exam);
    setResultSummary(exam.resultSummary || '');
    setIsResultModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsResultModalOpen(false);
    setCurrentExam(null);
    setResultSummary('');
  };

  const handleSave = () => {
    if (!currentExam) return;

    const patient = patients.find(p => p.id === currentExam.patientId);
    const examService = services.find(s => s.id === currentExam.examTypeId);

    const examWithDetails: Exam = {
      ...currentExam,
      id: currentExam.id || `exam-${Date.now()}`,
      patientName: patient?.name,
      examTypeName: examService?.name,
    } as Exam;

    if (currentExam.id) {
      setExams(exams.map(ex => ex.id === currentExam.id ? examWithDetails : ex));
    } else {
      setExams([examWithDetails, ...exams]);
    }
    closeModal();
  };
  
  const handleSaveResult = () => {
    if (!currentExam || !currentExam.id) return;
    setExams(exams.map(ex => ex.id === currentExam.id ? {...ex, resultSummary, status: ExamStatus.RESULTS_READY, resultDate: new Date().toISOString() } : ex));
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentExam) return;
    const { name, value } = e.target;
    setCurrentExam({ ...currentExam, [name]: value });
  };

  const handleSendToPatient = (examId: string) => {
    setExams(exams.map(ex => ex.id === examId ? {...ex, status: ExamStatus.DELIVERED_TO_PATIENT } : ex));
    // Simulate sending via WhatsApp
    const exam = exams.find(ex => ex.id === examId);
    alert(`Resultado do exame ${exam?.examTypeName} enviado para ${exam?.patientName} (simulado).`);
  };
  
  const filteredExams = exams
    .filter(exam => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (exam.patientName?.toLowerCase().includes(searchLower) ||
         exam.examTypeName?.toLowerCase().includes(searchLower) ||
         exam.labName?.toLowerCase().includes(searchLower)) &&
        (statusFilter ? exam.status === statusFilter : true)
      );
    })
    .sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());


  const columns: ColumnDefinition<Exam, keyof Exam>[] = [
    { key: 'requestDate', header: 'Data Req.', render: item => formatShortDate(item.requestDate), width: 'w-1/6' },
    { key: 'patientName', header: 'Paciente', width: 'w-1/5' },
    { key: 'examTypeName', header: 'Tipo Exame', width: 'w-1/5' },
    { key: 'labName', header: 'Laboratório', width: 'w-1/6' },
    { 
      key: 'status', 
      header: 'Status', 
      render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>,
      width: 'w-1/6'
    },
    {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <div className="flex space-x-1 items-center">
          <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); openModal(item);}} leftIcon={ICONS.EDIT} title="Editar Requisição"></Button>
          {item.status !== ExamStatus.RESULTS_READY && item.status !== ExamStatus.DELIVERED_TO_PATIENT && (
            <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); openResultModal(item);}} leftIcon={ICONS.UPLOAD} title="Carregar Resultado" className="text-blue-600 border-blue-600 hover:bg-blue-600"></Button>
          )}
          {item.status === ExamStatus.RESULTS_READY && (
            <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); handleSendToPatient(item.id);}} leftIcon={ICONS.PAPER_AIRPLANE} title="Enviar ao Paciente" className="text-green-600 border-green-600 hover:bg-green-600"></Button>
          )}
           {item.resultSummary && (
            <Button variant="ghost" size="sm" onClick={(e) => {e.stopPropagation(); alert(`Resumo: ${item.resultSummary}`);}} leftIcon={ICONS.DOCUMENT_TEXT} title="Ver Resumo"></Button>
          )}
        </div>
      ),
      width: 'w-auto'
    }
  ];

  return (
    <>
      <PageHeader title="Gerenciamento de Exames" actionButton={
        <Button onClick={() => openModal()} leftIcon={ICONS.PLUS}>Nova Requisição</Button>
      }/>
       <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <input
            type="text"
            placeholder="Buscar por paciente, exame, laboratório..."
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ExamStatus | '')}
          >
            <option value="">Todos Status</option>
            {Object.values(ExamStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </Card>
      <Card>
        <Table columns={columns} data={filteredExams} onRowClick={openModal} emptyStateMessage="Nenhum exame encontrado."/>
      </Card>

      {isModalOpen && currentExam && (
        <Modal title={currentExam.id ? "Editar Requisição de Exame" : "Nova Requisição de Exame"} isOpen={isModalOpen} onClose={closeModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Paciente</label>
              <select id="patientId" name="patientId" value={currentExam.patientId || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="">Selecione</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Médico Solicitante</label>
              <select id="doctorId" name="doctorId" value={currentExam.doctorId || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="">Selecione</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="examTypeId" className="block text-sm font-medium text-gray-700">Tipo de Exame</label>
              <select id="examTypeId" name="examTypeId" value={currentExam.examTypeId || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                 <option value="">Selecione</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="labName" className="block text-sm font-medium text-gray-700">Laboratório (opcional)</label>
                <input type="text" id="labName" name="labName" value={currentExam.labName || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label htmlFor="requestDate" className="block text-sm font-medium text-gray-700">Data da Requisição</label>
              <input type="date" id="requestDate" name="requestDate" value={currentExam.requestDate ? currentExam.requestDate.split('T')[0] : ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={currentExam.status || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                {Object.values(ExamStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
      
      {isResultModalOpen && currentExam && (
        <Modal title={`Resultado para ${currentExam.examTypeName} de ${currentExam.patientName}`} isOpen={isResultModalOpen} onClose={closeModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSaveResult}>Salvar Resultado</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="resultSummary" className="block text-sm font-medium text-gray-700">Resumo do Resultado</label>
              <textarea id="resultSummary" name="resultSummary" value={resultSummary} onChange={(e) => setResultSummary(e.target.value)} rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label htmlFor="resultAttachmentUrl" className="block text-sm font-medium text-gray-700">Anexar Arquivo (simulado)</label>
                <input type="file" id="resultAttachmentUrl" name="resultAttachmentUrl" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-clinic-primary file:text-white hover:file:bg-clinic-secondary"/>
                <p className="text-xs text-gray-500 mt-1">Esta é uma simulação. Nenhum arquivo será realmente enviado.</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ExamsPage;
