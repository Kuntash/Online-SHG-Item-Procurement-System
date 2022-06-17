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
                  <StyledTableCell>{currentShg.location}</StyledTableCell>
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
      </Grid>
    </StyledContainer>
  );
};

export default AdminShgDetails;
