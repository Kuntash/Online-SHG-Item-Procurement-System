import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TableBody,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { Item, PlaceOrderItem, RouterStateType } from '../../types/custom';
import { options } from '../adminData/AdminShgDetails';
import {
  getSavedOrder,
  selectSavedOrder,
} from '../instituteOrders/instituteOrdersSlice';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
import FormDialog from './itemSHGs';
import {
  fetchAllItems,
  resetStatus,
  selectAllItems,
  submitOrder,
} from './itemsSlice';
// import PlaceOrderDetails from './PlaceOrderDetails';
import { IItemList, ISHG } from './itemsSlice';
import { useSelector } from 'react-redux';
import { backendUrl } from '../../config';

const PlaceOrder = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation() as RouterStateType;
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const savedOrders = useAppSelector(selectSavedOrder);
  let items = useAppSelector(selectAllItems);
  const itemsStatus = useAppSelector((state: RootState) => state.items.status);
  const hasSavedOrder = useAppSelector(
    (state: RootState) => state.instituteOrders.hasSavedOrder
  );
  console.log('savedOrders', savedOrders);
  const [orderItemsForm, setOrdersItemForm] = useState<{
    [key: string]: number | string;
  }>({});
  const [orderItemsFormdes, setOrdersItemFormdes] = useState<{
    [key: string]: string;
  }>({});
  const [addedItemsList, setAddedItemsList] = useState<IItemList[]>([]);
  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - addedItemsList.length)
      : 0;

  const [selectedItem, setSelectedItem] = useState<IItemList | null>();

  const [openDialog, setOpenDialog] = useState(false);
  const [displayOnly, setDisplayOnly] = useState(false);
  const submitOrderStatus = useAppSelector(
    (state) => state.items.submitOrderStatus
  );

  const handleSubmitOrder = async () => {
    if (addedItemsList.length === 0) {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Please Add Items',
          snackbarType: 'error',
        })
      );
      return;
    }
    dispatch(submitOrder({ addedItemsList, token: userToken }));
  };

  const handleAddItem = (list: IItemList) => {
    if (list.products.length === 0) return;
    setAddedItemsList((prev) => [...prev, list]);
    //remove items from the addedItemsList
    console.log('list', list);
  };

  React.useEffect(() => {
    console.log(addedItemsList);
  }, [addedItemsList]);

  React.useEffect(() => {
    if (submitOrderStatus === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Submitting Order',
          snackbarType: 'info',
        })
      );
    if (submitOrderStatus === 'failed')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Failed to submit order',
          snackbarType: 'error',
        })
      );
    if (submitOrderStatus === 'succeeded') {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Order Submitted Successfully',
          snackbarType: 'success',
        })
      );
      dispatch(resetStatus());
      navigate('../all-orders');
    }
  }, [submitOrderStatus]);

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
  const handleOnFormChangedes = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOrdersItemFormdes((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOpenDialog = (item: Item, flag: boolean) => {
    setDisplayOnly(true);
    setSelectedItem({
      itemid: item._id,
      itemname: item.itemname,
      itemunit: item.itemunit,
      products: [],
      totalPrices: 0,
      totalquantity: 0,
      itemDescription: item.itemdescription,
      itemType: item.itemtype,
    });
    setOpenDialog(flag);
  };

  const handleDisplayDialog = (item: IItemList) => {
    setDisplayOnly(false);
    setSelectedItem(item);
    setOpenDialog(true);
  };
  const getItems = () => {
    const hash = new Set<string>();
    addedItemsList.forEach((item) => {
      hash.add(item.itemid);
      console.log(item.itemid);
    });
    return items.filter((item) => !hash.has(item._id));
  };

  useEffect(() => {
    if (hasSavedOrder === 'idle' && userToken)
      dispatch(getSavedOrder(userToken));
    else if (hasSavedOrder === 'succeeded') {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'You have some saved order',
          snackbarType: 'info',
        })
      );
      console.log(savedOrders);
      let orderItemsListTemp = {};
      let orderItemsListDesTemp = {};
      savedOrders.forEach((item, index) => {
        orderItemsListTemp = {
          ...orderItemsListTemp,
          [item._id]: item.itemquantity,
        };
        orderItemsListDesTemp = {
          ...orderItemsListDesTemp,
          [item._id]: item.itemdescription,
        };
      });
      setOrdersItemForm(orderItemsListTemp);
      setOrdersItemFormdes(orderItemsListDesTemp);
    }
  }, [hasSavedOrder, dispatch, userToken, savedOrders]);
  useEffect(() => {
    if (itemsStatus === 'idle') {
      // TODO: Dispatch once the api is working
      console.log('Dispatching function to fetch all items');
      dispatch(fetchAllItems());
    }
  }, [itemsStatus, dispatch, addedItemsList]);

  // useEffect(() => {
  //   if (state) {
  //     setAddedItemsList(
  //       state.items.map(
  //         (item) =>
  //           ({
  //             _id: item.itemid,
  //             itemtype: item.itemtype,
  //             itemname: item.itemname,
  //             itemdescription: item.itemdescription,
  //             itemunit: item.itemunit,
  //             itemquantity: item.itemquantity,
  //           } as PlaceOrderItem)
  //       )
  //     );
  //     let orderItemsListTemp = {};
  //     state.items.forEach((item: any) => {
  //       orderItemsListTemp = {
  //         ...orderItemsListTemp,
  //         [item.itemid]: item.itemquantity,
  //       };
  //     });
  //     setOrdersItemForm(orderItemsListTemp);
  //   }
  // }, [state]);
  return (
    <StyledContainer sx={{ flexGrow: 1 }}>
      {/* <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={12}
          md={7}
        > */}
      <StyledPaper sx={{ width: '100%' }}>
        <StyledContainer
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexFlow: 'row',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{ marginBottom: '1rem' }}
          >
            Select items to order
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: '1rem' }}
          >
            Total Order Price:
            {addedItemsList.reduce(
              (total, item) =>
                item.products.reduce(
                  (total, product) =>
                    total + product.price * product.selectedquantity,
                  0
                ) + total,
              0
            )}
          </Typography>
        </StyledContainer>
        <StyledTable>
          <StyledTableHead sx={{ fontSize: '1rem' }}>
            <TableRow>
              <StyledTableHeadCell>Item name</StyledTableHeadCell>
              {/* <StyledTableHeadCell>Item type</StyledTableHeadCell> */}
              <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
              <StyledTableHeadCell>Total Price</StyledTableHeadCell>
              <StyledTableHeadCell></StyledTableHeadCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {/* {items
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      <StyledTableCell>{item.itemname}</StyledTableCell> */}
            {/* <StyledTableCell>{item.itemtype}</StyledTableCell> */}
            {/* <StyledTableCell>
                        <StyledTextField
                          type={'number'}
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
                        <StyledTextField
                          sx={{ width: 'unset' }}
                          name={item._id}
                          value={
                            orderItemsFormdes?.[item._id]
                              ? orderItemsFormdes?.[item._id]
                              : ''
                          }
                          label={`विवरण`}
                          onChange={handleOnFormChangedes}
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
                    </StyledTableRow> */}
            {/* ))} */}
            {/* {emptyRows > 0 && (
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
                </TableRow> */}
            {addedItemsList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <>
                  <StyledTableRow
                    key={index}
                    onClick={() => handleDisplayDialog(item)}
                  >
                    <StyledTableCell>{item.itemname}</StyledTableCell>
                    <StyledTableCell>
                      {item.products.reduce(
                        (total, product) => total + product.selectedquantity,
                        0
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.products.reduce(
                        (total, product) =>
                          total + product.price * product.selectedquantity,
                        0
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                </>
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
                count={addedItemsList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableBody>
        </StyledTable>
        <StyledContainer
          sx={{
            display: 'flex',
            flexFlow: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Autocomplete
            clearOnBlur
            onChange={(e, value) => {
              if (value === null) return;
              handleOpenDialog(value, true);
            }}
            options={getItems()}
            getOptionLabel={(option) => option.itemname}
            sx={{ width: '200px' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Items"
              />
            )}
          />
          <StyledButton
            variant="contained"
            onClick={handleSubmitOrder}
          >
            Submit Order
          </StyledButton>
        </StyledContainer>
      </StyledPaper>
      {/* </Grid>
        <Grid
          item
          xs={12}
          md={5}
        >
          {/* <PlaceOrderDetails
            setOrdersItemForm={setOrdersItemForm}
            setOrdersItemFormdes={setOrdersItemFormdes}
            addedItemsList={addedItemsList}
            setAddedItemsList={setAddedItemsList}
          /> */}
      {/* </Grid>
      </Grid> */}
      {selectedItem ? (
        <FormDialog
          open={openDialog}
          setOpen={setOpenDialog}
          item={selectedItem}
          handleAddItems={handleAddItem}
          displayOnly={displayOnly}
        />
      ) : (
        <></>
      )}
    </StyledContainer>
  );
};

export default PlaceOrder;
