import { RemoveRounded } from '@mui/icons-material';
import { Alert, TableBody, TableRow, Typography } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
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
import { selectUser } from '../auth/authSlice';
import { placeOrder, PlaceOrderItem } from './itemsSlice';
const PlaceOrderDetails = ({
  addedItemsList,
  setAddedItemsList,
  setOrdersItemForm,
}: {
  setOrdersItemForm: React.Dispatch<
    React.SetStateAction<{ [key: string]: number | string }>
  >;
  addedItemsList: PlaceOrderItem[];
  setAddedItemsList: React.Dispatch<React.SetStateAction<PlaceOrderItem[]>>;
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const handleRemoveAddedItem = (itemId: string | undefined) => {
    setAddedItemsList((prev) => {
      return prev.filter((addedItem, index) => addedItem._id !== itemId);
    });
  };

  const handlePlaceOrder = async () => {
    console.log('placeOrder() about to be executed');
    // TODO: Uncomment the next lines once the api starts to work
    await dispatch(placeOrder({ addedItemsList, token: user.token }));

    // NOTE: Resetting all the form inputs and items added after placeOrder is completed
    console.log('placeOrder() got executed');
    setOrdersItemForm({});
    setAddedItemsList([]);
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
