
import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table, { ColumnDefinition } from '../components/common/Table';
import { ICONS, MOCK_SERVICES, MOCK_DOCTORS, formatCurrency } from '../constants';
import { Service, Doctor } from '../types';

const SettingsPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Partial<Doctor> | null>(null);

  const openServiceModal = (service?: Service) => {
    setCurrentService(service ? { ...service } : { price: 0, category: 'Consultation' });
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setCurrentService(null);
  };

  const handleSaveService = () => {
    if (!currentService) return;
    if (currentService.id) {
      setServices(services.map(s => s.id === currentService.id ? currentService as Service : s));
    } else {
      setServices([{ ...currentService, id: `serv-${Date.now()}` } as Service, ...services]);
    }
    closeServiceModal();
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentService) return;
    const { name, value } = e.target;
    setCurrentService({ ...currentService, [name]: name === 'price' ? parseFloat(value) : value });
  };
  
  const openDoctorModal = (doctor?: Doctor) => {
    setCurrentDoctor(doctor ? { ...doctor } : { payoutShare: 0.5 }); // Default 50%
    setIsDoctorModalOpen(true);
  };

  const closeDoctorModal = () => {
    setIsDoctorModalOpen(false);
    setCurrentDoctor(null);
  };

  const handleSaveDoctor = () => {
    if (!currentDoctor) return;
    // Ensure payoutShare is a number between 0 and 1
    const share = Math.max(0, Math.min(1, Number(currentDoctor.payoutShare) || 0));

    if (currentDoctor.id) {
      setDoctors(doctors.map(d => d.id === currentDoctor.id ? {...currentDoctor, payoutShare: share } as Doctor : d));
    } else {
      setDoctors([{ ...currentDoctor, id: `doc-${Date.now()}`, payoutShare: share } as Doctor, ...doctors]);
    }
    closeDoctorModal();
  };

   const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentDoctor) return;
    const { name, value } = e.target;
    setCurrentDoctor({ ...currentDoctor, [name]: value });
  };


  const serviceColumns: ColumnDefinition<Service, keyof Service>[] = [
    { key: 'name', header: 'Nome do Serviço/Exame', width: 'w-1/2' },
    { key: 'category', header: 'Categoria', width: 'w-1/4' },
    { key: 'price', header: 'Preço', render: item => formatCurrency(item.price), width: 'w-1/6' },
    {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <Button variant="outline" size="sm" onClick={() => openServiceModal(item)} leftIcon={ICONS.EDIT}>Editar</Button>
      ),
      width: 'w-auto'
    }
  ];

  const doctorColumns: ColumnDefinition<Doctor, keyof Doctor>[] = [
    { key: 'name', header: 'Nome do Médico', width: 'w-1/2' },
    { key: 'specialty', header: 'Especialidade', width: 'w-1/3' },
    { key: 'payoutShare', header: 'Repasse (%)', render: item => `${((item.payoutShare || 0) * 100).toFixed(0)}%`, width: 'w-1/6' },
     {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <Button variant="outline" size="sm" onClick={() => openDoctorModal(item)} leftIcon={ICONS.EDIT}>Editar</Button>
      ),
      width: 'w-auto'
    }
  ];

  return (
    <>
      <PageHeader title="Configurações da Clínica" />
      <div className="space-y-6">
        <Card title="Gerenciamento de Preços de Serviços e Exames" actions={
            <Button onClick={() => openServiceModal()} leftIcon={ICONS.PLUS} size="sm">Novo Serviço</Button>
        }>
          <Table columns={serviceColumns} data={services} emptyStateMessage="Nenhum serviço cadastrado."/>
        </Card>

        <Card title="Gerenciamento de Médicos e Taxas de Repasse" actions={
             <Button onClick={() => openDoctorModal()} leftIcon={ICONS.PLUS} size="sm">Novo Médico</Button>
        }>
          <Table columns={doctorColumns} data={doctors} emptyStateMessage="Nenhum médico cadastrado."/>
        </Card>

        {/* Placeholder for other settings */}
        <Card title="Outras Configurações">
            <p className="text-clinic-text-secondary">
                Esta seção pode incluir configurações de sistema, integrações (simuladas), modelos de comunicação, etc.
            </p>
            <div className="mt-4 p-4 border border-dashed border-clinic-accent rounded-md bg-yellow-50">
                <h4 className="font-semibold text-clinic-accent">Configuração de Ponto Eletrônico (Exemplo)</h4>
                <p className="text-sm text-yellow-700">Simulação: Ativar/Desativar registro de ponto via app. Configurar tolerâncias.</p>
                <Button variant="secondary" size="sm" className="mt-2">Configurar Ponto</Button>
            </div>
        </Card>
      </div>

      {isServiceModalOpen && currentService && (
        <Modal title={currentService.id ? "Editar Serviço/Exame" : "Novo Serviço/Exame"} isOpen={isServiceModalOpen} onClose={closeServiceModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeServiceModal}>Cancelar</Button>
              <Button onClick={handleSaveService}>Salvar</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" id="name" name="name" value={currentService.name || ''} onChange={handleServiceChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
              <select id="category" name="category" value={currentService.category || ''} onChange={handleServiceChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="Consultation">Consulta</option>
                <option value="Exam">Exame</option>
                <option value="Procedure">Procedimento</option>
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
              <input type="number" step="0.01" id="price" name="price" value={currentService.price || 0} onChange={handleServiceChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
          </div>
        </Modal>
      )}

      {isDoctorModalOpen && currentDoctor && (
        <Modal title={currentDoctor.id ? "Editar Médico" : "Novo Médico"} isOpen={isDoctorModalOpen} onClose={closeDoctorModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeDoctorModal}>Cancelar</Button>
              <Button onClick={handleSaveDoctor}>Salvar</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="docName" className="block text-sm font-medium text-gray-700">Nome do Médico</label>
              <input type="text" id="docName" name="name" value={currentDoctor.name || ''} onChange={handleDoctorChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
             <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Especialidade</label>
              <input type="text" id="specialty" name="specialty" value={currentDoctor.specialty || ''} onChange={handleDoctorChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
            <div>
              <label htmlFor="payoutShare" className="block text-sm font-medium text-gray-700">Taxa de Repasse (Ex: 0.6 para 60%)</label>
              <input type="number" step="0.01" min="0" max="1" id="payoutShare" name="payoutShare" value={currentDoctor.payoutShare || 0} onChange={handleDoctorChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SettingsPage;
