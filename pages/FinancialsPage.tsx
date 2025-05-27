
import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table, { ColumnDefinition } from '../components/common/Table';
import { ICONS, MOCK_TRANSACTIONS, MOCK_DOCTORS, MOCK_APPOINTMENTS, MOCK_DOCTOR_PAYOUTS, MOCK_SERVICES, getStatusColor, formatCurrency, formatDate, formatShortDate } from '../constants';
import { Transaction, PaymentStatus, Doctor, Appointment, DoctorPayout } from '../types';

const FinancialsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS); // To link transactions
  const [doctorPayouts, setDoctorPayouts] = useState<DoctorPayout[]>(MOCK_DOCTOR_PAYOUTS);

  const [activeTab, setActiveTab] = useState<'transactions' | 'reconciliation' | 'payouts'>('transactions');
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction> | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | ''>('');


  // Open modal for editing a transaction or creating a new manual one
  const openTransactionModal = (transaction?: Transaction) => {
    setCurrentTransaction(transaction ? { ...transaction } : { date: new Date().toISOString(), status: PaymentStatus.PENDING, amount: 0 });
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setCurrentTransaction(null);
  };

  const handleSaveTransaction = () => {
    if (!currentTransaction) return;
    
    const updatedTransaction = {
        ...currentTransaction,
        id: currentTransaction.id || `trans-${Date.now()}`,
    } as Transaction;

    if (currentTransaction.id) {
      setTransactions(transactions.map(t => t.id === currentTransaction.id ? updatedTransaction : t));
    } else {
      // For new manual transactions
      setTransactions([updatedTransaction, ...transactions]);
    }
    closeTransactionModal();
  };
  
  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentTransaction) return;
    const { name, value } = e.target;
    setCurrentTransaction({ ...currentTransaction, [name]: name === 'amount' ? parseFloat(value) : value });
  };


  const markAsPaid = (transactionId: string) => {
    setTransactions(
      transactions.map(t =>
        t.id === transactionId ? { ...t, status: PaymentStatus.PAID, paymentMethod: t.paymentMethod || 'PIX' /* Default if not set */ } : t
      )
    );
    // Potentially trigger payout recalculation here
    recalculateDoctorPayouts();
  };
  
  const recalculateDoctorPayouts = useCallback(() => {
    const newPayouts: DoctorPayout[] = [];
    const paidTransactions = transactions.filter(t => t.status === PaymentStatus.PAID && t.doctorId);

    doctors.forEach(doctor => {
        const doctorTransactions = paidTransactions.filter(t => t.doctorId === doctor.id);
        if (doctorTransactions.length > 0) {
            const totalBilled = doctorTransactions.reduce((sum, t) => sum + t.amount, 0);
            const payoutRate = doctor.payoutShare || 0.5; // Default 50% if not set
            const payoutAmount = totalBilled * payoutRate;
            
            // Find existing or create new payout entry for a period (e.g., current month)
            // This logic would be more complex in a real app (group by period)
            // For simplicity, we update or add a single payout record per doctor based on all paid transactions
            const existingPayout = doctorPayouts.find(dp => dp.doctorId === doctor.id);
            if(existingPayout){
                 newPayouts.push({
                    ...existingPayout,
                    totalBilled,
                    payoutAmount,
                    payoutRate,
                    // status could be 'Pending' if not yet paid out
                 });
            } else {
                 newPayouts.push({
                    id: `payout-${doctor.id}-${Date.now()}`,
                    doctorId: doctor.id,
                    doctorName: doctor.name,
                    periodStartDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
                    periodEndDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
                    totalBilled,
                    payoutRate,
                    payoutAmount,
                    status: 'Pending',
                });
            }
        }
    });
    // This simple update replaces all payouts. A real system would be more nuanced.
    setDoctorPayouts(prevPayouts => {
        // Merge new with existing, only updating calculated values for matching doctor IDs
        // or adding new ones. This is a simplified merge.
        const updated = prevPayouts.map(pp => {
            const np = newPayouts.find(n => n.doctorId === pp.doctorId);
            return np ? {...pp, totalBilled: np.totalBilled, payoutAmount: np.payoutAmount, payoutRate: np.payoutRate, status: pp.status } : pp;
        });
        newPayouts.forEach(np => {
            if (!updated.find(up => up.doctorId === np.doctorId)) {
                updated.push(np);
            }
        });
        return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, doctors]); // Removed doctorPayouts to avoid loop if it was included

  useEffect(() => {
      recalculateDoctorPayouts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]); // Recalculate if transactions change


  const filteredTransactions = transactions
    .filter(t => 
        (t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         t.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (paymentStatusFilter ? t.status === paymentStatusFilter : true)
    )
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const transactionColumns: ColumnDefinition<Transaction, keyof Transaction>[] = [
    { key: 'date', header: 'Data', render: item => formatShortDate(item.date), width: 'w-1/6' },
    { key: 'patientName', header: 'Paciente', render: item => item.patientName || 'N/A', width: 'w-1/4' },
    { key: 'description', header: 'Descrição', width: 'w-1/3' },
    { key: 'amount', header: 'Valor', render: item => formatCurrency(item.amount), width: 'w-1/6' },
    { key: 'status', header: 'Status Pag.', render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>, width: 'w-1/6' },
    {
      key: 'id',
      header: 'Ações',
      render: (item) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => openTransactionModal(item)} leftIcon={ICONS.EDIT}>Editar</Button>
          {item.status !== PaymentStatus.PAID && (
            <Button variant="ghost" size="sm" onClick={() => markAsPaid(item.id)} leftIcon={ICONS.CHECK_CIRCLE} className="text-green-600">Marcar Pago</Button>
          )}
        </div>
      ),
      width: 'w-auto'
    }
  ];
  
  const reconciliationAppointments = appointments.map(app => {
      const transaction = transactions.find(t => t.referenceId === app.id && t.referenceType === 'Appointment');
      return {
          ...app,
          paymentStatusDisplay: transaction?.status || PaymentStatus.UNPAID, // Default to UNPAID if no transaction
          transactionAmount: transaction?.amount,
          transactionId: transaction?.id,
      };
  }).filter(app => app.paymentStatusDisplay !== PaymentStatus.PAID) // Show only non-paid or problematic
    .sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const reconciliationColumns: ColumnDefinition<typeof reconciliationAppointments[0], keyof typeof reconciliationAppointments[0]>[] = [
    { key: 'dateTime', header: 'Data Consulta', render: item => formatDate(item.dateTime) },
    { key: 'patientName', header: 'Paciente' },
    { key: 'serviceName', header: 'Serviço' },
    { key: 'doctorName', header: 'Médico' },
    { key: 'paymentStatusDisplay', header: 'Status Sistema', render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.paymentStatusDisplay)}`}>{item.paymentStatusDisplay}</span> },
    { key: 'id', header: 'Ação Conciliação', render: item => (
        <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
                if (item.transactionId) {
                    markAsPaid(item.transactionId);
                } else { // Create transaction and mark as paid
                    const service = MOCK_SERVICES.find(s => s.id === item.serviceId);
                    const newTrans: Partial<Transaction> = {
                        referenceId: item.id,
                        referenceType: 'Appointment',
                        patientId: item.patientId,
                        patientName: item.patientName,
                        date: item.dateTime,
                        description: `${item.serviceName} - ${item.doctorName}`,
                        amount: service?.price || 0,
                        status: PaymentStatus.PAID,
                        paymentMethod: 'PIX', // Default
                        doctorId: item.doctorId,
                    };
                    const newFullTrans = { ...newTrans, id: `trans-${Date.now()}` } as Transaction;
                    setTransactions(prev => [newFullTrans, ...prev]);
                    // Recalculate payouts will be triggered by useEffect on transactions
                }
            }} 
            leftIcon={ICONS.ARROW_PATH}
        >
            Confirmar Pagamento
        </Button>
    )},
  ];

  const payoutColumns: ColumnDefinition<DoctorPayout, keyof DoctorPayout>[] = [
      { key: 'doctorName', header: 'Médico' },
      { key: 'periodStartDate', header: 'Início Período', render: item => formatShortDate(item.periodStartDate) },
      { key: 'periodEndDate', header: 'Fim Período', render: item => formatShortDate(item.periodEndDate) },
      { key: 'totalBilled', header: 'Total Faturado (Pago)', render: item => formatCurrency(item.totalBilled) },
      { key: 'payoutRate', header: 'Repasse (%)', render: item => `${(item.payoutRate * 100).toFixed(0)}%` },
      { key: 'payoutAmount', header: 'Valor Repasse', render: item => formatCurrency(item.payoutAmount) },
      { key: 'status', header: 'Status', render: item => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status === 'Paid' ? PaymentStatus.PAID : PaymentStatus.PENDING)}`}>{item.status}</span> },
      { key: 'id', header: 'Ação', render: item => item.status === 'Pending' && (
          <Button variant="primary" size="sm" onClick={() => {
              setDoctorPayouts(payouts => payouts.map(p => p.id === item.id ? {...p, status: 'Paid', paidDate: new Date().toISOString()} : p));
              alert(`Repasse para ${item.doctorName} marcado como pago.`);
          }}>Marcar como Pago</Button>
      )},
  ];

  const TabButton: React.FC<{tabKey: string, currentTab: string, label: string, onClick: (tab:any)=>void}> = ({tabKey, currentTab, label, onClick}) => (
    <button
        className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${currentTab === tabKey ? 'bg-clinic-primary text-white' : 'text-clinic-primary hover:bg-clinic-primary hover:bg-opacity-10'}`}
        onClick={() => onClick(tabKey)}
    >
        {label}
    </button>
  );

  return (
    <>
      <PageHeader title="Financeiro" actionButton={
        activeTab === 'transactions' ? <Button onClick={() => openTransactionModal()} leftIcon={ICONS.PLUS}>Nova Transação Manual</Button> : null
      }/>
      
      <div className="mb-6 border-b border-gray-300">
        <TabButton tabKey="transactions" currentTab={activeTab} label="Transações" onClick={setActiveTab} />
        <TabButton tabKey="reconciliation" currentTab={activeTab} label="Conciliação Pendente" onClick={setActiveTab} />
        <TabButton tabKey="payouts" currentTab={activeTab} label="Repasses Médicos" onClick={setActiveTab} />
      </div>

      {activeTab === 'transactions' && (
        <Card>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mb-4 border-b">
            <input
                type="text"
                placeholder="Buscar por paciente, descrição..."
                className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                className="p-2 border border-gray-300 rounded-md focus:ring-clinic-primary focus:border-clinic-primary"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value as PaymentStatus | '')}
            >
                <option value="">Todos Status Pagamento</option>
                {Object.values(PaymentStatus).map(status => (
                <option key={status} value={status}>{status}</option>
                ))}
            </select>
          </div>
          <Table columns={transactionColumns} data={filteredTransactions} emptyStateMessage="Nenhuma transação encontrada."/>
        </Card>
      )}

      {activeTab === 'reconciliation' && (
        <Card title="Conciliar Atendimentos/Exames Não Pagos">
          <p className="text-sm text-clinic-text-secondary mb-4">Liste abaixo os atendimentos marcados como não pagos no sistema. Clique em 'Confirmar Pagamento' para gerar a transação correspondente e marcá-la como paga.</p>
          <Table columns={reconciliationColumns} data={reconciliationAppointments} emptyStateMessage="Nenhum item pendente de conciliação."/>
        </Card>
      )}

      {activeTab === 'payouts' && (
        <Card title="Repasses para Médicos">
             <p className="text-sm text-clinic-text-secondary mb-4">Valores calculados com base nas transações pagas e na taxa de repasse configurada para cada médico (ver Configurações). Este é um demonstrativo; o pagamento efetivo deve ser feito externamente.</p>
          <Table columns={payoutColumns} data={doctorPayouts} emptyStateMessage="Nenhum repasse a ser exibido."/>
        </Card>
      )}

      {isTransactionModalOpen && currentTransaction && (
        <Modal title={currentTransaction.id ? "Editar Transação" : "Nova Transação Manual"} isOpen={isTransactionModalOpen} onClose={closeTransactionModal}
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeTransactionModal}>Cancelar</Button>
              <Button onClick={handleSaveTransaction}>Salvar Transação</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Paciente (opcional)</label>
              <input type="text" id="patientName" name="patientName" value={currentTransaction.patientName || ''} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
              <input type="text" id="description" name="description" value={currentTransaction.description || ''} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input type="number" step="0.01" id="amount" name="amount" value={currentTransaction.amount || 0} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required/>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data da Transação</label>
                <input type="date" id="date" name="date" value={currentTransaction.date ? currentTransaction.date.split('T')[0] : ''} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
              <select id="paymentMethod" name="paymentMethod" value={currentTransaction.paymentMethod || ''} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="">Selecione</option>
                <option value="PIX">PIX</option>
                <option value="Credit Card">Cartão de Crédito</option>
                <option value="Debit Card">Cartão de Débito</option>
                <option value="Cash">Dinheiro</option>
                <option value="Plan">Plano de Saúde</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status Pagamento</label>
              <select id="status" name="status" value={currentTransaction.status || ''} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Médico Associado (para repasse)</label>
              <select id="doctorId" name="doctorId" value={currentTransaction.doctorId || ''} onChange={handleTransactionChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="">Nenhum</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FinancialsPage;
