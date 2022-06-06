import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledContainer,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTablePagination,
  StyledTableRow,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { AdminOrderDataType } from '../../types/custom';
import { fetchAllAdminOrders } from './adminDataSlice';
const AdminAllOrders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const orderDataStatus = useAppSelector(
    (state: RootState) => state.admin.orderData.orderDataStatus
  );
  const adminAllOrders = useAppSelector(
    (state: RootState) => state.admin.orderData.orderData
  );
  const [ordersToDisplay, setOrdersToDisplay] = useState<AdminOrderDataType[]>(
    []
  );
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(
    0,
    (1 + page) * rowsPerPage - ordersToDisplay.length
  );

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRedirect = (orderId: string) => {
    navigate(`${orderId}`);
  };
  if (orderDataStatus === 'idle') dispatch(fetchAllAdminOrders(userToken));
  useEffect(() => {
    setOrdersToDisplay(adminAllOrders);
  }, [adminAllOrders]);

  /*

  */
  return (
    <StyledContainer sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <StyledPaper>
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              Orders
            </Typography>
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  <StyledTableHeadCell>Order id</StyledTableHeadCell>
                  <StyledTableHeadCell>Ordered by</StyledTableHeadCell>
                  <StyledTableHeadCell>Institute location</StyledTableHeadCell>
                  <StyledTableHeadCell>Order status</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? ordersToDisplay.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : ordersToDisplay
                ).map((order, index: number) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={order._id}
                    onClick={() => handleRedirect(order._id)}
                  >
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      <b>{order._id}</b>
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
                        }}
                      >
                        {order.status}
                      </StyledStatus>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={5} />
                  </StyledTableRow>
                )}
                <TableRow>
                  <StyledTablePagination
                    rowsPerPageOptions={[5]}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    count={ordersToDisplay.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableBody>
            </StyledTable>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminAllOrders;
