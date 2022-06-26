import { PrintRounded } from '@mui/icons-material';
import { IconButton, TableBody, TableRow, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
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
import {
  ApproveBidProductListType,
  Bidder,
  ApprovedBidder,
  SHGProduct,
} from '../../types/custom';
import { selectUser } from '../auth/authSlice';
import {
  approveBidByInstitute,
  fetchAllOrdersOfInstitute,
} from './instituteOrdersSlice';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
interface InstituteBiddingDetailsProps {
  productsBidded: SHGProduct[];
  createdAt: string;
  bidInfo: Bidder;
  orderId: string;
  approvedBids: ApprovedBidder[];
}
const InstituteBiddingDetails = ({
  bidInfo,
  productsBidded,
  createdAt,
  orderId,
  approvedBids,
}: InstituteBiddingDetailsProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const approvebidstatus = useAppSelector((state) => state.instituteOrders);
  const bidRef = useRef<HTMLDivElement | null>(null);
  const [selectedProductsList, setSelectedProductsList] = useState<
    ApproveBidProductListType[]
  >(
    productsBidded?.map((product, index) => ({
      productid: product._id,
      quantity: 0,
    }))
  );

  // We would change the bidToDisplay's format based on the status
  let bidToDisplay: ApprovedBidder | Bidder | undefined;
  if (bidInfo.status === 'pending') bidToDisplay = bidInfo;
  else if (bidInfo.status === 'approved')
    bidToDisplay = approvedBids?.find(
      (approveBid, index) => approveBid.shgId === bidInfo.shgId
    );

  const handlePrint = useReactToPrint({
    content: () => bidRef.current,
  });
  let ApproveButtonContent;
  let verifyButtonContent;
  switch (bidInfo.deliveryverified) {
    case true:
      verifyButtonContent = {
        disabled: true,
        text: 'Order Delivered',
      };
      break;
    case false:
      verifyButtonContent = {
        disabled: false,
        text: 'Verify Delivery',
      };
      break;
  }
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

  const handleProductListChange = (
    e: ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    setSelectedProductsList(
      selectedProductsList?.map((product, index) => {
        if (index === currentIndex) {
          if (Number(e.target.value) > productsBidded[index].quantity)
            return product;
          else
            return {
              quantity: Number(e.target.value),
              productid: product.productid,
            };
        }
        return product;
      })
    );
  };

  const handleApproveBid = () => {
    // Fetch only those products with quantity more than zero
    const filteredProductsList = selectedProductsList?.filter(
      (product) => product.quantity !== 0
    );
    dispatch(
      approveBidByInstitute({
        token: user.token,
        orderId: orderId,
        shgId: bidInfo.shgId,
        products: filteredProductsList as ApproveBidProductListType[],
      })
    );
  };
  const handleVerifyDelivery = async (id: string) => {
    console.log(id);
    console.log(orderId);
    const res = await fetch(
      `https://selfhelpgroup-backend.herokuapp.com/institute/verifydelivery`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderid: orderId,
          approvedbidid: id,
        }),
      }
    );
    const data = await res.json();
    dispatch(
      handleOpenSnackbar({
        snackbarMessage: data.message,
        snackbarType: 'success',
      })
    );
    if (data.message === 'Order verified successfully') {
      dispatch(fetchAllOrdersOfInstitute(user.token));
    }
  };
  const calculateTotalPrice = (): number => {
    let totalPrice = 0;
    if (bidInfo.status === 'approved') {
      (bidToDisplay as ApprovedBidder)?.products?.forEach((product, index) => {
        totalPrice += product.unitprice * product.quantity;
      });
      return totalPrice;
    } else if (bidInfo.status === 'pending') {
      productsBidded.forEach((product, index) => {
        totalPrice += product.unitprice * selectedProductsList[index]?.quantity;
      });
      return totalPrice;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    setSelectedProductsList(
      productsBidded?.map((product, index) => ({
        productid: product._id,
        quantity: 0,
      }))
    );
    if (approvebidstatus.approveBidStatus === 'failed') {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Something went wrong',
          snackbarType: 'error',
        })
      );
    }
  }, [productsBidded, approvebidstatus, dispatch]);
  console.log(bidInfo);
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
          {bidInfo.delivered && bidInfo.deliveryverified
            ? 'delivered'
            : bidInfo.status}
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
              {bidInfo.status === 'pending' && (
                <StyledTableHeadCell>Max. quantity</StyledTableHeadCell>
              )}
              <StyledTableHeadCell>Selected Quantity</StyledTableHeadCell>

              <StyledTableHeadCell>Unit price</StyledTableHeadCell>
              <StyledTableHeadCell>Total price</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {bidInfo.status === 'pending' &&
              productsBidded?.map((product, index: number) => (
                <StyledTableRow
                  sx={{ fontSize: '0.875rem' }}
                  key={index}
                >
                  <StyledTableCell>{product?.shgproduct}</StyledTableCell>
                  <StyledTableCell>
                    {product?.quantity} {product?.unit}
                  </StyledTableCell>
                  <StyledTableCell>
                    <StyledTextField
                      type="number"
                      onChange={(e) => {
                        handleProductListChange(
                          e as ChangeEvent<HTMLInputElement>,
                          index
                        );
                      }}
                      value={selectedProductsList[index]?.quantity}
                      sx={{ width: 'unset' }}
                    />
                  </StyledTableCell>

                  <StyledTableCell>Rs. {product?.unitprice}</StyledTableCell>
                  <StyledTableCell>
                    Rs.{' '}
                    {(
                      product?.unitprice * selectedProductsList[index]?.quantity
                    ).toFixed(2)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {bidInfo.status === 'approved' &&
              (bidToDisplay as ApprovedBidder)?.products?.map(
                (product, index) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={index}
                  >
                    <StyledTableCell>{product?.shgproduct}</StyledTableCell>
                    <StyledTableCell>
                      {product?.quantity} {product.unit}
                    </StyledTableCell>
                    <StyledTableCell>Rs. {product?.unitprice}</StyledTableCell>
                    <StyledTableCell>
                      Rs. {product.totalprice.toFixed(2)}
                    </StyledTableCell>
                  </StyledTableRow>
                )
              )}
          </TableBody>
        </StyledTable>
        <ContainerRowBox sx={{ columnGap: '0.5rem' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: 'greyColor.main',
            }}
          >
            Total Price:
          </Typography>
          <Typography>{calculateTotalPrice()}</Typography>
        </ContainerRowBox>

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
              handleApproveBid();
            }}
          >
            {ApproveButtonContent.text}
          </StyledButton>
          {bidInfo.status === 'approved' && bidInfo.delivered === true ? (
            <div>
              Order Received
              <ContainerColumnBox sx={{ marginTop: '1rem' }}>
                <StyledButton
                  color="success"
                  variant="contained"
                  disabled={verifyButtonContent.disabled}
                  sx={{
                    padding: '1rem 0',
                    boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
                  }}
                  onClick={() => {
                    handleVerifyDelivery(bidInfo._id);
                  }}
                >
                  {verifyButtonContent.text}
                </StyledButton>
              </ContainerColumnBox>
            </div>
          ) : (
            ''
          )}
        </ContainerColumnBox>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default InstituteBiddingDetails;
