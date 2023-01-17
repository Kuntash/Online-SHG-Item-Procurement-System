import { TableBody, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { AdminOrderProduct } from '../../types/custom';
import {
  StyledPaper,
  StyledStatus,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../custom';

interface AdminProductDetailsTableProps {
  products: AdminOrderProduct[];
}
const AdminProductDetailsTable = ({
  products,
}: AdminProductDetailsTableProps) => {
  const getStatus = (product: AdminOrderProduct) => {
    if (product.paymentreceived === true) {
      return (
        <StyledStatus>
          <Typography color="success">Payment received</Typography>
        </StyledStatus>
      );
    }

    if (product.paymentinitiated === true) {
      return (
        <StyledStatus>
          <Typography color="success">Payment initiated</Typography>
        </StyledStatus>
      );
    }
    return <></>;
  };

  const getDate = (product: AdminOrderProduct) => {
    if (product.paymentreceived === true) {
      return format(new Date(product.paymentreceiveddate), 'ppPP');
    }
    if (product.paymentinitiated === true) {
      return format(new Date(product.paymentinititedate), 'ppPP');
    }
    return <></>;
  };

  return (
    <StyledPaper>
      <Typography
        variant="h2"
        sx={{ marginBottom: '1rem' }}
      >
        Products ordered
      </Typography>
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <StyledTableHeadCell>Product no.</StyledTableHeadCell>
            <StyledTableHeadCell>Product name</StyledTableHeadCell>
            <StyledTableHeadCell>SHG name</StyledTableHeadCell>
            {/* <StyledTableHeadCell>Product description</StyledTableHeadCell> */}
            <StyledTableHeadCell>Quantity</StyledTableHeadCell>
            <StyledTableHeadCell>Price</StyledTableHeadCell>
            <StyledTableHeadCell>Status</StyledTableHeadCell>
            <StyledTableHeadCell>Date</StyledTableHeadCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {products
            .filter((product) => product.accepted === true)
            .map((product, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{product.itemname}</StyledTableCell>
                <StyledTableCell>{product.shgid.name}</StyledTableCell>
                {/* <StyledTableCell>{product.itemdescription}</StyledTableCell> */}
                <StyledTableCell>
                  {product.itemquantity} {product.itemunit}
                </StyledTableCell>
                <StyledTableCell>&#x20b9;{product.itemprice}</StyledTableCell>
                <StyledTableCell sx={{ marginTop: '1rem' }}>
                  {getStatus(product)}
                </StyledTableCell>
                <StyledTableCell>{getDate(product)}</StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </StyledTable>
    </StyledPaper>
  );
};

export default AdminProductDetailsTable;
