import axiosInstance from './axiosInstance';

const getClients = async () => {
  const response = await axiosInstance.get('/clients');
  return response.data.data;
};

const getClient = async (id) => {
  const response = await axiosInstance.get(`/clients/${id}`);
  return response.data.data;
};

const createClient = async (clientData) => {
  const response = await axiosInstance.post('/clients', clientData);
  return response.data.data;
};

const updateClient = async (params) => {
  const response = await axiosInstance.put(`/clients/${params.id}`, params.data);
  return response.data.data;
};

const deleteClient = async (id) => {
  const response = await axiosInstance.delete(`/clients/${id}`);
  return response.data;
};

const clientService = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};

export default clientService;
