import {
  Grid,
  TableBody,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
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
import { StyledTextField } from '../../components/custom';
import SearchIcon from '@mui/icons-material/Search';
const AdminAllOrders = () => {
  const [search, setsearch] = useState<any>();
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
  const [filteredOrders, setFilteredOrders] = useState<AdminOrderDataType[]>(
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
  const filterorders = (e: any) => {
    e.preventDefault();
    const filteredOrders = ordersToDisplay.filter(
      (order) =>
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.status.toLowerCase().includes(search.toLowerCase()) ||
        order.createdAt.toLowerCase().includes(search.toLowerCase()) ||
        order.institutename.toLowerCase().includes(search.toLowerCase()) ||
        order.institutelocation.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filteredOrders);
  };
  useEffect(() => {
    setOrdersToDisplay(adminAllOrders);
    setFilteredOrders(adminAllOrders);
  }, [adminAllOrders]);

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
            <Grid
              container
              spacing={2}
              sx={{ marginBottom: '1rem' }}
            >
              <Grid item>
                <Typography
                  variant="h2"
                  sx={{ marginTop: '0.5rem' }}
                >
                  Orders
                </Typography>
              </Grid>
              <Grid item>
                <form onSubmit={(e) => filterorders(e)}>
                  <StyledTextField
                    // helperText={helperTexts.password}
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                    label="Search"
                    sx={{ borderRadius: '0.8rem', width: '100%' }}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) => filterorders(e)}
                            onMouseDown={(e) => filterorders(e)}
                            edge="end"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Grid>
            </Grid>
              <StyledContainer sx={{alignItems:'flex-end',width:'100%'}}>
                <Typography
                  variant="subtitle2" sx={{fontWeight:'bold'}}>Total Orders: {ordersToDisplay.length}</Typography>
                </StyledContainer>
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
                  ? filteredOrders.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredOrders
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
                      {order.institutelocation.toUpperCase()}
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
