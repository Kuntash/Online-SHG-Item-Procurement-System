import { ChevronRightRounded } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Grid,
  TableBody,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  ContainerRowBox,
  StyledButton,
  StyledContainer,
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
  StyledTextField,
} from '../../components/custom';
import { AdminOrderBid } from '../../types/custom';
import { changeBidPriceOfAnOrder, fetchAllAdminOrders } from './adminDataSlice';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
interface StateType {
  orderId: string;
  bid: AdminOrderBid;
  bidType: 'approved' | 'pending' | 'cancelled';
}

const AdminSingleBid = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const bidchangestate = useAppSelector(
    (state: RootState) => state.admin.bidChangeStatus
  );
  const state = location.state as StateType;
  const { orderId, bid, bidType } = state;
  const theme = useTheme();
  const [productPriceList, setProductPriceList] = useState<
    { productid: string; unitprice: number }[]
  >([]);

  const handleProductPriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (isNaN(Number(e.target.value))) return;
    setProductPriceList(
      productPriceList.map((productPrice, index) => {
        if (index === currentIndex)
          return {
            productid: productPrice.productid,
            unitprice: Number(e.target.value),
          };
        return productPrice;
      })
    );
  };

  useEffect(() => {
    setProductPriceList(
      bid.products.map((product, index) => ({
        productid: product._id,
        unitprice: product.unitprice,
      }))
    );
  }, [bid]);
  useEffect(() => {
    if (bidchangestate === 'succeeded') {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Bid Modified successfully',
          snackbarType: 'success',
        })
      );
    }
  }, [bidchangestate]);
  return (
    <StyledContainer sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{ rowGap: '1rem' }}
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Breadcrumbs
              color="primary"
              separator={<ChevronRightRounded />}
            >
              <Typography color="primary">
                <Link
                  to="/dashboard/admin/view-all-orders"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.blackColor.main,
                  }}
                >
                  All orders
                </Link>
              </Typography>
              <Typography color={theme.palette.blackColor.main}>
                <Link
                  to={`../../view-all-orders/${state.orderId}`}
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.blackColor.main,
                  }}
                >
                  <b>Order id: {orderId}</b>
                </Link>
              </Typography>
              <Typography color={theme.palette.blackColor.main}>
                <b>Bid id: {bid?._id}</b>
              </Typography>
            </Breadcrumbs>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <StyledPaper sx={{ marginBottom: '1rem' }}>
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              Bid details
            </Typography>
            <StyledTable>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeadCell>SHG name</StyledTableHeadCell>
                  <StyledTableHeadCell>SHG location</StyledTableHeadCell>
                  <StyledTableHeadCell>SHG contact no.</StyledTableHeadCell>
                  <StyledTableHeadCell>Total products</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell>{bid.shgname}</StyledTableCell>
                  <StyledTableCell>{bid.shglocation}</StyledTableCell>
                  <StyledTableCell>{bid.shgcontact}</StyledTableCell>
                  <StyledTableCell>{bid.products.length}</StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </StyledTable>
          </StyledPaper>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <StyledPaper sx={{ marginBottom: '1rem' }}>
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              Products list
            </Typography>
            <StyledTable sx={{ marginBottom: '1rem' }}>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeadCell>Product no.</StyledTableHeadCell>
                  <StyledTableHeadCell>Product name</StyledTableHeadCell>
                  <StyledTableHeadCell>Product quantity</StyledTableHeadCell>
                  <StyledTableHeadCell>Unit price</StyledTableHeadCell>
                  <StyledTableHeadCell>Total price</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {productPriceList.length !== 0 &&
                  bid.products.map((product, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{product.shgproduct}</StyledTableCell>
                      <StyledTableCell>
                        {product.quantity} {product.unit}
                      </StyledTableCell>

                      <StyledTableCell>
                        {bidType === 'approved' && product.unitprice}
                        {bidType === 'pending' && (
                          <StyledTextField
                            type="number"
                            label="Rs."
                            value={productPriceList[index].unitprice}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleProductPriceChange(e, index)
                            }
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {bidType === 'approved' && product.totalprice}
                        {bidType === 'pending' &&
                          (
                            product.quantity * productPriceList[index].unitprice
                          ).toFixed(2)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </StyledTable>
            <ContainerRowBox sx={{ justifyContent: 'flex-end' }}>
              {bidType === 'pending' && (
                <StyledButton
                  color="info"
                  variant="contained"
                  sx={{
                    padding: '1rem',
                    boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
                  }}
                  onClick={async () => {
                    await dispatch(
                      changeBidPriceOfAnOrder({
                        token: userToken as string,
                        bidId: bid._id,
                        products: productPriceList,
                      })
                    );
                    await dispatch(fetchAllAdminOrders(userToken));
                  }}
                >
                  Update product price
                </StyledButton>
              )}
            </ContainerRowBox>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminSingleBid;
