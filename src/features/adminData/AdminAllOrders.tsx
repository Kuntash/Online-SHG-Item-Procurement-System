import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { fetchOrderByDepartmentId } from './adminDataSlice';

const AdminAllOrders = () => {
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const orderDataStatus = useAppSelector(
    (state: RootState) => state.admin.orderData.orderDataStatus
  );
  return <div>AdminAllOrders</div>;
};

export default AdminAllOrders;
