import { ChevronRightRounded } from '@mui/icons-material';
import { Alert, Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../../components/custom';
import { Bidder } from '../departmentOrders/departmentOrdersSlice';
import InstituteBiddingDetails from './InstituteBiddingDetails';
import { selectInstituteOrderById } from './instituteOrdersSlice';

interface BiddingProps {
  orderId: string | undefined;
}
const InstituteBiddings = ({ orderId }: BiddingProps) => {
  const instituteOrder = useAppSelector((state: RootState) => {
    if (orderId === undefined) return undefined;
    return selectInstituteOrderById(state, orderId);
  });

  const [selectedRow, setSelectedRow] = useState<number>(0);

  return (
    <>
      <Grid
        item
        sx={{ flexGrow: 1 }}
        xs={12}
        md={5}
      >
        <StyledPaper sx={{ padding: '1rem' }}>
          {instituteOrder?.bid.length !== 0 ? (
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              Biddings
            </Typography>
          ) : (
            <Alert severity="info">No biddings yet</Alert>
          )}
          {instituteOrder?.bid.length !== 0 && (
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  <StyledTableHeadCell>Shg name</StyledTableHeadCell>
                  <StyledTableHeadCell>Shg location</StyledTableHeadCell>
                  <StyledTableHeadCell>Shg contact</StyledTableHeadCell>
                  <StyledTableHeadCell></StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {instituteOrder &&
                  instituteOrder.bid.map((bidder: Bidder, index: number) => (
                    <StyledTableRow
                      sx={{ fontSize: '0.875rem' }}
                      key={index}
                      selected={selectedRow === index}
                      onClick={() => {
                        setSelectedRow(index);
                      }}
                    >
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        {bidder.shgname}
                      </StyledTableCell>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        {bidder.shglocation}
                      </StyledTableCell>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        {bidder.shgcontact}
                      </StyledTableCell>
                      <StyledTableCell sx={{ marginTop: '1rem' }}>
                        <ChevronRightRounded color="primary" />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </StyledTable>
          )}
        </StyledPaper>
      </Grid>
      {instituteOrder?.bid[selectedRow] ? (
        <Grid
          item
          xs={12}
          md={7}
        >
          <InstituteBiddingDetails
            bidInfo={instituteOrder?.bid[selectedRow]}
            productsBidded={instituteOrder?.bid[selectedRow]?.products}
            createdAt={instituteOrder?.bid[selectedRow]?.createdAt}
            orderId={instituteOrder._id}
          />
        </Grid>
      ) : null}
    </>
  );
};

export default InstituteBiddings;
