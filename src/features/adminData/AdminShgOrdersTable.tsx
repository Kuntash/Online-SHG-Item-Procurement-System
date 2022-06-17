import { Alert, TableBody, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
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
import { AdminSHGOrder } from '../../types/custom';

interface Props {
  orders: AdminSHGOrder[];
}
const AdminShgOrdersTable = (props: Props) => {
  const { orders } = props;
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const rowsPerPage = 3;
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - orders.length);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRedirect = (orderId: string) => {
    navigate(`/dashboard/admin/view-all-orders/${orderId}`);
  };
  return (
    <StyledPaper>
      <Typography
        variant="h2"
        sx={{ marginBottom: '1rem' }}
      >
        Approved Orders
      </Typography>
      {orders.length === 0 ? (
        <Alert severity="info">No approved orders</Alert>
      ) : (
        <StyledTable>
          <StyledTableHead sx={{ fontSize: '1rem' }}>
            <TableRow>
              <StyledTableHeadCell>Institute name</StyledTableHeadCell>
              <StyledTableHeadCell>Institute location</StyledTableHeadCell>
              <StyledTableHeadCell>Department</StyledTableHeadCell>
              <StyledTableHeadCell>Delivered</StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? orders.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : orders
            )?.map((approvedOrder, index) => (
              <StyledTableRow
                onClick={() => {
                  handleRedirect(approvedOrder.orderid);
                }}
                sx={{ fontSize: '0.875rem' }}
                key={index}
              >
                <StyledTableCell>
                  {approvedOrder.institutename.length > 20
                    ? `${approvedOrder.institutename.substring(0, 20)}...`
                    : approvedOrder.institutename}
                </StyledTableCell>
                <StyledTableCell>
                  {approvedOrder.institutelocation}
                </StyledTableCell>
                <StyledTableCell>{approvedOrder.department}</StyledTableCell>

                <StyledTableCell>
                  {approvedOrder.delivered ? (
                    <StyledStatus
                      sx={{
                        color: 'success.main',
                        backgroundColor: 'success.light',
                      }}
                    >
                      Yes
                    </StyledStatus>
                  ) : (
                    <StyledStatus
                      sx={{
                        color: 'error.main',
                        backgroundColor: 'error.light',
                      }}
                    >
                      No
                    </StyledStatus>
                  )}
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
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </StyledTable>
      )}
    </StyledPaper>
  );
};

export default AdminShgOrdersTable;
