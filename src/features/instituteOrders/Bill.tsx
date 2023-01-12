import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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
import { selectUser } from '../auth/authSlice';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { InstituteOrder } from '../../types/custom';
import Loading2 from '../../components/utility/Loading2';
import { useParams } from 'react-router';
import { backendUrl } from '../../config';
import BillDetails from './BillDetails';
export interface FormattedOrdersType extends InstituteOrder {
  backgroundColor?: string;
  color?: string;
  orderDate?: string;
}

export interface IShgData {
  shgid: string;
  shgname: string;
  shgcontact: string;
  shglocation: string;
  shgaccountnumber: string;
  shgifsc: string;
  items: {
    delivered: boolean;
    deliverydate: string;
    itemid: string;
    itemname: string;
    itemprice: number;
    itemquantity: number;
    paymentinitiated: boolean;
    paymentinititedate: string;
    paymentreceived: boolean;
  }[];
}


const Bill = () => {
  const { orderId } = useParams();
  const [shgData, setShgData] = useState<IShgData[]>([]);
  const user = useAppSelector(selectUser);
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - shgData.length)
      : 0;

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };


  useEffect(() => {
    const getOrders = async () => {
      try {
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${user.token}`);
        headers.append('Content-type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        const requestOptions: RequestInit = {
          method: 'GET',
          headers,
          redirect: 'follow',
        };
        const response = await fetch(
          `${backendUrl}institute/generatebill/${orderId}`,
          requestOptions
        );
        if (response.status === 400)
          throw new Error('Error occurred while getting saved order');
        const result = await response.json();
        setShgData(result.shgdata)
        console.log(result)
      } catch (err) {
        console.log(err)
      }
    }
    if (user.status === 'succeeded') getOrders();
  }, [user, orderId])


  const [selectedRow, setSelectedRow] = useState<{
    index: number;
    id: string;
  }>({
    index: 0,
    id: shgData[0]?.shgid,
  });
  useEffect(() => {
    setSelectedRow({ index: 0, id: shgData[0]?.shgid });
  }, [shgData]);


  if (shgData.length === 0) return <Loading2 />;
  return (
    <>
      <StyledContainer sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            xs={12}
            md={7}
          >
            <StyledPaper sx={{ padding: '1rem' }}>
              <Typography
                variant="h2"
                sx={{ marginBottom: '1rem' }}
              >
                SHGs
              </Typography>
              <StyledTable>
                <StyledTableHead sx={{ fontSize: '1rem' }}>
                  <TableRow>
                    <StyledTableHeadCell>Shg name</StyledTableHeadCell>
                    <StyledTableHeadCell>contact</StyledTableHeadCell>
                    <StyledTableHeadCell>location</StyledTableHeadCell>
                    <StyledTableHeadCell>Account Number</StyledTableHeadCell>
                    <StyledTableHeadCell>IFSC</StyledTableHeadCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {shgData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((shg, index: number) => (
                      <StyledTableRow
                        sx={{ fontSize: '0.875rem' }}
                        key={shg.shgid}
                        selected={selectedRow.index === index}
                        onClick={() => {
                          setSelectedRow({ index, id: shg.shgid });
                        }}
                      >
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {shg.shgname}
                        </StyledTableCell>
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {shg.shgcontact}
                        </StyledTableCell>
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {shg.shglocation}
                        </StyledTableCell>
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {shg.shgaccountnumber}
                        </StyledTableCell>
                        <StyledTableCell sx={{ marginTop: '1rem' }}>
                          {shg.shgifsc}
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
                      count={shgData.length}
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
          <Grid
            item
            xs={12}
            md={5}
          >
            <BillDetails shgData={shgData[selectedRow.index]} />
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

export default Bill;
