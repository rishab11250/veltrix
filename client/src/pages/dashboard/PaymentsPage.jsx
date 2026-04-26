import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PaymentModal from '../../components/payments/PaymentModal';
import { getPayments, getPaymentStats } from '../../store/slices/paymentSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { payments, stats, isLoading } = useSelector((state) => state.payment);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getPayments());
    dispatch(getPaymentStats());
  }, [dispatch]);

  const filteredPayments = activeFilter === 'All' 
    ? payments 
    : payments.filter(p => p.status === activeFilter);

  const columns = [
    { 
      header: 'Transaction ID', accessor: 'transactionId',
      render: (r) => <span className="font-mono text-[10px] text-text-muted uppercase tracking-tighter">{r.transactionId}</span>
    },
    { header: 'Date', accessor: 'date', render: (r) => <span className="text-xs text-text-muted">{formatDate(r.date)}</span> },
    { header: 'Client', accessor: 'client', render: (r) => <span className="text-sm font-bold text-white">{r.client?.name || 'Unknown'}</span> },
    { header: 'Amount', accessor: 'amount', render: (r) => <div className="text-right font-black text-white">{formatCurrency(r.amount)}</div> },
    { 
      header: 'Status', accessor: 'status',
      render: (r) => <Badge variant={r.status === 'Paid' ? 'success' : r.status === 'Pending' ? 'warning' : 'danger'} className="uppercase px-3 py-1 text-[9px] font-black">{r.status}</Badge>
    }
  ];

  return (
    <PageWrapper title="Payments">
      <div className="space-y-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight">Payments Ledger</h2>
            <p className="text-sm text-text-muted font-medium">Record of all transactions.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="brand" className="w-full md:w-auto">Record Payment</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Collected', value: formatCurrency(stats.totalCollected), color: 'primary' },
            { label: 'Pending', value: formatCurrency(stats.pendingProcessing), color: 'warning' },
            { label: 'Failed', value: formatCurrency(stats.failedTransactions), color: 'danger' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-[24px] md:rounded-[32px] border border-white/5 overflow-hidden">
          <div className="hidden md:block">
            <Table columns={columns} data={filteredPayments} loading={isLoading} />
          </div>
          
          <div className="md:hidden divide-y divide-white/5">
            {isLoading ? <div className="p-10 text-center text-text-muted">Loading...</div> :
             filteredPayments.length === 0 ? <div className="p-10 text-center text-text-muted">No payments</div> :
             filteredPayments.map(p => (
              <div key={p._id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-mono text-text-muted uppercase">{p.transactionId}</p>
                    <h4 className="font-bold text-white mt-1">{p.client?.name || 'Unknown Client'}</h4>
                  </div>
                  <Badge variant={p.status === 'Paid' ? 'success' : 'warning'} className="uppercase text-[8px] font-black">{p.status}</Badge>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-text-muted">{formatDate(p.date)}</span>
                  <span className="text-lg font-black text-white">{formatCurrency(p.amount)}</span>
                </div>
              </div>
             ))}
          </div>
        </div>
      </div>
      <PaymentModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); dispatch(getPaymentStats()); }} />
    </PageWrapper>
  );
};

export default PaymentsPage;
