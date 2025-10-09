import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { appliancesApi } from './api/appliancesApi';
import { manufacturersApi } from './api/manufacturersApi';
import { employeesApi } from './api/employeesApi';
import { clientsApi } from './api/clientsApi';
import { ordersApi } from './api/ordersApi';
import { localeApi } from './api/localeApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [appliancesApi.reducerPath]: appliancesApi.reducer,
    [manufacturersApi.reducerPath]: manufacturersApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    auth: authReducer,
    ui: uiReducer,
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(appliancesApi.middleware)
      .concat(manufacturersApi.middleware)
      .concat(employeesApi.middleware)
      .concat(clientsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(localeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
