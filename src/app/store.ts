import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/instituteOrders/ordersSlice';
import itemsReducer from '../features/instituteItems/itemsSlice';
import departmentOrdersReducer from '../features/departmentOrders/departmentOrdersSlice';
import utilityReducer from '../features/utilityStates/utilitySlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    items: itemsReducer,
    departmentOrders: departmentOrdersReducer,
    utility: utilityReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
