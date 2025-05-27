
import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table, { ColumnDefinition } from '../components/common/Table';
import { ICONS, MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS, MOCK_SERVICES, getStatusColor, formatDate, formatShortDate, formatCurrency } from '../constants';
import { Appointment, AppointmentStatus, Patient, Doctor, Service, PaymentStatus } from '../types';

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [services] = useState<Service[]>(MOCK_SERVICES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);


  const openModal = (appointment?: Appointment) => {
    setCurrentAppointment(appointment ? { ...appointment } : { dateTime: new Date().toISOString(), durationMinutes: 30, status: AppointmentStatus.SCHEDULED });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleSave = () => {
    if (!currentAppointment) return;

    const patient = patients.find(p => p.id === currentAppointment.patientId);
    const doctor = doctors.find(d => d.id === currentAppointment.doctorId);
    const service = services.find(s => s.id === currentAppointment.serviceId);

    const appointmentWithDetails: Appointment = {
      ...currentAppointment,
      id: currentAppointment.id || `app-${Date.now()}`,
      patientName: patient?.name,
      doctorName: doctor?.name,
      serviceName: service?.name,
      paymentStatus: currentAppointment.paymentStatus || PaymentStatus.PENDING,
    } as Appointment;


    if (currentAppointment.id) {
      setAppointments(appointments.map(app => app.id === currentAppointment.id ? appointmentWithDetails : app));
    } else {
      setAppointments([appointmentWithDetails, ...appointments]);
    }
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentAppointment) return;
    const { name, value } = e.target;
    setCurrentAppointment({ ...currentAppointment, [name]: value });
  };
  
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentAppointment) return;
    const localDateTime = e.target.value; // YYYY-MM-DDTHH:mm
    setCurrentAppointment({ ...currentAppointment, dateTime: new Date(localDateTime).toISOString() });
  };

  const filteredAppointments = appointments
    .filter(app => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (app.patientName?.toLowerCase().includes(searchLower) ||
         app.doctorName?.toLowerCase().includes(searchLower) ||
         app.serviceName?.toLowerCase().includes(searchLower)) &&
        (statusFilter ? app.status === statusFilter : true) &&
        (dateFilter ? formatShortDate(app.dateTime) === formatShortDate(dateFilter) : true)
      );
    })
    .sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const columns: ColumnDefinition<Appointment, keyof Appointment>[] = [
    { key: 'dateTime', header: 'Data/Hora', render: item => formatDate(item.dateTime), width: 'w-1/6' },
    { key: 'patientName', header: 'Paciente', width: 'w-1/5' },
    { key: 'serviceName', header: 'Serviço', width: 'w-1/5' },
    { key: 'doctorName', header: 'Médico', width: 'w-1/6' },
    { 
      key: 'status', 
      header: 'Status', 
      render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>,
      width: 'w-1/12'
    },
    { 
      key: 'paymentStatus', 
      header: 'Pagamento', 
      render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.paymentStatus || PaymentStatus.PENDING)}`}>{item.paymentStatus || PaymentStatus.PENDING}</span>,
      width: 'w-1/12'
    },
    {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openModal(item); }} leftIcon={ICONS.EDIT}>Editar</Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => { 
              e.stopPropagation(); 
              // Simulate confirmation
              const updatedStatus = item.status === AppointmentStatus.PENDING_CONFIRMATION ? AppointmentStatus.CONFIRMED : AppointmentStatus.PENDING_CONFIRMATION;
              setAppointments(appointments.map(a => a.id === item.id ? {...a, status: updatedStatus, confirmationSent: true } : a));
              alert(`Lembrete de confirmação ${item.status === AppointmentStatus.PENDING_CONFIRMATION ? "enviado" : "marcado como confirmado"} para ${item.patientName}`);
            }}
            leftIcon={item.status === AppointmentStatus.CONFIRMED ? ICONS.CHECK_CIRCLE : ICONS.PAPER_AIRPLANE}
            className={item.status === AppointmentStatus.CONFIRMED ? "text-green-600" : "text-blue-600"}
          >
            {item.status === AppointmentStatus.CONFIRMED ? "Confirmado" : "Confirmar"}
          </Button>
        </div>
      ),
      width: 'w-1/4'
    }
  ];

  return (
    <>
      <PageHeader title="Agendamentos" actionButton={
        <Button onClick={() => openModal()} leftIcon={ICONS.PLUS}>Novo Agendamento</Button>
      }/>
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <input
            type="text"
            placeholder="Buscar por paciente, médico, serviço..."
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <select
            className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | '')}
          >
            <option value="">Todos Status</option>
            {Object.values(AppointmentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </Card>
      <Card>
        <Table columns={columns} data={filteredAppointments} onRowClick={openModal} emptyStateMessage="Nenhum agendamento encontrado." />
      </Card>

      {isModalOpen && currentAppointment && (
        <Modal title={currentAppointment.id ? "Editar Agendamento" : "Novo Agendamento"} isOpen={isModalOpen} onClose={closeModal}
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
              <select id="patientId" name="patientId" value={currentAppointment.patientId || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary">
                <option value="">Selecione um paciente</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Médico</label>
              <select id="doctorId" name="doctorId" value={currentAppointment.doctorId || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary">
                <option value="">Selecione um médico</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">Serviço</label>
              <select id="serviceId" name="serviceId" value={currentAppointment.serviceId || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary">
                <option value="">Selecione um serviço</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.price)})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Data e Hora</label>
              <input type="datetime-local" id="dateTime" name="dateTime" 
                value={currentAppointment.dateTime ? new Date(currentAppointment.dateTime).toISOString().substring(0, 16) : ''} 
                onChange={handleDateTimeChange} 
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
            </div>
            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
              <input type="number" id="durationMinutes" name="durationMinutes" value={currentAppointment.durationMinutes || 30} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={currentAppointment.status || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary">
                {Object.values(AppointmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Status Pagamento</label>
              <select id="paymentStatus" name="paymentStatus" value={currentAppointment.paymentStatus || PaymentStatus.PENDING} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary">
                {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Observações</label>
              <textarea id="notes" name="notes" value={currentAppointment.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-clinic-primary focus:border-clinic-primary" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default AppointmentsPage;
