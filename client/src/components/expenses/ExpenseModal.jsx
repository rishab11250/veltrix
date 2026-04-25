import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { createExpense, updateExpense } from '../../store/slices/expenseSlice';

const ExpenseModal = ({ isOpen, onClose, expenseToEdit = null }) => {
  const dispatch = useDispatch();
  const categories = ['Marketing', 'Rent', 'Utilities', 'Salaries', 'Software', 'Taxes', 'Travel', 'Other'];

  const [formData, setFormData] = useState({
    amount: '',
    category: 'Other',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        date: new Date(expenseToEdit.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        amount: '',
        category: 'Other',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [expenseToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      return toast.error('Please fill in required fields');
    }

    let result;
    if (expenseToEdit) {
      result = await dispatch(updateExpense({ id: expenseToEdit._id, data: formData }));
    } else {
      result = await dispatch(createExpense(formData));
    }

    if (createExpense.fulfilled.match(result) || updateExpense.fulfilled.match(result)) {
      toast.success(`Expense ${expenseToEdit ? 'updated' : 'recorded'} successfully`);
      onClose();
    } else {
      toast.error(result.payload || 'Failed to save expense');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expenseToEdit ? 'Edit Expense' : 'Record Expense'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={formData.amount} 
              onChange={(e) => setFormData({...formData, amount: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Date</label>
            <input 
              type="date" 
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none" 
              value={formData.date} 
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Category</label>
          <select 
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Description</label>
          <textarea 
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white min-h-[80px] outline-none focus:border-primary resize-none"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="neutral" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="brand" className="flex-1">
            {expenseToEdit ? 'Update Expense' : 'Confirm Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
