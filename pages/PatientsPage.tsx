
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table, { ColumnDefinition } from '../components/common/Table';
import { ICONS, MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_EXAMS, formatDate, formatShortDate, getStatusColor } from '../constants';
import { Patient, Appointment, Exam, BreadcrumbItem } from '../types';

const PatientFormFields: React.FC<{ patient: Partial<Patient>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }> = ({ patient, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
      <input type="text" id="name" name="name" value={patient.name || ''} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" required />
    </div>
    <div>
      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
      <input type="date" id="dateOfBirth" name="dateOfBirth" value={patient.dateOfBirth || ''} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
    </div>
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
      <input type="tel" id="phone" name="phone" value={patient.phone || ''} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
      <input type="email" id="email" name="email" value={patient.email || ''} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
    </div>
    <div className="md:col-span-2">
      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço</label>
      <input type="text" id="address" name="address" value={patient.address || ''} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
    </div>
     <div className="md:col-span-2">
      <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Histórico Médico (Resumo)</label>
      <textarea id="medicalHistory" name="medicalHistory" value={patient.medicalHistory || ''} onChange={onChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
    </div>
  </div>
);


const PatientsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [exams] = useState<Exam[]>(MOCK_EXAMS);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Partial<Patient> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedPatient = patientId ? patients.find(p => p.id === patientId) : null;
  const patientAppointments = selectedPatient ? appointments.filter(app => app.patientId === selectedPatient.id) : [];
  const patientExams = selectedPatient ? exams.filter(exam => exam.patientId === selectedPatient.id) : [];


  const openModal = (patient?: Patient) => {
    setCurrentPatient(patient ? { ...patient } : { createdAt: new Date().toISOString() });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPatient(null);
  };

  const handleSave = () => {
    if (!currentPatient) return;
    if (currentPatient.id) {
      setPatients(patients.map(p => p.id === currentPatient.id ? currentPatient as Patient : p));
    } else {
      const newPatient = { ...currentPatient, id: `pat-${Date.now()}`, avatarUrl: `https://picsum.photos/seed/pat-${Date.now()}/100`, createdAt: new Date().toISOString() } as Patient;
      setPatients([newPatient, ...patients]);
    }
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentPatient) return;
    const { name, value } = e.target;
    setCurrentPatient({ ...currentPatient, [name]: value });
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const columns: ColumnDefinition<Patient, keyof Patient>[] = [
    { key: 'name', header: 'Nome', render: item => (
      <div className="flex items-center">
        <img src={item.avatarUrl || `https://picsum.photos/seed/${item.id}/40`} alt={item.name} className="w-8 h-8 rounded-full mr-3" />
        {item.name}
      </div>
    ), width: 'w-1/3' },
    { key: 'phone', header: 'Telefone', width: 'w-1/4' },
    { key: 'email', header: 'Email', width: 'w-1/4' },
    { key: 'createdAt', header: 'Registrado em', render: item => formatShortDate(item.createdAt), width: 'w-1/6' },
    {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openModal(item); }} leftIcon={ICONS.EDIT}>Editar</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/patients/${item.id}`); }} leftIcon={ICONS.USER_CIRCLE} className="text-clinic-primary">Ver Detalhes</Button>
        </div>
      ),
      width: 'w-auto'
    }
  ];

  const appointmentColumns: ColumnDefinition<Appointment, keyof Appointment>[] = [
    { key: 'dateTime', header: 'Data/Hora', render: item => formatDate(item.dateTime) },
    { key: 'serviceName', header: 'Serviço' },
    { key: 'doctorName', header: 'Médico' },
    { key: 'status', header: 'Status Consulta', render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span> },
    { key: 'paymentStatus', header: 'Status Pag.', render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.paymentStatus || 'Pending')}`}>{item.paymentStatus || 'Pending'}</span> },
  ];

  const examColumns: ColumnDefinition<Exam, keyof Exam>[] = [
    { key: 'requestDate', header: 'Data Requisição', render: item => formatShortDate(item.requestDate) },
    { key: 'examTypeName', header: 'Tipo de Exame' },
    { key: 'status', header: 'Status', render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span> },
    { key: 'labName', header: 'Laboratório' },
  ];
  
  const breadcrumbs: BreadcrumbItem[] = patientId && selectedPatient ? [
    { label: "Pacientes", href: "/patients" },
    { label: selectedPatient.name }
  ] : [{ label: "Pacientes" }];


  if (patientId && selectedPatient) {
    return (
      <>
        <PageHeader title={selectedPatient.name} breadcrumbs={breadcrumbs} actionButton={
             <Button onClick={() => openModal(selectedPatient)} leftIcon={ICONS.EDIT} variant="secondary">Editar Paciente</Button>
        }/>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card title="Informações do Paciente">
              <div className="space-y-3">
                <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md" />
                <p><strong>Email:</strong> {selectedPatient.email}</p>
                <p><strong>Telefone:</strong> {selectedPatient.phone}</p>
                <p><strong>Data de Nascimento:</strong> {formatShortDate(selectedPatient.dateOfBirth)}</p>
                <p><strong>Endereço:</strong> {selectedPatient.address}</p>
                <p><strong>Registrado em:</strong> {formatDate(selectedPatient.createdAt)}</p>
                 {selectedPatient.medicalHistory && (
                  <div>
                    <strong>Histórico Médico (Resumo):</strong>
                    <p className="mt-1 text-sm p-2 bg-gray-50 rounded border whitespace-pre-wrap">{selectedPatient.medicalHistory}</p>
                  </div>
                 )}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card title="Histórico de Agendamentos">
              <Table columns={appointmentColumns} data={patientAppointments} emptyStateMessage="Nenhum agendamento encontrado."/>
            </Card>
            <Card title="Histórico de Exames">
              <Table columns={examColumns} data={patientExams} emptyStateMessage="Nenhum exame encontrado." />
            </Card>
          </div>
        </div>
         {isModalOpen && currentPatient && (
            <Modal title="Editar Paciente" isOpen={isModalOpen} onClose={closeModal}
              footer={
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={closeModal}>Cancelar</Button>
                  <Button onClick={handleSave}>Salvar Alterações</Button>
                </div>
              }
            >
              <PatientFormFields patient={currentPatient} onChange={handleChange} />
            </Modal>
          )}
      </>
    );
  }


  return (
    <>
      <PageHeader title="Pacientes" actionButton={
        <Button onClick={() => openModal()} leftIcon={ICONS.PLUS}>Novo Paciente</Button>
      }/>
      <Card className="mb-6">
        <div className="p-4">
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone..."
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      <Card>
        <Table columns={columns} data={filteredPatients} onRowClick={(item) => navigate(`/patients/${item.id}`)} emptyStateMessage="Nenhum paciente encontrado."/>
      </Card>

      {isModalOpen && currentPatient && (
        <Modal title={currentPatient.id ? "Editar Paciente" : "Novo Paciente"} isOpen={isModalOpen} onClose={closeModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          }
        >
          <PatientFormFields patient={currentPatient} onChange={handleChange} />
        </Modal>
      )}
    </>
  );
};

export default PatientsPage;
