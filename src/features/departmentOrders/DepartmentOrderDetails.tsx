import { TableBody, Typography, TableRow } from '@mui/material';
import { formatDistance, parseISO } from 'date-fns';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  ContainerColumnBox,
  ContainerRowBox,
  StyledButton,
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../../components/custom';
import { selectUser } from '../auth/authSlice';
import {
  approveOrderById,
  selectDepartmentOrderById,
} from './departmentOrdersSlice';

const DepartmentOrderDetails = ({ orderId }: { orderId: string }) => {
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);

  const departmentOrder = useAppSelector((state: RootState) =>
    selectDepartmentOrderById(state, orderId)
  );

  const handleApproveOrder = () => {
    dispatch(
      approveOrderById({
        token: user.token,
        orderid: departmentOrder?._id,
        status: 'approve',
      })
    );
  };
  return (
    <StyledPaper>
      <ContainerRowBox
        sx={{
          columnGap: '5px',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <Typography variant="h2">Order summary</Typography>
        <Typography
          sx={{ fontSize: '0.75rem' }}
          color="secondary"
        >
          {departmentOrder &&
            formatDistance(parseISO(departmentOrder?.createdAt), new Date(), {
              addSuffix: true,
            })}
        </Typography>
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
                  <StyledTableCell>{departmentOrder?.itemname}</StyledTableCell>
                  <StyledTableCell>{departmentOrder?.itemtype}</StyledTableCell>
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
        <ContainerColumnBox sx={{ marginTop: '1rem' }}>
          <StyledButton
            color="success"
            variant="contained"
            sx={{
              padding: '1rem 0',
              boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
            }}
            onClick={handleApproveOrder}
          >
            Approve Order
          </StyledButton>
        </ContainerColumnBox>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default DepartmentOrderDetails;
