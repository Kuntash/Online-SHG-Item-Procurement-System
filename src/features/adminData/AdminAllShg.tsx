import {
  Grid,
  TableBody,
  TableRow,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledContainer,
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTablePagination,
  StyledTableRow,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { AdminSHGDataType } from '../../types/custom';
import {
  fetchAllShgData,
  selectAllShgs,
  fetchAllAdminOrders,
} from './adminDataSlice';
import { StyledTextField } from '../../components/custom';
import SearchIcon from '@mui/icons-material/Search';
const AdminAllShg = () => {
  const [search, setsearch] = useState<any>();
  const [filteredShgs, setFilteredShgs] = useState<AdminSHGDataType[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const shgDataStatus = useAppSelector(
    (state: RootState) => state.admin.shgData.shgDataStatus
  );
  const orderDataStatus = useAppSelector(
    (state: RootState) => state.admin.orderData.orderDataStatus
  );
  const shgData = useAppSelector(
    selectAllShgs
  ) as unknown as AdminSHGDataType[];
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(
    0,
    (1 + page) * rowsPerPage - filteredShgs?.length
  );

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRedirect = (shgId: string) => {
    navigate(`${shgId}`, {});
  };
  useEffect(() => {
    if (shgDataStatus === 'idle' && userToken)
      dispatch(fetchAllShgData(userToken));
    if (orderDataStatus === 'idle') dispatch(fetchAllAdminOrders(userToken));
    setFilteredShgs(shgData);
  }, [dispatch, userToken, shgDataStatus, orderDataStatus, shgData]);
  const filtershg = (e: any) => {
    e.preventDefault();
    if (search === '' || search === undefined) {
      setFilteredShgs(shgData);
      return;
    }
    const filteredShgs = shgData.filter(
      (shg) =>
        shg.name.toLowerCase().includes(search.toLowerCase()) ||
        shg.contact.toLowerCase().includes(search.toLowerCase()) ||
        shg.location.toLowerCase().includes(search.toLowerCase()) ||
        shg._id.toString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredShgs(filteredShgs);
  };

  return (
    <StyledContainer sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
        >
          <StyledPaper>
            <Grid
              container
              spacing={2}
              sx={{ marginBottom: '1rem' }}
            >
              <Grid item>
                <Typography
                  variant="h2"
                  sx={{ marginTop: '0.5rem' }}
                >
                  Self Help Groups List
                </Typography>
              </Grid>
              <Grid item>
                <form onSubmit={(e) => filtershg(e)}>
                  <StyledTextField
                    // helperText={helperTexts.password}
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                    label="Search"
                    sx={{ borderRadius: '0.8rem', width: '100%' }}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={(e) => filtershg(e)}
                            onMouseDown={(e) => filtershg(e)}
                            edge="end"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              </Grid>
            </Grid>
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  {/* <StyledTableHeadCell>Order Id</StyledTableHeadCell> */}
                  <StyledTableHeadCell>Shg id</StyledTableHeadCell>
                  <StyledTableHeadCell>Shg name</StyledTableHeadCell>
                  <StyledTableHeadCell>Shg contact</StyledTableHeadCell>
                  <StyledTableHeadCell>Shg location</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredShgs.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredShgs
                ).map((shg, index: number) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={shg._id}
                    onClick={() => {
                      handleRedirect(shg._id);
                    }}
                  >
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      <b>{shg._id}</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {shg.name}
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {shg.contact}
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {shg.location.toUpperCase()}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={5} />
                  </StyledTableRow>
                )}
                <TableRow>
                  <StyledTablePagination
                    rowsPerPageOptions={[5]}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    count={filteredShgs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableBody>
            </StyledTable>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminAllShg;
