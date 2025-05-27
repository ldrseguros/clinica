
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import { ICONS, MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_TRANSACTIONS, MOCK_INVENTORY, formatCurrency, formatDate } from '../constants';
import { Appointment, AppointmentStatus, Patient, Transaction, PaymentStatus, InventoryItem } from '../types';

const DashboardPage: React.FC = () => {
  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);

  const upcomingAppointments = appointments.filter(
    (app) => new Date(app.dateTime) >= new Date() && (app.status === AppointmentStatus.SCHEDULED || app.status === AppointmentStatus.CONFIRMED || app.status === AppointmentStatus.PENDING_CONFIRMATION)
  ).sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0, 5);

  const totalRevenue = transactions
    .filter(t => t.status === PaymentStatus.PAID)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions
    .filter(t => t.status === PaymentStatus.PENDING || t.status === PaymentStatus.UNPAID)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel);

  const appointmentStatusData = Object.values(AppointmentStatus).map(status => ({
    name: status,
    value: appointments.filter(app => app.status === status).length
  })).filter(item => item.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#DECF3F'];

  // Sample data for daily revenue (last 7 days)
  const dailyRevenueData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      name: date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      revenue: transactions
        .filter(t => t.status === PaymentStatus.PAID && new Date(t.date).toDateString() === date.toDateString())
        .reduce((sum, t) => sum + t.amount, 0),
    };
  }).reverse();


  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Receita Total (Pago)">
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-clinic-text-secondary">Total acumulado</p>
        </Card>
        <Card title="Pagamentos Pendentes">
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(pendingPayments)}</p>
          <p className="text-sm text-clinic-text-secondary">Aguardando recebimento</p>
        </Card>
        <Card title="Total de Pacientes">
          <p className="text-3xl font-bold text-clinic-primary">{patients.length}</p>
          <p className="text-sm text-clinic-text-secondary">Pacientes registrados</p>
        </Card>
        <Card title="Itens com Baixo Estoque">
           <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
           <p className="text-sm text-clinic-text-secondary">Precisam de reposição</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Receita Diária (Últimos 7 dias)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#007A7A" strokeWidth={2} activeDot={{ r: 8 }} name="Receita"/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Status dos Agendamentos">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {appointmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card title="Próximos Agendamentos">
        {upcomingAppointments.length > 0 ? (
          <ul className="space-y-3">
            {upcomingAppointments.map(app => (
              <li key={app.id} className="p-3 bg-clinic-background rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold text-clinic-primary">{app.patientName} <span className="text-sm text-clinic-text-secondary">({app.serviceName})</span></p>
                  <p className="text-sm text-clinic-text-secondary">{formatDate(app.dateTime)} com {app.doctorName}</p>
                </div>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">{app.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-clinic-text-secondary">Nenhum agendamento próximo.</p>
        )}
      </Card>
    </>
  );
};

export default DashboardPage;
