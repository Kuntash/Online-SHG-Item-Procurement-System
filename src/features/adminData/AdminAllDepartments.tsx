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
import { AdminDepartmentDataType } from '../../types/custom';
import {
  fetchAllDepartmentData,
  fetchAllAdminOrders,
  selectAllDepartments,
} from './adminDataSlice';
import { StyledTextField } from '../../components/custom';
import SearchIcon from '@mui/icons-material/Search';
const AdminAllDepartments = () => {
  const [search, setsearch] = useState<any>();
  const [filteredDepartments, setFilteredDepartments] = useState<
    AdminDepartmentDataType[]
  >([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const departmentDataStatus = useAppSelector(
    (state: RootState) => state.admin.department.departmentDataStatus
  );
  const orderDataStatus = useAppSelector(
    (state: RootState) => state.admin.orderData.orderDataStatus
  );
  const departmentData = useAppSelector(
    selectAllDepartments
  ) as unknown as AdminDepartmentDataType[];
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(
    0,
    (1 + page) * rowsPerPage - filteredDepartments?.length
  );

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  useEffect(() => {
    if (departmentDataStatus === 'idle' && userToken)
      dispatch(fetchAllDepartmentData(userToken));
    if (orderDataStatus === 'idle') dispatch(fetchAllAdminOrders(userToken));
    setFilteredDepartments(departmentData);
  }, [
    dispatch,
    userToken,
    departmentDataStatus,
    orderDataStatus,
    departmentData,
  ]);
  const filterdepartment = (e: any) => {
    e.preventDefault();
    if (search === '' || search === undefined) {
      setFilteredDepartments(departmentData);
      return;
    }
    const filtereddepartments = departmentData.filter(
      (department) =>
        department.department.toLowerCase().includes(search.toLowerCase()) ||
        department.contact.toLowerCase().includes(search.toLowerCase()) ||
        department._id.toString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDepartments(filtereddepartments);
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
                  Departments List
                </Typography>
              </Grid>
              <Grid item>
                <form onSubmit={(e) => filterdepartment(e)}>
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
                            onClick={(e) => filterdepartment(e)}
                            onMouseDown={(e) => filterdepartment(e)}
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
            <StyledContainer sx={{ alignItems: 'flex-end', width: '100%' }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold' }}
              >
                Total Departments: {departmentData.length}
              </Typography>
            </StyledContainer>
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  {/* <StyledTableHeadCell>Order Id</StyledTableHeadCell> */}
                  <StyledTableHeadCell>Department id</StyledTableHeadCell>
                  <StyledTableHeadCell>Department name</StyledTableHeadCell>
                  <StyledTableHeadCell>Department contact</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredDepartments.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredDepartments
                ).map((department, index: number) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={department._id}
                  >
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      <b>{department._id}</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {department.department}
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {department.contact}
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
                    count={filteredDepartments.length}
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

export default AdminAllDepartments;
