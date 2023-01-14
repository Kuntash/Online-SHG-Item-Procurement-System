import { PrintRounded } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
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
  StyledTableRow,
  StyledTablePagination,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import { IShgData } from './Bill';
const BillDetails = ({ shgData }: { shgData: IShgData }) => {
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

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <StyledPaper ref={orderDetailRef}>
      <ContainerRowBox
        sx={{
          columnGap: '5px',
          justifyContent: 'space-between',
          marginBottom: '1rem',
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
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Name :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgname}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Contact :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgcontact}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Location :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shglocation.toUpperCase()}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Account Name :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgaccountname}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Account Number :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgaccountnumber}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  IFSC :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgifsc.toUpperCase()}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Bank Name :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgbankname}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                >
                  Branch Name :{' '}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{shgData.shgbranchname}</Typography>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </ContainerRowBox>
      <ContainerRowBox
        sx={{
          columnGap: '5px',
          justifyContent: 'space-between',
          marginBottom: '1rem',
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
            marginBottom: '1rem',
          }}
        >
          Item list
        </Typography>
        <StyledTable>
          <StyledTableHead sx={{ fontSize: '0.875rem' }}>
            <TableRow>
              <StyledTableHeadCell>Item name</StyledTableHeadCell>
              <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
              <StyledTableHeadCell>Item Price</StyledTableHeadCell>
              <StyledTableHeadCell>Delivered Date</StyledTableHeadCell>
              {/* <StyledTableHeadCell>Paymentinitiated</StyledTableHeadCell>
              <StyledTableHeadCell>Paymentinititedate</StyledTableHeadCell>
              <StyledTableHeadCell>Paymentreceived</StyledTableHeadCell> */}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {shgData &&
              shgData.items
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={index}
                  >
                    <StyledTableCell>{item.itemname}</StyledTableCell>
                    <StyledTableCell>{item.itemquantity}</StyledTableCell>
                    <StyledTableCell>&#x20b9;{item.itemprice}</StyledTableCell>
                    <StyledTableCell>
                      {format(parseISO(item.deliverydate), 'do MMM yyyy')}
                    </StyledTableCell>
                    {/* <StyledTableHeadCell>{item.paymentinitiated}</StyledTableHeadCell>
              <StyledTableHeadCell>{format(parseISO(item.paymentinititedate), 'do MMM yyyy')}</StyledTableHeadCell>
              <StyledTableHeadCell>{item.paymentreceived}</StyledTableHeadCell> */}
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
                count={shgData.items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </StyledTable>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default BillDetails;
