import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import InvoicePreview from '../../components/invoices/InvoicePreview';
import { getClients } from '../../store/slices/clientSlice';
import { updateInvoice } from '../../store/slices/invoiceSlice';
import invoiceService from '../../services/invoiceService';

const EditInvoicePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch(), navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(getClients());
    const fetchInvoice = async () => {
      try {
        const res = await invoiceService.getInvoice(id);
        setFormData({ ...res.data, client: res.data.client?._id || res.data.client });
      } catch (e) { toast.error('Failed to load invoice'); navigate('/app/invoices'); }
    };
    fetchInvoice();
  }, [id, dispatch, navigate]);

  const handleItemChange = (i, f, v) => {
    const n = [...formData.items];
    n[i] = { ...n[i], [f]: v };
    setFormData({ ...formData, items: n });
  };

  const handleSubmit = async () => {
    if (!formData.client || !formData.dueDate) return toast.error('Fill fields');
    const res = await dispatch(updateInvoice({ id, data: formData }));
    if (updateInvoice.fulfilled.match(res)) { toast.success('Updated'); navigate('/app/invoices'); }
    else toast.error('Failed');
  };

  if (!formData) return <div className="p-20 text-center text-text-muted italic">Loading invoice terminal...</div>;

  const subtotal = formData.items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  const selectedClient = (clients || []).find(c => c._id === formData.client);

  return (
    <PageWrapper title="Edit">
      <div className="flex flex-col xl:flex-row gap-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-0">
        <div className="flex-1 space-y-6">
          <div className="glass-panel p-6 md:p-10 rounded-[32px] border border-white/5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
              <div className="md:col-span-3"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Invoice #</label><Input value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} className="!py-3" /></div>
              <div className="md:col-span-4"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Client</label><select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})}><option value="">Select Client</option>{(clients || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div className="md:col-span-3"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Due Date</label><input type="date" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none color-scheme-dark" style={{ colorScheme: 'dark' }} value={formData.dueDate?.split('T')[0]} onChange={e => setFormData({...formData, dueDate: e.target.value})} /></div>
              <div className="md:col-span-2"><label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Status</label><select className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white focus:border-primary outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option></select></div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center"><h3 className="text-sm font-black text-white uppercase tracking-widest">Line Items</h3><button onClick={() => setFormData({...formData, items: [...formData.items, {description: '', quantity: 1, unitPrice: 0}]})} className="text-primary text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">Add Item</button></div>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-white/[0.02] border border-white/5 p-6 rounded-[24px] space-y-4 relative group hover:border-white/10 transition-colors">
                    <input placeholder="Description" className="w-full bg-transparent text-sm text-white outline-none border-b border-white/5 pb-2 focus:border-primary/30" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex gap-4"><input type="number" className="w-16 bg-[#131313] border border-white/10 rounded-lg py-2 text-center text-sm text-white focus:border-primary outline-none" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} /><input type="number" className="w-28 bg-[#131313] border border-white/10 rounded-lg py-2 pl-7 text-sm text-white focus:border-primary outline-none" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} /></div>
                      {formData.items.length > 1 && <button onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== index)})} className="p-3 text-rose-500/20 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl"><span className="material-symbols-outlined text-[20px]">delete</span></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-[480px] w-full">
          <div className="sticky top-24 space-y-6">
            <div className="flex justify-between items-center"><Button onClick={handleSubmit} variant="brand" className="px-8 w-full">Update Invoice</Button></div>
            <div className="rounded-[32px] overflow-hidden shadow-2xl"><InvoicePreview formData={formData} selectedClient={selectedClient} user={user} subtotal={subtotal} total={subtotal + Number(formData.tax)} /></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default EditInvoicePage;
