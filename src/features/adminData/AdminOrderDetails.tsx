import React from 'react';
import { ChevronRightRounded } from '@mui/icons-material';
import { Box, Breadcrumbs, Grid, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { StyledContainer } from '../../components/custom';
import { selectAdminOrderById } from './adminDataSlice';
import AdminOrderDetailsTable from '../../components/admin/AdminOrderDetailsTable';
import AdminProductDetailsTable from '../../components/admin/AdminProductDetailsTable';
import AdminBiddingDetailsTable from '../../components/admin/AdminAllBiddingsTable';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const theme = useTheme();
  const order = useAppSelector((state: RootState) =>
    selectAdminOrderById(state, orderId as string)
  );
  console.log(order);
  if (order === undefined) return <h1>Order not found</h1>;
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
                <b>Order id: #{orderId}</b>
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
          <AdminOrderDetailsTable
            department={order.department}
            instituteLocation={order.institutelocation}
            orderId={order._id}
            orderStatus={order.status}
            orderedAt={format(new Date(order.createdAt), 'PPpp')}
            orderedBy={order.institutename}
          />
        </Grid>
        <Grid
          xs={12}
          md={12}
          lg={12}
        >
          <AdminProductDetailsTable products={order.items} />
        </Grid>
        <Grid
          xs={12}
          md={12}
          lg={12}
        >
          <AdminBiddingDetailsTable
            tableTitle="Approved bids"
            bidType="approved"
            bids={order.approvedbid}
            orderId={order._id}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <AdminBiddingDetailsTable
            bidType="pending"
            tableTitle="Unapproved bids"
            bids={order.bid.filter((bid) => bid.status === 'pending')}
            orderId={order._id}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminOrderDetails;
