import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'dark',
    sidebarOpen: true,
  },
  reducers: {},
});

export default uiSlice.reducer;
