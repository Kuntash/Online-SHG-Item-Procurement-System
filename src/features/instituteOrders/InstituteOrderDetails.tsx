import { TableBody, TableRow, Typography } from '@mui/material';
import { parseISO, formatDistance } from 'date-fns';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
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
} from '../../components/custom';
import { selectOrderById } from './ordersSlice';
const InstituteOrderDetails = ({ orderId }: { orderId: string }) => {
  const orderDetail = useAppSelector((state: RootState) =>
    selectOrderById(state, orderId)
  );

  // Create a Style Component
  if (orderDetail === undefined) return <h1> Order Not found</h1>;
  console.log(orderDetail);
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
          {formatDistance(parseISO(orderDetail.createdAt), new Date(), {
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
            {orderDetail &&
              orderDetail.items.map((item, index) => (
                <StyledTableRow sx={{ fontSize: '0.875rem' }}>
                  <StyledTableCell>{item.itemname}</StyledTableCell>
                  <StyledTableCell>{item.itemtype}</StyledTableCell>
                  <StyledTableCell>
                    {item.itemquantity}
                    {''}
                    {item.itemtype === 'packed' && item.itemunit}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </StyledTable>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default InstituteOrderDetails;
