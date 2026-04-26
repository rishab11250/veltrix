import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import ExpenseModal from '../../components/expenses/ExpenseModal';
import { getExpenses, deleteExpense } from '../../store/slices/expenseSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ExpensesPage = () => {
  const dispatch = useDispatch();
  const { expenses, isLoading } = useSelector((state) => state.expenses);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  useEffect(() => { dispatch(getExpenses()); }, [dispatch]);

  const filteredExpenses = activeCategory === 'All' ? expenses : expenses.filter(e => e.category === activeCategory);

  const columns = [
    { header: 'Description', accessor: 'description', render: (r) => <span className="text-sm font-bold text-white">{r.description}</span> },
    { header: 'Category', accessor: 'category', render: (r) => <span className="text-[10px] font-black uppercase text-text-muted">{r.category}</span> },
    { header: 'Date', accessor: 'date', render: (r) => <span className="text-xs text-text-muted">{formatDate(r.date)}</span> },
    { header: 'Amount', accessor: 'amount', render: (r) => <div className="text-right font-black text-white">{formatCurrency(r.amount)}</div> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-4">
          <button onClick={() => { setExpenseToEdit(r); setIsModalOpen(true); }} className="text-text-muted hover:text-white transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
          <button onClick={() => { if(window.confirm('Delete?')) dispatch(deleteExpense(r._id)); }} className="text-text-muted hover:text-rose-500 transition-all"><span className="material-symbols-outlined text-[18px]">delete</span></button>
        </div>
      ),
    },
  ];

  const cats = ['All', 'Marketing', 'Rent', 'Utilities', 'Salaries', 'Software', 'Travel', 'Other'];

  return (
    <PageWrapper title="Expenses" actions={<Button onClick={() => { setExpenseToEdit(null); setIsModalOpen(true); }}>+ Record Expense</Button>}>
      <div className="space-y-6 pb-20 px-4 md:px-0">
        <div className="flex gap-2 p-1 bg-[#1A1A1A] rounded-2xl w-fit border border-white/5 overflow-x-auto max-w-full scrollbar-hide">
          {cats.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${activeCategory === c ? 'bg-white text-black' : 'text-text-muted'}`}>{c}</button>)}
        </div>

        <div className="glass-panel rounded-[24px] border border-white/5 overflow-hidden">
          <div className="hidden md:block"><Table columns={columns} data={filteredExpenses} loading={isLoading} /></div>
          <div className="md:hidden divide-y divide-white/5">
            {isLoading ? <div className="p-10 text-center text-text-muted">Loading...</div> :
             filteredExpenses.length === 0 ? <div className="p-10 text-center text-text-muted">No expenses</div> :
             filteredExpenses.map(e => (
              <div key={e._id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div><h4 className="font-bold text-white leading-tight">{e.description}</h4><p className="text-[10px] text-text-muted uppercase font-black mt-1">{e.category}</p></div>
                  <div className="flex gap-3"><button onClick={() => {setExpenseToEdit(e); setIsModalOpen(true);}} className="text-text-muted"><span className="material-symbols-outlined text-sm">edit</span></button><button onClick={() => {if(window.confirm('Delete?')) dispatch(deleteExpense(e._id));}} className="text-text-muted"><span className="material-symbols-outlined text-sm">delete</span></button></div>
                </div>
                <div className="flex justify-between items-end"><span className="text-xs text-text-muted">{formatDate(e.date)}</span><span className="text-lg font-black text-white">{formatCurrency(e.amount)}</span></div>
              </div>
             ))}
          </div>
        </div>
      </div>
      <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} expenseToEdit={expenseToEdit} />
    </PageWrapper>
  );
};

export default ExpensesPage;
