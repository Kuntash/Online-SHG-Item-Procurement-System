import { RemoveRounded } from '@mui/icons-material';
import { Alert, TableBody, TableRow, Typography } from '@mui/material';
import React from 'react';
import {
  ContainerColumnBox,
  StyledButton,
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from '../../components/custom';
import { PlaceOrderItem } from './itemsSlice';
const PlaceOrderDetails = ({
  addedItemsList,
  setAddedItemsList,
}: {
  addedItemsList: PlaceOrderItem[];
  setAddedItemsList: React.Dispatch<React.SetStateAction<PlaceOrderItem[]>>;
}) => {
  const handleRemoveAddedItem = (itemId: string | undefined) => {
    setAddedItemsList((prev) => {
      return prev.filter((addedItem, index) => addedItem._id !== itemId);
    });
  };

  const handlePlaceOrder = () => {
    // TODO: Uncomment the next lines once the api starts to work
    // dispatch(placeOrder({ addedItemsList, userToken }));
  };
  return (
    <StyledPaper>
      <Typography
        variant="h2"
        sx={{ marginBottom: '1rem' }}
      >
        Order Cart
      </Typography>
      {addedItemsList.length === 0 && (
        <Alert
          severity="info"
          sx={{ marginBottom: '1rem', borderRadius: '8px' }}
        >
          Try adding some items
        </Alert>
      )}
      <StyledTable>
        <StyledTableHead sx={{ fontSize: '1rem' }}>
          <TableRow>
            <StyledTableHeadCell>Item name</StyledTableHeadCell>
            <StyledTableHeadCell>Item type</StyledTableHeadCell>
            <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
            <StyledTableHeadCell></StyledTableHeadCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {addedItemsList.map((addedItem, index) => (
            <StyledTableRow
              key={index}
              sx={{ fontSize: '0.875rem' }}
            >
              <StyledTableCell>{addedItem.itemname}</StyledTableCell>
              <StyledTableCell>{addedItem.itemquantity}</StyledTableCell>
              <StyledTableCell>
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<RemoveRounded sx={{ color: 'white' }} />}
                  sx={{ padding: '0.5rem 0.9rem' }}
                  onClick={() => {
                    handleRemoveAddedItem(addedItem._id);
                  }}
                >
                  Remove Item
                </StyledButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
      <ContainerColumnBox sx={{ marginTop: '1rem' }}>
        <StyledButton
          color="success"
          variant="contained"
          sx={{
            padding: '1rem 0',
            boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
          }}
          onClick={handlePlaceOrder}
        >
          Place order
        </StyledButton>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default PlaceOrderDetails;
