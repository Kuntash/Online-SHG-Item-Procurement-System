import { ChevronRightRounded } from '@mui/icons-material';
import {
  Alert,
  Box,
  Breadcrumbs,
  Grid,
  TableBody,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledContainer,
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTablePagination,
  StyledTableRow,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { selectShgById } from './adminDataSlice';
import AdminShgOrdersTable from './AdminShgOrdersTable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'SHG Sales',
    },
  },
};

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const AdminShgDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { shgId } = useParams();
  const currentShg = useAppSelector((state: RootState) =>
    selectShgById(state, shgId as string)
  );

  if (currentShg === undefined)
    return (
      <StyledContainer sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
          >
            <Alert color="warning">No SHG exists with this id</Alert>
          </Grid>
        </Grid>
      </StyledContainer>
    );
  const data = {
    labels,
    datasets: [
      {
        label: 'SHG',
        data: [
          currentShg.january,
          currentShg.february,
          currentShg.march,
          currentShg.april,
          currentShg.may,
          currentShg.june,
          currentShg.july,
          currentShg.august,
          currentShg.september,
          currentShg.october,
          currentShg.november,
          currentShg.december,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const handleredirect = () => {
    navigate(`/dashboard/admin/editshg/${currentShg._id}`);
  };
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
                  to="/dashboard/admin/view-all-shgs"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.blackColor.main,
                  }}
                >
                  All Shgs
                </Link>
              </Typography>
              <Typography color={theme.palette.blackColor.main}>
                <b>Shg id: #{currentShg._id}</b>
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
          <StyledPaper>
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              SHG details
              <EditIcon onClick={() => handleredirect()} />
            </Typography>
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  <StyledTableHeadCell>SHG id</StyledTableHeadCell>
                  <StyledTableHeadCell>SHG name</StyledTableHeadCell>
                  <StyledTableHeadCell>SHG contact</StyledTableHeadCell>
                  <StyledTableHeadCell>SHG location</StyledTableHeadCell>
                  <StyledTableHeadCell>
                    Total orders received
                  </StyledTableHeadCell>
                  <StyledTableHeadCell>Total revenue</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell>
                    <b>{currentShg._id}</b>
                  </StyledTableCell>
                  <StyledTableCell>{currentShg.name}</StyledTableCell>
                  <StyledTableCell>{currentShg.contact}</StyledTableCell>
                  <StyledTableCell>
                    {currentShg.location.toUpperCase()}
                  </StyledTableCell>
                  <StyledTableCell>
                    <StyledStatus
                      sx={{
                        color: theme.palette.success.main,
                        backgroundColor: theme.palette.success.light,
                      }}
                    >
                      {currentShg.orders.length}
                    </StyledStatus>
                  </StyledTableCell>
                  <StyledTableCell>
                    <StyledStatus
                      sx={{
                        color: theme.palette.success.main,
                        backgroundColor: theme.palette.success.light,
                      }}
                    >
                      Rs. {currentShg.totalrevenue}
                    </StyledStatus>
                  </StyledTableCell>
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
          <AdminShgOrdersTable orders={currentShg.orders} />
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <Bar
            options={options}
            data={data}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminShgDetails;
