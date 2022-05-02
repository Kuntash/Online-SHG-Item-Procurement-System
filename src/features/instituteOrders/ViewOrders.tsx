import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchAllOrdersOfInstitute, selectAllOrders } from './ordersSlice';
import {
  StyledContainer,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../../components/custom';
import { RootState } from '../../app/store';
import { parseISO, format } from 'date-fns';
import { selectUser } from '../auth/authSlice';
import { Order } from './ordersSlice';
import { ChevronRightRounded } from '@mui/icons-material';
import InstituteOrderDetails from './InstituteOrderDetails';

export interface FormattedOrdersType extends Order {
  backgroundColor?: string;
  color?: string;
  orderDate?: string;
}

const ViewOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const user = useAppSelector(selectUser);
  const [formattedOrders, setFormattedOrders] = useState<any>([]);

  useEffect(() => {
    setFormattedOrders(
      orders.map((order, index) => ({
        ...order,
        backgroundColor:
          order.status === 'cancelled'
            ? 'error.light'
            : order.status === 'approved'
            ? 'success.light'
            : 'warning.light',
        color:
          order.status === 'cancelled'
            ? 'error.main'
            : order.status === 'approved'
            ? 'success.main'
            : 'warning.main',
        orderDate: format(parseISO(order.createdAt), 'do MMM yyyy'),
      }))
    );
  }, [orders]);

  const [selectedRow, setSelectedRow] = useState<{
    index: number;
    id: string;
  }>({
    index: 0,
    id: formattedOrders[0]?._id,
  });
  const ordersStatus = useAppSelector(
    (state: RootState) => state.orders.status
  );
  useEffect(() => {
    setSelectedRow({ index: 0, id: formattedOrders[0]?._id });
  }, [orders, formattedOrders]);
  useEffect(() => {
    if (user.status === 'succeeded')
      dispatch(fetchAllOrdersOfInstitute(user.token));
  }, [dispatch, user]);

  if (ordersStatus === 'loading') return <h1>Loading</h1>;
  return (
    <>
      <StyledContainer sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            xs={12}
            md={7}
          >
            <StyledPaper sx={{ padding: '1rem' }}>
              <Typography
                variant="h2"
                sx={{ marginBottom: '1rem' }}
              >
                All Orders
              </Typography>
              <StyledTable>
                <StyledTableHead sx={{ fontSize: '1rem' }}>
                  <TableRow>
                    <StyledTableHeadCell>Order Id</StyledTableHeadCell>
                    <StyledTableHeadCell>Order date</StyledTableHeadCell>
                    <StyledTableHeadCell>Status</StyledTableHeadCell>
                    <StyledTableHeadCell></StyledTableHeadCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {formattedOrders.map((order: any, index: number) => (
                    <StyledTableRow
                      sx={{ fontSize: '0.875rem' }}
                      key={order._id}
                      selected={selectedRow.index === index}
                      onClick={() => {
                        setSelectedRow({ index, id: order._id });
                      }}
                    >
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        {order._id}
                      </StyledTableCell>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        {order.orderDate}
                      </StyledTableCell>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        <StyledStatus
                          sx={{
                            color: order.color,
                            backgroundColor: order.backgroundColor,
                          }}
                        >
                          {order.status}
                        </StyledStatus>
                      </StyledTableCell>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        <ChevronRightRounded color="primary" />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </StyledPaper>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <InstituteOrderDetails orderId={selectedRow.id} />
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

export default ViewOrders;
