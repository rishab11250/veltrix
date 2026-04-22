import { createSlice } from '@reduxjs/toolkit';

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
  },
  reducers: {},
});

export default invoiceSlice.reducer;
