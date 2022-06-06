import { TableBody, TableRow, Typography } from '@mui/material';
import React from 'react';
import { AdminOrderProduct } from '../../types/custom';
import {
  StyledPaper,
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
            <StyledTableHeadCell>Product description</StyledTableHeadCell>
            <StyledTableHeadCell>Approved / Total quantity</StyledTableHeadCell>
            {/* <StyledTableHeadCell> </StyledTableHeadCell> */}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {products.map((product, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{product.itemname}</StyledTableCell>
              <StyledTableCell>{product.itemdescription}</StyledTableCell>
              <StyledTableCell>
                {product.approvedquantity} / {product.itemquantity}{' '}
                {product.itemunit}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledPaper>
  );
};

export default AdminProductDetailsTable;
