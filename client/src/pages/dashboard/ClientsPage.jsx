import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, deleteClient } from '../../store/slices/clientSlice';
import PageWrapper from '../../components/layout/PageWrapper';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import ClientModal from '../../components/clients/ClientModal';

const ClientsPage = () => {
  const dispatch = useDispatch();
  const { clients, isLoading } = useSelector((state) => state.client);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => { dispatch(getClients()); }, [dispatch]);

  const handleOpenModal = (client = null) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this client?')) dispatch(deleteClient(id));
  };

  const columns = [
    { 
      header: 'Client Name', accessor: 'name',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex justify-center items-center font-bold text-xs uppercase">{r.name[0]}</div>
          <span className="font-semibold text-white">{r.name}</span>
        </div>
      )
    },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleOpenModal(r)} className="text-text-muted hover:text-primary transition-colors text-sm font-medium">Edit</button>
          <button onClick={() => handleDelete(r._id)} className="text-text-muted hover:text-error transition-colors text-sm font-medium">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper title="Clients" actions={<Button onClick={() => handleOpenModal()}>+ New Client</Button>}>
      <div className="hidden md:block">
        <Table columns={columns} data={clients} loading={isLoading} />
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 pb-20">
        {isLoading ? <div className="text-center py-10 text-text-muted">Loading...</div> :
         clients.length === 0 ? <div className="text-center py-10 text-text-muted">No clients found</div> :
         clients.map(c => (
          <div key={c._id} className="bg-[#121212] border border-[#1E1E1E] p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">{c.name[0]}</div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{c.name}</h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">{c.email || 'No Email'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleOpenModal(c)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined text-sm">edit</span></button>
                <button onClick={() => handleDelete(c._id)} className="text-text-muted hover:text-error"><span className="material-symbols-outlined text-sm">delete</span></button>
              </div>
            </div>
            {c.phone && <div className="flex items-center gap-2 text-xs text-text-muted"><span className="material-symbols-outlined text-sm">phone</span>{c.phone}</div>}
          </div>
         ))}
      </div>

      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} clientToEdit={clientToEdit} />
    </PageWrapper>
  );
};

export default ClientsPage;
