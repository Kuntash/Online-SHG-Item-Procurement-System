import { PrintRounded } from '@mui/icons-material';
import { IconButton, TableBody, TableRow, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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
  StyledTextField,
} from '../../components/custom';
import { SHGProduct } from '../../types/custom';
import { selectUser } from '../auth/authSlice';
import { Bidder } from '../../types/custom';
interface InstituteBiddingDetailsProps {
  productsBidded: SHGProduct[] | undefined;
  createdAt: string;
  bidInfo: Bidder;
  orderId: string;
}
const InstituteBiddingDetails = ({
  bidInfo,
  productsBidded,
  createdAt,
  orderId,
}: InstituteBiddingDetailsProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const bidRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => bidRef.current,
  });
  let ApproveButtonContent;
  switch (bidInfo.status) {
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
    case 'cancelled':
      ApproveButtonContent = {
        disabled: true,
        text: 'This bid has been cancelled',
      };
  }
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
            {`at ${format(parseISO(createdAt), 'h:m a do MMM yyyy')}`}
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
            SHG name:
          </Typography>
          <Typography>{bidInfo.shgname}</Typography>
        </ContainerRowBox>
        <ContainerRowBox sx={{ columnGap: '0.5rem' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: 'greyColor.main',
            }}
          >
            Contact:
          </Typography>

          <Typography>{bidInfo.shgcontact}</Typography>
        </ContainerRowBox>
        <StyledStatus
          sx={{
            backgroundColor:
              bidInfo.status === 'cancelled'
                ? 'error.light'
                : bidInfo.status === 'approved'
                ? 'success.light'
                : 'warning.light',
            color:
              bidInfo.status === 'cancelled'
                ? 'error.main'
                : bidInfo.status === 'approved'
                ? 'success.main'
                : 'warning.main',
          }}
        >
          {bidInfo.status}
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
              <StyledTableHeadCell>Max. quantity</StyledTableHeadCell>
              <StyledTableHeadCell>Selected Quantity</StyledTableHeadCell>

              <StyledTableHeadCell>Unit price</StyledTableHeadCell>
              <StyledTableHeadCell>Total price</StyledTableHeadCell>
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
                  {product?.quantity} {product.unit}
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    type="number"
                    sx={{ width: 'unset' }}
                  />
                </StyledTableCell>

                <StyledTableCell>Rs. {product?.quantity}</StyledTableCell>
                <StyledTableCell>Rs. {product?.totalprice }</StyledTableCell>
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
              // handleApproveBid(orderId, bidInfo.shgId);
            }}
          >
            {ApproveButtonContent.text}
          </StyledButton>
        </ContainerColumnBox>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default InstituteBiddingDetails;
