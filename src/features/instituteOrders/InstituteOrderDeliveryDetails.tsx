import { EditRounded, PrintRounded } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  TableBody,
  TableRow,
  Typography,
} from '@mui/material';
import { parseISO, format } from 'date-fns';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import { InstituteOrder, InstituteOrderItem } from '../../types/custom';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
import {
  fetchAllOrdersOfInstitute,
  lockOrderOfInstitute,
  resetdelivery,
  selectInstituteOrderById,
  updatedelivery,
} from './instituteOrdersSlice';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
const InstituteOrderDeliveryDetails = ({ orderId }: { orderId: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const orderDetail = useAppSelector((state: RootState) =>
    selectInstituteOrderById(state, orderId)
  ) as InstituteOrder;
  console.log(orderDetail);
  const [updatedOrders, setUpdatedOrders] = useState<InstituteOrderItem[]>([]);
  const updatedeliveryStatus = useAppSelector(
    (state) => state.instituteOrders.updatedelivery
  );
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

  const handleUpdateDelivery = () => {
    dispatch(
      updatedelivery({
        token: userToken,
        order: { ...orderDetail, items: updatedOrders },
      })
    );
  };

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

  const handleUpdateDeliveryStatus = (
    e: ChangeEvent<HTMLInputElement>,
    item: InstituteOrderItem
  ) => {
    if (e.target.checked === true) setUpdatedOrders([...updatedOrders, item]);
    if (e.target.checked === false)
      setUpdatedOrders(updatedOrders.filter((i) => item._id !== i._id));
  };

  useEffect(() => {
    if (updatedeliveryStatus === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Order delivery updated successfully',
          snackbarType: 'success',
        })
      );
    dispatch(resetdelivery());
  }, [updatedeliveryStatus]);
  const handleSubmitStatus = () => {
    console.log(orderDetail);
  };

  useEffect(() => {
    setUpdatedOrders([]);
  }, [orderId]);
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
              'hh:mm a do MMM yyyy'
            )}`}
          </Typography>
          <IconButton
            color="success"
            onClick={handlePrint}
          >
            <PrintRounded color="success" />
          </IconButton>

          {/* {orderDetail.status === 'pending' && (
            <IconButton
              color="info"
              onClick={handleRedirect.bind(this, 'place-order')}
            >
              <EditRounded color="info" />
            </IconButton>
          )} */}
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
          Order Id: {orderDetail._id}
        </Typography>
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
              <StyledTableHeadCell>SHG name</StyledTableHeadCell>
              <StyledTableHeadCell>Item name</StyledTableHeadCell>
              {/* <StyledTableHeadCell>Item type</StyledTableHeadCell> */}
              <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
              <StyledTableHeadCell>Item Price</StyledTableHeadCell>
              <StyledTableHeadCell>Received</StyledTableHeadCell>
              <StyledTableHeadCell>Payment Received</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          {/* TODO: Convert this to a list when the data changes from the api side */}
          <TableBody>
            {orderDetail &&
              orderDetail.items
                .filter((item) => item.accepted === true)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={index}
                  >
                    <StyledTableCell>{item.shgid.name}</StyledTableCell>
                    <StyledTableCell>{item.itemname}</StyledTableCell>
                    {/* <StyledTableCell>{item.itemtype}</StyledTableCell> */}
                    <StyledTableCell>{item.itemquantity}</StyledTableCell>
                    <StyledTableCell>&#x20b9;{item.itemprice}</StyledTableCell>
                    <StyledTableCell>
                      {item.delivered ? (
                        <Checkbox
                          checked={true}
                          disabled={true}
                        />
                      ) : (
                        <Checkbox
                          checked={
                            updatedOrders.find((i) => i._id === item._id) !==
                            undefined
                          }
                          onChange={(e) => handleUpdateDeliveryStatus(e, item)}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.paymentreceived ? (
                        <Checkbox
                          checked={true}
                          disabled={true}
                        />
                      ) : (
                        <Checkbox
                          checked={false}
                          disabled={true}
                        />
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
                count={orderDetail.items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </StyledTable>
        <StyledButton
          variant="contained"
          onClick={handleUpdateDelivery}
          sx={{
            padding: '0.5rem 0',
            boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
            margin: '0.2rem 0',
          }}
        >
          Submit
        </StyledButton>
        <ContainerColumnBox>
          {orderDetail.status !== 'pending' &&
            orderDetail.status !== 'approved' &&
            orderDetail.status !== 'cancelled' && (
              <StyledButton
                // disabled={
                //   orderDetail.status === 'approved' ||
                //   orderDetail.status === 'completed'
                //     ? true
                //     : false
                // }
                // startIcon={
                //   lockOrderStatus === 'loading' ? (
                //     <CircularProgress sx={{ color: 'white' }} />
                //   ) : null
                // }
                onClick={() => navigate(`../generatebill/${orderDetail._id}`)}
                color="info"
                variant="contained"
                sx={{
                  padding: '0.5rem 0',
                  boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
                }}
                // onClick={async () => {
                //   await dispatch(
                //     lockOrderOfInstitute({ token: userToken, orderId: orderId })
                //   );
                //   callSnackbar();
                //   await dispatch(fetchAllOrdersOfInstitute(userToken));
                // }}
              >
                Generate Bill
              </StyledButton>
            )}
        </ContainerColumnBox>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default InstituteOrderDeliveryDetails;
