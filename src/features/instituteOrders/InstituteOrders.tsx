import {
  Grid,
  TableBody,
  TableRow,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
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
import { ChevronRightRounded,Edit, EditRounded } from '@mui/icons-material';
import InstituteOrderDetails from './InstituteOrderDetails';
import InstituteBiddings from './InstituteBiddings';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { InstituteOrder } from '../../types/custom';
import Loading2 from '../../components/utility/Loading2';
import { StyledTextField } from '../../components/custom';
import SearchIcon from '@mui/icons-material/Search';
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
  const [filteredOrders, setFilteredOrders] = useState<any>([]);
  const [search, setsearch] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length)
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
    setFilteredOrders(
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
    id: filteredOrders[0]?._id,
  });
  const ordersStatus = useAppSelector(
    (state: RootState) => state.instituteOrders.status
  );
  useEffect(() => {
    setSelectedRow({ index: 0, id: filteredOrders[0]?._id });
  }, [orders, filteredOrders]);
  useEffect(() => {
    if (user.status === 'succeeded')
      dispatch(fetchAllOrdersOfInstitute(user.token));
  }, [dispatch, user]);
  const handlesearchfilter = (e: any) => {
    e.preventDefault();
    if (search === '') {
      setFilteredOrders(formattedOrders);
    } else {
      setFilteredOrders(
        formattedOrders.filter(
          (order: any) =>
            order._id.toLowerCase().includes(search.toLowerCase()) ||
            order.orderDate.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const handleOrderModify = (e:React.MouseEvent<SVGSVGElement, MouseEvent>,order:any) => {
    e.stopPropagation();
    console.log("click")
  }
  if (ordersStatus === 'loading') return <Loading2 />;
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
                    All Orders
                  </Typography>
                </Grid>
                <Grid item>
                  <form onSubmit={(e) => handlesearchfilter(e)}>
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
                              onClick={(e) => handlesearchfilter(e)}
                              onMouseDown={(e) => handlesearchfilter(e)}
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
                  {filteredOrders
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
                          <EditRounded sx={{
                            ':hover':{
                              color:'Highlight'
                            },
                            paddingleft: '1rem',
                            paddingright: '1rem',
                          }} color="primary" onClick={(e)=>handleOrderModify(e,order)} />
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
                      count={filteredOrders.length}
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

          {/* <InstituteBiddings orderId={selectedRow.id} /> */}
        </Grid>
      </StyledContainer>
    </>
  );
};

export default InstituteOrders;
