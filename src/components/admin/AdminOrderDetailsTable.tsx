import { TableBody, TableRow, Typography } from '@mui/material';
import React from 'react';
import { AdminOrderProduct } from '../../types/custom';
import {
  StyledContainer,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../custom';

interface AdminOrderDetailsTableProps {
  orderId: string;
  orderedBy: string;
  orderedAt: string;
  department: string;
  instituteLocation: string;
  orderStatus: string;
  items: AdminOrderProduct[];
}
const AdminOrderDetailsTable = ({
  orderId,
  orderedBy,
  orderedAt,
  department,
  instituteLocation,
  orderStatus,
  items,
}: AdminOrderDetailsTableProps) => {
  const getTotalPrice = () => {
    return items.reduce((i, item) => i + item.itemprice * item.itemquantity, 0);
  };
  return (
    <StyledPaper>
      <Typography
        variant="h2"
        sx={{ marginBottom: '1rem' }}
      >
        Order details
      </Typography>
      <StyledTable>
        <StyledTableHead sx={{ fontSize: '1rem' }}>
          <TableRow>
            <StyledTableHeadCell>Order id</StyledTableHeadCell>
            <StyledTableHeadCell>Ordered by</StyledTableHeadCell>
            <StyledTableHeadCell>Ordered at</StyledTableHeadCell>
            <StyledTableHeadCell>Department</StyledTableHeadCell>
            <StyledTableHeadCell>Total Price</StyledTableHeadCell>
            <StyledTableHeadCell>Institute location</StyledTableHeadCell>
            <StyledTableHeadCell>Order status</StyledTableHeadCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          <StyledTableRow sx={{ fontSize: '0.875rem' }}>
            <StyledTableCell sx={{ marginTop: '1rem' }}>
              <b>{orderId}</b>
            </StyledTableCell>
            <StyledTableCell sx={{ marginTop: '1rem' }}>
              {orderedBy}
            </StyledTableCell>
            <StyledTableCell sx={{ marginTop: '1rem' }}>
              {orderedAt}
            </StyledTableCell>
            <StyledTableCell sx={{ marginTop: '1rem' }}>
              {department}
            </StyledTableCell>
            <StyledTableCell>{getTotalPrice()} Rs</StyledTableCell>
            <StyledTableCell sx={{ marginTop: '1rem' }}>
              {instituteLocation.toUpperCase()}
            </StyledTableCell>
            <StyledTableCell sx={{ marginTop: '1rem' }}>
              <StyledStatus
                sx={{
                  backgroundColor:
                    orderStatus === 'cancelled'
                      ? 'error.light'
                      : orderStatus === 'approved'
                      ? 'success.light'
                      : 'warning.light',
                  color:
                    orderStatus === 'cancelled'
                      ? 'error.main'
                      : orderStatus === 'approved'
                      ? 'success.main'
                      : 'warning.main',
                }}
              >
                {orderStatus}
              </StyledStatus>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </StyledTable>
    </StyledPaper>
  );
};

export default AdminOrderDetailsTable;
