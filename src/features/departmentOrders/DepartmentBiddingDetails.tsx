import { PrintRounded } from '@mui/icons-material';
import { IconButton, TableBody, TableRow, Typography } from '@mui/material';
import { formatDistance, parseISO } from 'date-fns';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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
  approveBidByIds,
  Bidder,
  fetchDepartmentOrders,
  SHGProduct,
} from './departmentOrdersSlice';

interface DepartmentBiddingDetailsProps {
  productsBidded: SHGProduct[] | undefined;
  createdAt: string;
  status: 'pending' | 'approved';
  bidInfo: Bidder;
  orderId: string;
}
const DepartmentBiddingDetails = ({
  bidInfo,
  productsBidded,
  createdAt,
  status,
  orderId,
}: DepartmentBiddingDetailsProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const bidRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => bidRef.current,
  });
  let ApproveButtonContent;
  switch (status) {
    case 'pending':
      ApproveButtonContent = {
        disabled: false,
        text: 'Approve this bid',
      };
      break;
    case 'approved':
      ApproveButtonContent = {
        disabled: true,
        text: 'Bid Approved',
      };
      break;
  }

  const handleApproveBid = async (orderId: string, shgId: string) => {
    await dispatch(
      approveBidByIds({ orderId: orderId, shgId: shgId, token: user.token })
    );
    await dispatch(fetchDepartmentOrders(user.token));
  };
  return (
    <StyledPaper ref={bidRef}>
      <ContainerRowBox
        sx={{
          columnGap: '5px',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <Typography variant="h2">Bid Summary</Typography>
        <ContainerRowBox>
          <IconButton
            color="success"
            onClick={handlePrint}
          >
            <PrintRounded color="success" />
          </IconButton>
          <Typography
            sx={{ fontSize: '0.75rem' }}
            color="secondary"
          >
            {formatDistance(parseISO(createdAt), new Date(), {
              addSuffix: true,
            })}
          </Typography>
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
              <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {productsBidded?.map((product, index: number) => (
              <StyledTableRow
                sx={{ fontSize: '0.875rem' }}
                key={index}
              >
                <StyledTableCell>{product?.shgproduct}</StyledTableCell>
                <StyledTableCell>
                  {product?.quantity}
                  {''}
                  {product.unit}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
        <ContainerColumnBox sx={{ marginTop: '1rem' }}>
          <StyledButton
            color="success"
            variant="contained"
            disabled={ApproveButtonContent.disabled}
            sx={{
              padding: '1rem 0',
              boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
            }}
            onClick={() => {
              handleApproveBid(orderId, bidInfo.shgId);
            }}
          >
            {ApproveButtonContent.text}
          </StyledButton>
        </ContainerColumnBox>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default DepartmentBiddingDetails;
