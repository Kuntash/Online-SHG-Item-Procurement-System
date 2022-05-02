import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../auth/authSlice';
import {
  fetchDepartmentOrders,
  selectDeparmentOrders,
} from './departmentOrdersSlice';
import {
  StyledPaper,
  StyledContainer,
  StyledTable,
  StyledTableHeadCell,
  StyledTableCell,
  StyledTableRow,
  StyledTableHead,
  StyledStatus,
} from '../../components/custom';
import { ChevronRightRounded } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import DepartmentOrderDetails from './DepartmentOrderDetails';
import DepartmentBiddings from './DepartmentBiddings';
const DepartmentOrders = () => {
  const dispatch = useAppDispatch();
  const departmentOrders = useAppSelector(selectDeparmentOrders);
  const user = useAppSelector(selectUser);
  const [departmentFormattedOrders, setDepartmentFormattedOrders] =
    useState<any>([]);

  const [selectedRow, setSelectedRow] = useState<
    | {
        index: number;
        id: string;
      }
    | undefined
  >();
  useEffect(() => {
    setDepartmentFormattedOrders(
      departmentOrders.map((departmentOrder, index) => ({
        ...departmentOrder,
        backgroundColor:
          departmentOrder.status === 'cancelled'
            ? 'error.light'
            : departmentOrder.status === 'approved'
            ? 'success.light'
            : departmentOrder.status === 'completed'
            ? 'success.light'
            : 'warning.light',
        color:
          departmentOrder.status === 'cancelled'
            ? 'error.main'
            : departmentOrder.status === 'approved'
            ? 'success.main'
            : departmentOrder.status === 'completed'
            ? 'white'
            : 'warning.main',
        orderDate: format(parseISO(departmentOrder.createdAt), 'do MMM yyyy'),
      }))
    );
  }, [departmentOrders]);

  useEffect(() => {
    if (user.status === 'succeeded')
      dispatch(fetchDepartmentOrders(user.token));
  }, [dispatch, user]);

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
                    {/* <StyledTableHeadCell>Order Id</StyledTableHeadCell> */}
                    <StyledTableHeadCell>Order date</StyledTableHeadCell>
                    <StyledTableHeadCell>Institute name</StyledTableHeadCell>
                    <StyledTableHeadCell>
                      Institute location
                    </StyledTableHeadCell>
                    <StyledTableHeadCell>Status</StyledTableHeadCell>
                    <StyledTableHeadCell></StyledTableHeadCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {departmentFormattedOrders.map(
                    (order: any, index: number) => (
                      <StyledTableRow
                        sx={{ fontSize: '0.875rem' }}
                        key={order._id}
                        selected={selectedRow?.index === index}
                        onClick={() => {
                          setSelectedRow({ index, id: order._id });
                        }}
                      >
                        {/* <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {order._id}
                        </StyledTableCell> */}
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {order.orderDate}
                        </StyledTableCell>
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {order.institutename}
                        </StyledTableCell>
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {order.institutelocation}
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
                          {selectedRow?.index === index && (
                            <ChevronRightRounded color="primary" />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  )}
                </TableBody>
              </StyledTable>
            </StyledPaper>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
          >
            <DepartmentOrderDetails orderId={selectedRow?.id} />
          </Grid>

          <DepartmentBiddings orderId={selectedRow?.id} />
        </Grid>
      </StyledContainer>
    </>
  );
};

export default DepartmentOrders;
