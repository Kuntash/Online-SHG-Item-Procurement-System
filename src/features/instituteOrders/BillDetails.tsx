import { PrintRounded } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { parseISO, format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledPaper,
  ContainerColumnBox,
  ContainerRowBox,
  StyledTable,
  StyledTableHead,
  StyledTableCell,
  StyledTableHeadCell,
  // TableRow,
  StyledTablePagination,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { IShgData } from './Bill';
const BillDetails = ({ shgData }: { shgData: IShgData }) => {
  console.log(shgData);
  const orderDetailRef = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => orderDetailRef.current,
  });
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(
    0,
    (1 + page) * rowsPerPage - shgData?.items?.length
  );
  const totalPrice = shgData?.items?.reduce(
    (totalPrice, item) => totalPrice + item.itemprice * item.itemquantity,
    0
  );

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <StyledPaper
      sx={{ fontSize: '1rem' }}
      ref={orderDetailRef}
    >
      <ContainerRowBox
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h2">SHG Details</Typography>
        <ContainerRowBox>
          <IconButton
            color="success"
            onClick={handlePrint}
          >
            <PrintRounded color="success" />
          </IconButton>
        </ContainerRowBox>
      </ContainerRowBox>
      <ContainerRowBox>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Institute :
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.institutename}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Department :
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.department}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Name :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgname}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Contact :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgcontact}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Location :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shglocation.toUpperCase()}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Account Name :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgaccountname}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Account Number :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgaccountnumber}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  IFSC :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgifsc.toUpperCase()}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Bank Name :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgbankname}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                >
                  Branch Name :{' '}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {shgData.shgbranchname}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ContainerRowBox>
      <Typography variant="body1">Total Price :{totalPrice}</Typography>
      <ContainerRowBox
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h2">Order summary</Typography>
        <ContainerRowBox></ContainerRowBox>
      </ContainerRowBox>
      <ContainerColumnBox>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: 'greyColor.main',
          }}
        >
          Item list
        </Typography>
        <Table>
          <StyledTableHead sx={{ fontSize: '0.875rem' }}>
            <TableRow>
              <StyledTableHeadCell>Item name</StyledTableHeadCell>
              <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
              <StyledTableHeadCell>Item Price</StyledTableHeadCell>
              <StyledTableHeadCell>Delivered Date</StyledTableHeadCell>
              {/* <TableHeadCell>Paymentinitiated</TableHeadCell>
              <TableHeadCell>Paymentinititedate</TableHeadCell>
              <TableHeadCell>Paymentreceived</TableHeadCell> */}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {shgData &&
              shgData.items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={index}
                  >
                    <TableCell>{item.itemname}</TableCell>
                    <TableCell>{item.itemquantity}</TableCell>
                    <TableCell>&#x20b9;{item.itemprice}</TableCell>
                    <TableCell>
                      {format(parseISO(item.deliverydate), 'do MMM yyyy')}
                    </TableCell>
                    {/* <TableHeadCell>{item.paymentinitiated}</TableHeadCell>
              <TableHeadCell>{format(parseISO(item.paymentinititedate), 'do MMM yyyy')}</TableHeadCell>
              <TableHeadCell>{item.paymentreceived}</TableHeadCell> */}
                  </TableRow>
                ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
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
                count={shgData.items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </Table>
      </ContainerColumnBox>
      <ContainerRowBox>
        <ContainerColumnBox
          alignItems="flex-end"
          sx={{ width: '100%' }}
        >
          <Typography variant="body1">Signature</Typography>
          <Typography variant="body1">{shgData.institutename}</Typography>
        </ContainerColumnBox>
      </ContainerRowBox>
    </StyledPaper>
  );
};

export default BillDetails;
