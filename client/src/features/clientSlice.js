import { createSlice } from '@reduxjs/toolkit';

const clientSlice = createSlice({
  name: 'client',
  initialState: {
    clients: [],
    currentClient: null,
    loading: false,
    error: null,
  },
  reducers: {},
});

export default clientSlice.reducer;
