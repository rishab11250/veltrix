import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import invoiceReducer from './features/invoiceSlice';
import clientReducer from './features/clientSlice';
import uiReducer from './features/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    invoice: invoiceReducer,
    client: clientReducer,
    ui: uiReducer,
  },
});
