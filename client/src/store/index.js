import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import invoiceReducer from './slices/invoiceSlice';
import clientReducer from './slices/clientSlice';
import paymentReducer from './slices/paymentSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    invoice: invoiceReducer,
    client: clientReducer,
    payment: paymentReducer,
    ui: uiReducer,
  },
});
