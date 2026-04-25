import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from '../../services/expenseService';

const initialState = {
  expenses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getExpenses = createAsyncThunk('expenses/getAll', async (_, thunkAPI) => {
  try {
    const response = await expenseService.getExpenses();
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createExpense = createAsyncThunk('expenses/create', async (expenseData, thunkAPI) => {
  try {
    const response = await expenseService.createExpense(expenseData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateExpense = createAsyncThunk('expenses/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await expenseService.updateExpense(id, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id, thunkAPI) => {
  try {
    await expenseService.deleteExpense(id);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = action.payload.data || action.payload;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newExpense = action.payload.data || action.payload;
        state.expenses.unshift(newExpense);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedExpense = action.payload.data || action.payload;
        state.expenses = state.expenses.map((exp) => 
          exp._id === updatedExpense._id ? updatedExpense : exp
        );
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((exp) => exp._id !== action.payload);
      });
  },
});

export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;
