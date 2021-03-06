import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import instituteOrdersReducer from '../features/instituteOrders/instituteOrdersSlice';
import itemsReducer from '../features/instituteItems/itemsSlice';
import departmentOrdersReducer from '../features/departmentOrders/departmentOrdersSlice';
import utilityReducer from '../features/utilityStates/utilitySlice';
import adminDataReducer from '../features/adminData/adminDataSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    instituteOrders: instituteOrdersReducer,
    items: itemsReducer,
    departmentOrders: departmentOrdersReducer,
    utility: utilityReducer,
    admin: adminDataReducer,
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
