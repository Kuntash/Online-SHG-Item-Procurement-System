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
  StyledTablePagination,
} from '../../components/custom';
import { ChevronRightRounded } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import DepartmentOrderDetails from './DepartmentOrderDetails';
import DepartmentBiddings from './DepartmentBiddings';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
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
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - departmentOrders.length)
      : 0;

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

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
                  {(rowsPerPage > 0
                    ? departmentFormattedOrders.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : departmentFormattedOrders
                  ).map((order: any, index: number) => (
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
                      count={departmentOrders.length}
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
            <DepartmentOrderDetails orderId={selectedRow?.id} />
          </Grid>
          
          <DepartmentBiddings orderId={selectedRow?.id} />
        </Grid>
      </StyledContainer>
    </>
  );
};

export default DepartmentOrders;
