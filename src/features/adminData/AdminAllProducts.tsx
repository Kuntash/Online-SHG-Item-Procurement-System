import {
  Grid,
  TableBody,
  TableRow,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import TableViewIcon from '@mui/icons-material/TableView';
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
import { AdminProductDataType } from '../../types/custom';
import {
  fetchAllProductData,
  fetchAllAdminOrders,
  selectAllProducts,
} from './adminDataSlice';
import { StyledTextField } from '../../components/custom';
import SearchIcon from '@mui/icons-material/Search';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
const AdminAllProducts = () => {
  const [search, setsearch] = useState<any>();
  const [filteredProducts, setFilteredProducts] = useState<
    AdminProductDataType[]
  >([]);
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const productDataStatus = useAppSelector(
    (state: RootState) => state.admin.product.productDataStatus
  );
  const orderDataStatus = useAppSelector(
    (state: RootState) => state.admin.orderData.orderDataStatus
  );
  const productData = useAppSelector(
    selectAllProducts
  ) as unknown as AdminProductDataType[];
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(
    0,
    (1 + page) * rowsPerPage - filteredProducts?.length
  );

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  useEffect(() => {
    if (productDataStatus === 'idle' && userToken)
      dispatch(fetchAllProductData(userToken));
    if (orderDataStatus === 'idle') dispatch(fetchAllAdminOrders(userToken));
    setFilteredProducts(productData);
  }, [dispatch, userToken, productDataStatus, orderDataStatus, productData]);
  const filterdepartment = (e: any) => {
    e.preventDefault();
    if (search === '' || search === undefined) {
      setFilteredProducts(productData);
      return;
    }
    const filtereddepartments = productData.filter(
      (product) =>
        product.itemname.toLowerCase().includes(search.toLowerCase()) ||
        product.itemunit.toLowerCase().includes(search.toLowerCase()) ||
        product._id.toString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtereddepartments);
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
              sx={{ marginBottom: '1rem', alignItems: 'center' }}
            >
              <Grid item>
                <Typography
                  variant="h2"
                  sx={{ marginTop: '0.5rem' }}
                >
                  Products List
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
              <Grid item>
                <CSVLink
                  data={productData}
                  filename={
                    'productreport - ' + format(new Date(), 'do MMM yyyy')
                  }
                  headers={[
                    { label: 'Product id', key: '_id' },
                    { label: 'Product name', key: 'itemname' },
                    { label: 'unit', key: 'itemunit' },
                  ]}
                >
                  <TableViewIcon color="primary" />
                </CSVLink>
              </Grid>
            </Grid>
            <StyledContainer sx={{ alignItems: 'flex-end', width: '100%' }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 'bold' }}
              >
                Total Products: {productData.length}
              </Typography>
            </StyledContainer>
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  {/* <StyledTableHeadCell>Order Id</StyledTableHeadCell> */}
                  <StyledTableHeadCell>Product id</StyledTableHeadCell>
                  <StyledTableHeadCell>Product name</StyledTableHeadCell>
                  <StyledTableHeadCell>Unit</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredProducts.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredProducts
                ).map((product, index: number) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={product._id}
                  >
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      <b>{product._id}</b>
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {product.itemname}
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {product.itemunit}
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
                    count={filteredProducts.length}
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

export default AdminAllProducts;
