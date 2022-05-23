import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledButton,
  StyledContainer,
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTablePagination,
  StyledTableRow,
  StyledTextField,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import {
  InstituteOrderItem,
  Item,
  PlaceOrderItem,
  RouterStateType,
} from '../../types/custom';
import {
  getSavedOrder,
  selectSavedOrder,
} from '../instituteOrders/instituteOrdersSlice';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
import { fetchAllItems, selectAllItems } from './itemsSlice';
import PlaceOrderDetails from './PlaceOrderDetails';

const PlaceOrder = () => {
  const dispatch = useAppDispatch();
  const { state } = useLocation() as RouterStateType;
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const savedOrders = useAppSelector(selectSavedOrder);
  const items = useAppSelector(selectAllItems);
  const itemsStatus = useAppSelector((state: RootState) => state.items.status);
  const hasSavedOrder = useAppSelector(
    (state: RootState) => state.instituteOrders.hasSavedOrder
  );
  const [orderItemsForm, setOrdersItemForm] = useState<{
    [key: string]: number | string;
  }>({});
  const [addedItemsList, setAddedItemsList] = useState<PlaceOrderItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleOnFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setOrdersItemForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddItem = (item: Item): void => {
    const { _id, itemdescription, itemname, itemtype, itemunit } = item;

    if (isNaN(orderItemsForm?.[_id] as number)) {
      console.log('Enter a number please');
      return;
    }
    if (Number(orderItemsForm?.[_id]) === 0) {
      // TODO: Call error,
      return;
    }
    const obj: PlaceOrderItem = {
      _id,
      itemname,
      itemquantity: Number(orderItemsForm?.[_id]),
      itemtype,
      itemunit,
      itemdescription,
    };
    setAddedItemsList((prev) => [...prev, obj]);
  };

  useEffect(() => {
    if (hasSavedOrder === 'idle') dispatch(getSavedOrder(userToken));
    else if (hasSavedOrder === 'succeeded') {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'You have some saved order',
          snackbarType: 'info',
        })
      );
      setAddedItemsList(
        savedOrders.map((item, index) => ({
          _id: item._id,
          itemtype: item.itemtype,
          itemname: item.itemname,
          itemdescription: item.itemdescription,
          itemunit: item.itemunit,
          itemquantity: item.itemquantity,
        }))
      );
      let orderItemsListTemp = {};
      savedOrders.forEach((item, index) => {
        orderItemsListTemp = {
          ...orderItemsListTemp,
          [item._id]: item.itemquantity,
        };
      });
      setOrdersItemForm(orderItemsListTemp);
    }
  }, [hasSavedOrder, dispatch, userToken, savedOrders]);
  useEffect(() => {
    if (itemsStatus === 'idle') {
      // TODO: Dispatch once the api is working
      console.log('Dispatching function to fetch all items');
      dispatch(fetchAllItems());
    }
  }, [itemsStatus, dispatch]);

  useEffect(() => {
    if (state) {
      setAddedItemsList(
        state.items.map(
          (item) =>
            ({
              _id: item.itemid,
              itemtype: item.itemtype,
              itemname: item.itemname,
              itemdescription: item.itemdescription,
              itemunit: item.itemunit,
              itemquantity: item.itemquantity,
            } as PlaceOrderItem)
        )
      );
      let orderItemsListTemp = {};
      state.items.forEach((item: any) => {
        orderItemsListTemp = {
          ...orderItemsListTemp,
          [item.itemid]: item.itemquantity,
        };
      });
      setOrdersItemForm(orderItemsListTemp);
    }
  }, []);
  return (
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
          <StyledPaper>
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              Select items to order
            </Typography>
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
                {items
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      <StyledTableCell>{item.itemname}</StyledTableCell>
                      <StyledTableCell>{item.itemtype}</StyledTableCell>
                      <StyledTableCell>
                        <StyledTextField
                          sx={{ width: 'unset' }}
                          name={item._id}
                          value={
                            orderItemsForm?.[item._id]
                              ? orderItemsForm?.[item._id]
                              : ''
                          }
                          label={`${item.itemname} की मात्रा (in ${item.itemunit})`}
                          onChange={handleOnFormChange}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {!addedItemsList.find(
                          (addedItem, index) => addedItem._id === item._id
                        ) ? (
                          <StyledButton
                            variant="contained"
                            color="success"
                            sx={{
                              // minWidth: '100px',
                              // padding: '0.5rem 0.5rem',
                              boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
                            }}
                            onClick={() => {
                              handleAddItem(item);
                            }}
                            // startIcon={<AddRounded sx={{ color: 'white' }} />}
                          >
                            Add item
                          </StyledButton>
                        ) : (
                          <StyledButton
                            disabled
                            variant="contained"
                            color="primary"
                            sx={{ padding: '0.5rem 0.9rem' }}
                          >
                            Item Added
                          </StyledButton>
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
                    count={items.length}
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
          <PlaceOrderDetails
            setOrdersItemForm={setOrdersItemForm}
            addedItemsList={addedItemsList}
            setAddedItemsList={setAddedItemsList}
          />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default PlaceOrder;
