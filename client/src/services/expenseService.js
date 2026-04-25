import axiosInstance from './axiosInstance';

const getExpenses = async () => {
  const response = await axiosInstance.get('/expenses');
  return response.data;
};

const createExpense = async (expenseData) => {
  const response = await axiosInstance.post('/expenses', expenseData);
  return response.data;
};

const updateExpense = async (id, expenseData) => {
  const response = await axiosInstance.put(`/expenses/${id}`, expenseData);
  return response.data;
};

const deleteExpense = async (id) => {
  const response = await axiosInstance.delete(`/expenses/${id}`);
  return response.data;
};

const expenseService = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};

export default expenseService;
