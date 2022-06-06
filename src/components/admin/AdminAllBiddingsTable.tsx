import { Alert, TableBody, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminOrderBid } from '../../types/custom';
import {
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../custom';

interface AdminBiddingDetailsTableProps {
  bids: AdminOrderBid[];
  orderId: string;
  tableTitle: string;
}
const AdminAllBiddingsTable = ({
  bids,
  orderId,
  tableTitle,
}: AdminBiddingDetailsTableProps) => {
  const navigate = useNavigate();
  const handleRedirect = (currentBid: AdminOrderBid, orderId: string) => {
    navigate(`../../../bids/${currentBid._id}`, {
      replace: true,
      state: {
        orderId,
        bid: currentBid,
      },
    });
  };
  return (
    <StyledPaper sx={{ marginBottom: '1rem' }}>
      <Typography
        variant="h2"
        sx={{ marginBottom: '1rem' }}
      >
        {tableTitle}
      </Typography>
      {bids.length === 0 ? (
        <Alert color="info">No bids.</Alert>
      ) : (
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeadCell>Bid no.</StyledTableHeadCell>
              <StyledTableHeadCell>SHG name</StyledTableHeadCell>
              <StyledTableHeadCell>SHG location</StyledTableHeadCell>
              <StyledTableHeadCell>SHG contact no.</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {bids.map((bid, index) => (
              <StyledTableRow
                key={bid._id}
                onClick={() => {
                  handleRedirect(bid, orderId);
                }}
              >
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{bid.shgname}</StyledTableCell>
                <StyledTableCell>{bid.shglocation}</StyledTableCell>
                <StyledTableCell>{bid.shgcontact}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      )}
    </StyledPaper>
  );
};

export default AdminAllBiddingsTable;
