import {
  Grid,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchOrders, selectAllOrders } from './ordersSlice';
import {
  StyledContainer,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHeadCell,
  StyledTableRow,
} from '../../components/custom';
import { RootState } from '../../app/store';
import { parseISO, format } from 'date-fns';

const ViewOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);

  const formatedOrders = orders.map((order, index) => ({
    ...order,
    backgroundColor:
      order.orderStatus === 'cancelled'
        ? 'error.light'
        : order.orderStatus === 'ordered'
        ? 'success.light'
        : 'warning.light',
    color:
      order.orderStatus === 'cancelled'
        ? 'error.main'
        : order.orderStatus === 'ordered'
        ? 'success.main'
        : 'warning.main',
    orderDate: format(parseISO(order.orderDate), 'do MMM yyyy'),
  }));
  const ordersStatus = useAppSelector(
    (state: RootState) => state.orders.status
  );

  useEffect(() => {
    if (ordersStatus === 'idle') dispatch(fetchOrders());
  }, [ordersStatus, dispatch]);

  if (ordersStatus === 'loading') return <h1>Loading</h1>;
  return (
    <>
      <StyledContainer sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid
            item
            xs={12}
          >
            <StyledPaper sx={{ padding: '1rem' }}>
              <Typography
                variant="h2"
                sx={{ marginBottom: '1rem' }}
              >
                Orders Table
              </Typography>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>Order Id</StyledTableHeadCell>
                    <StyledTableHeadCell>Order date</StyledTableHeadCell>
                    <StyledTableHeadCell>Status</StyledTableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formatedOrders.map((order, index) => (
                    <StyledTableRow key={order.orderId}>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        {order.orderId}
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
                          {order.orderStatus}
                        </StyledStatus>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </StyledTable>
            </StyledPaper>
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

export default ViewOrders;
