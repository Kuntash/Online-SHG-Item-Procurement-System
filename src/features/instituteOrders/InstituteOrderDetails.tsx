import { EditRounded, PrintRounded } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  TableBody,
  TableRow,
  Typography,
} from '@mui/material';
import { parseISO, format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledPaper,
  ContainerColumnBox,
  ContainerRowBox,
  StyledTable,
  StyledTableHead,
  StyledTableCell,
  StyledTableHeadCell,
  StyledTableRow,
  StyledTablePagination,
  StyledButton,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { InstituteOrder } from '../../types/custom';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
import {
  fetchAllOrdersOfInstitute,
  lockOrderOfInstitute,
  selectInstituteOrderById,
} from './instituteOrdersSlice';
const InstituteOrderDetails = ({ orderId }: { orderId: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const orderDetail = useAppSelector((state: RootState) =>
    selectInstituteOrderById(state, orderId)
  ) as InstituteOrder;
  const lockOrderStatus = useAppSelector(
    (state: RootState) => state.instituteOrders.lockOrderStatus
  );
  const orderDetailRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => orderDetailRef.current,
  });
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(
    0,
    (1 + page) * rowsPerPage - orderDetail?.items?.length
  );

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRedirect = (path: string) => {
    navigate(`../${path}`, {
      replace: true,
      state: {
        items: orderDetail.items,
        id: orderDetail._id,
      },
    });
  };
  const callSnackbar = () => {
    if (lockOrderStatus === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Locking Order',
          snackbarType: 'info',
        })
      );
    else if (lockOrderStatus === 'failed')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Error occurred while locking order',
          snackbarType: 'error',
        })
      );
    else if (lockOrderStatus === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Order successfully locked',
          snackbarType: 'success',
        })
      );
  };
  // Create a Style Component
  if (orderDetail === undefined) return <h1> Order Not found</h1>;
  return (
    <StyledPaper ref={orderDetailRef}>
      <ContainerRowBox
        sx={{
          columnGap: '5px',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <Typography variant="h2">Order summary</Typography>
        <ContainerRowBox>
          <Typography
            sx={{ fontSize: '0.75rem' }}
            color="secondary"
          >
            {`at ${format(
              parseISO(orderDetail.createdAt),
              'h:m a do MMM yyyy'
            )}`}
          </Typography>
          <IconButton
            color="success"
            onClick={handlePrint}
          >
            <PrintRounded color="success" />
          </IconButton>

          {orderDetail.status === 'pending' && (
            <IconButton
              color="info"
              onClick={handleRedirect.bind(this, 'place-order')}
            >
              <EditRounded color="info" />
            </IconButton>
          )}
        </ContainerRowBox>
      </ContainerRowBox>
      <ContainerColumnBox>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: 'greyColor.main',
            marginBottom: '1rem',
          }}
        >
          Item list
        </Typography>
        <StyledTable>
          <StyledTableHead sx={{ fontSize: '0.875rem' }}>
            <TableRow>
              <StyledTableHeadCell>Item name</StyledTableHeadCell>
              <StyledTableHeadCell>Item type</StyledTableHeadCell>
              <StyledTableHeadCell>Approved/Item quantity</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          {/* TODO: Convert this to a list when the data changes from the api side */}
          <TableBody>
            {orderDetail &&
              orderDetail.items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={index}
                  >
                    <StyledTableCell>{item.itemname}</StyledTableCell>
                    <StyledTableCell>{item.itemtype}</StyledTableCell>
                    <StyledTableCell>
                      {item.approvedquantity}/{item.itemquantity}
                      {''}
                      {item.itemtype === 'packed' && item.itemunit}
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
                count={orderDetail.items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </StyledTable>
        <ContainerColumnBox>
          <StyledButton
            disabled={
              orderDetail.status === 'approved' ||
              orderDetail.status === 'completed'
                ? true
                : false
            }
            startIcon={
              lockOrderStatus === 'loading' ? (
                <CircularProgress sx={{ color: 'white' }} />
              ) : null
            }
            color="info"
            variant="contained"
            sx={{
              padding: '1rem 0',
              boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
            }}
            onClick={async () => {
              await dispatch(
                lockOrderOfInstitute({ token: userToken, orderId: orderId })
              );
              callSnackbar();
              await dispatch(fetchAllOrdersOfInstitute(userToken));
            }}
          >
            {orderDetail.status === 'approved' ||
            orderDetail.status === 'completed'
              ? 'Order already locked'
              : 'Lock Order'}
          </StyledButton>
        </ContainerColumnBox>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default InstituteOrderDetails;
