import { PrintRounded } from '@mui/icons-material';
import {
  TableBody,
  Typography,
  TableRow,
  Alert,
  IconButton,
  Divider,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  ContainerColumnBox,
  ContainerRowBox,
  StyledButton,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../../components/custom';
import { selectUser } from '../auth/authSlice';
import {
  approveOrderById,
  fetchDepartmentOrders,
  selectDepartmentOrderById,
} from './departmentOrdersSlice';

const DepartmentOrderDetails = ({
  orderId,
}: {
  orderId: string | undefined;
}) => {
  const orderDetailRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => orderDetailRef.current,
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const departmentOrder = useAppSelector((state: RootState) => {
    if (orderId === undefined) return undefined;
    return selectDepartmentOrderById(state, orderId);
  });

  let ApproveButtonContent;
  switch (departmentOrder?.status) {
    case 'pending':
      ApproveButtonContent = {
        disabled: false,
        text: 'Approve Order',
      };
      break;
    case 'approved':
      ApproveButtonContent = {
        disabled: true,
        text: 'Order Approved',
      };
      break;
    case 'cancelled':
      ApproveButtonContent = {
        disabled: true,
        text: 'Order Cancelled',
      };
      break;
    case 'completed':
      ApproveButtonContent = {
        disabled: true,
        text: 'Order Completed',
      };
  }
  const handleApproveOrder = async () => {
    await dispatch(
      approveOrderById({
        token: user.token,
        orderid: departmentOrder?._id,
        status: 'approve',
      })
    );
    await dispatch(fetchDepartmentOrders(user.token));
  };

  return (
    <StyledPaper ref={orderDetailRef}>
      {departmentOrder === undefined ? (
        <Alert severity="info">Please select an Order to get its summary</Alert>
      ) : (
        <>
          <ContainerRowBox
            sx={{
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <Typography variant="h2">Order summary</Typography>
            <ContainerRowBox
              sx={{
                justifyContent: 'space-between',
              }}
            >
              <IconButton
                onClick={handlePrint}
                color="success"
              >
                <PrintRounded color="success" />
              </IconButton>
              <Typography
                sx={{ fontSize: '0.75rem' }}
                color="secondary"
              >
                {departmentOrder &&
                  `at ${format(
                    parseISO(departmentOrder?.createdAt),
                    'h:m a do MMM yyyy'
                  )}`}
              </Typography>
            </ContainerRowBox>
          </ContainerRowBox>
          <ContainerRowBox
            sx={{ marginBottom: '1rem', justifyContent: 'space-between' }}
          >
            <ContainerRowBox sx={{ columnGap: '0.5rem' }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: 'greyColor.main',
                }}
              >
                Institute:
              </Typography>
              <Typography>{departmentOrder.institutename}</Typography>
            </ContainerRowBox>
            <ContainerRowBox sx={{ columnGap: '0.5rem' }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: 'greyColor.main',
                }}
              >
                Location:
              </Typography>

              <Typography>{departmentOrder.institutelocation}</Typography>
            </ContainerRowBox>
            <StyledStatus
              sx={{
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
              }}
            >
              {departmentOrder.status}
            </StyledStatus>
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
                  <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              {/* TODO: Convert this to a list when the data changes from the api side */}
              <TableBody>
                {departmentOrder?.items.map(
                  (departmentOrder: any, index: number) => (
                    <StyledTableRow
                      sx={{ fontSize: '0.875rem' }}
                      key={index}
                    >
                      <StyledTableCell>
                        {departmentOrder?.itemname}
                      </StyledTableCell>
                      <StyledTableCell>
                        {departmentOrder?.itemtype}
                      </StyledTableCell>
                      <StyledTableCell>
                        {departmentOrder?.itemquantity}
                        {''}
                        {departmentOrder?.itemtype === 'packed' &&
                          departmentOrder?.itemunit}
                      </StyledTableCell>
                    </StyledTableRow>
                  )
                )}
              </TableBody>
            </StyledTable>
            <ContainerRowBox
              sx={{
                justifyContent: 'space-between',
                marginTop: '1rem',
                alignItems: 'center',
              }}
            >
              <StyledButton
                color="success"
                variant="contained"
                disabled={ApproveButtonContent?.disabled}
                sx={{
                  padding: '1rem 1rem',
                  boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
                }}
                onClick={handleApproveOrder}
              >
                {ApproveButtonContent?.text}
              </StyledButton>
              <ContainerColumnBox sx={{ rowGap: '0.5rem' }}>
                <Divider />
                <Typography>Signature</Typography>
              </ContainerColumnBox>
            </ContainerRowBox>
          </ContainerColumnBox>
        </>
      )}
    </StyledPaper>
  );
};

export default DepartmentOrderDetails;
