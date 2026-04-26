import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import invoiceService from '../../services/invoiceService';

const initialState = { invoices: [], invoice: null, isError: false, isSuccess: false, isLoading: false, message: '' };

export const getInvoices = createAsyncThunk('invoices/getAll', async (_, thunkAPI) => {
  try { const response = await invoiceService.getInvoices(); return response.data; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const createInvoice = createAsyncThunk('invoices/create', async (data, thunkAPI) => {
  try { const response = await invoiceService.createInvoice(data); return response.data; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateInvoice = createAsyncThunk('invoices/update', async ({ id, data }, thunkAPI) => {
  try { const response = await invoiceService.updateInvoice(id, data); return response.data; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteInvoice = createAsyncThunk('invoices/delete', async (id, thunkAPI) => {
  try { await invoiceService.deleteInvoice(id); return id; }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: { reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; } },
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending, (state) => { state.isLoading = true; })
      .addCase(getInvoices.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.invoices = action.payload.data || action.payload; })
      .addCase(getInvoices.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(createInvoice.fulfilled, (state, action) => { state.invoices.unshift(action.payload.data || action.payload); })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload;
        const index = state.invoices.findIndex(i => i._id === updated._id);
        if (index !== -1) state.invoices[index] = updated;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => { state.invoices = state.invoices.filter((inv) => inv._id !== action.payload); });
  },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
