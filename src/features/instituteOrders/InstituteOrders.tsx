import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAllOrdersOfInstitute,
  selectAllInstituteOrders,
} from './instituteOrdersSlice';
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
import { RootState } from '../../app/store';
import { parseISO, format } from 'date-fns';
import { selectUser } from '../auth/authSlice';
import { ChevronRightRounded } from '@mui/icons-material';
import InstituteOrderDetails from './InstituteOrderDetails';
import InstituteBiddings from './InstituteBiddings';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { InstituteOrder } from '../../types/custom';

export interface FormattedOrdersType extends InstituteOrder {
  backgroundColor?: string;
  color?: string;
  orderDate?: string;
}

const InstituteOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllInstituteOrders);
  const user = useAppSelector(selectUser);
  const [formattedOrders, setFormattedOrders] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - formattedOrders.length)
      : 0;

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

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
    (state: RootState) => state.instituteOrders.status
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
                  {formattedOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order: any, index: number) => (
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
                      count={formattedOrders.length}
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
          <Grid
            item
            xs={12}
            md={5}
          >
            <InstituteOrderDetails orderId={selectedRow.id} />
          </Grid>

          <InstituteBiddings orderId={selectedRow.id} />
        </Grid>
      </StyledContainer>
    </>
  );
};

export default InstituteOrders;
