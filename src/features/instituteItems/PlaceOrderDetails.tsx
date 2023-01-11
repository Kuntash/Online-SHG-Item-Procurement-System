export {}
// import { RemoveRounded } from '@mui/icons-material';
// import {
//   Alert,
//   CircularProgress,
//   TableBody,
//   TableRow,
//   Typography,
// } from '@mui/material';
// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { RootState } from '../../app/store';
// import {
//   ContainerRowBox,
//   StyledButton,
//   StyledPaper,
//   StyledTable,
//   StyledTableCell,
//   StyledTableHead,
//   StyledTableHeadCell,
//   StyledTableRow,
// } from '../../components/custom';
// import { PlaceOrderItem, RouterStateType } from '../../types/custom';
// import { selectUser } from '../auth/authSlice';
// import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
// import { modifyOrder, resetStatus, saveOrder, submitOrder } from './itemsSlice';

// import { backendUrl } from '../../config';

// const PlaceOrderDetails = ({
//   addedItemsList,
//   setAddedItemsList,
//   setOrdersItemForm,
//   setOrdersItemFormdes,
// }: {
//   setOrdersItemForm: React.Dispatch<
//     React.SetStateAction<{ [key: string]: number | string }>
//   >;
//   setOrdersItemFormdes: React.Dispatch<
//     React.SetStateAction<{ [key: string]: string }>
//   >;
//   addedItemsList: PlaceOrderItem[];
//   setAddedItemsList: React.Dispatch<React.SetStateAction<PlaceOrderItem[]>>;
// }) => {
//   const dispatch = useAppDispatch();
//   const user = useAppSelector(selectUser);
//   const { state } = useLocation() as RouterStateType;
//   const submitOrderStatus = useAppSelector(
//     (state: RootState) => state.items.submitOrderStatus
//   );
//   const saveOrderStatus = useAppSelector(
//     (state: RootState) => state.items.saveOrderStatus
//   );
//   const handleRemoveAddedItem = (itemId: string | undefined) => {
//     setAddedItemsList((prev) => {
//       return prev.filter((addedItem, index) => addedItem._id !== itemId);
//     });
//     fetch(backendUrl + 'institute/deletesavedorder', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${user.token}`,
//       },
//       body: JSON.stringify({
//         itemid: itemId,
//       }),
//     });
//   };

//   const handleOrder = async (type: 'save' | 'submit') => {
//     if (state?.id) {
//       switch (type) {
//         case 'save':
//           await dispatch(saveOrder({ addedItemsList, token: user.token }));
//           break;
//         case 'submit':
//           await dispatch(
//             modifyOrder({
//               addedItemsList,
//               token: user.token,
//               orderId: state.id,
//             })
//           );
//       }
//     } else {
//       if (addedItemsList.length === 0) {
//         dispatch(
//           handleOpenSnackbar({
//             snackbarMessage: 'No items in the cart',
//             snackbarType: 'warning',
//           })
//         );
//         return;
//       }

//       switch (type) {
//         case 'save':
//           await handleSaveOrder();
//           break;
//         case 'submit':
//           await handleSubmitOrder();
//           break;
//       }
//     }

//     // NOTE: Resetting all the form inputs and items added after saveOrder or lockOrder is completed
//     setOrdersItemForm({});
//     setOrdersItemFormdes({});
//     setAddedItemsList([]);
//   };

//   const handleSaveOrder = async () => {
//     await dispatch(saveOrder({ addedItemsList, token: user.token }));
//   };
//   const handleSubmitOrder = async () => {
//     // await dispatch(submitOrder({ addedItemsList, token: user.token }));
//   };

//   // NOTE: Reset the saveOrderStatus and submitOrderStatus on render to 'idle'
//   useEffect(() => {
//     dispatch(resetStatus());
//   }, [dispatch]);

//   useEffect(() => {
//     let snackbarMessage = '',
//       snackbarType: 'error' | 'success' | 'warning' | 'info' = 'info';

//     if (saveOrderStatus === 'succeeded') {
//       snackbarMessage = 'Order successfully saved';
//       snackbarType = 'success';
//     } else if (saveOrderStatus === 'failed') {
//       snackbarMessage = 'Error while saving order';
//       snackbarType = 'error';
//     } else if (saveOrderStatus === 'loading') {
//       snackbarMessage = 'Saving order';
//       snackbarType = 'info';
//     }

//     if (snackbarMessage !== '')
//       dispatch(
//         handleOpenSnackbar({
//           snackbarMessage,
//           snackbarType,
//         })
//       );
//   }, [dispatch, saveOrderStatus]);
//   useEffect(() => {
//     let snackbarMessage = '',
//       snackbarType: 'error' | 'success' | 'warning' | 'info' = 'info';

//     if (submitOrderStatus === 'succeeded') {
//       snackbarMessage = 'Order successfully submitted';
//       snackbarType = 'success';
//     } else if (submitOrderStatus === 'failed') {
//       snackbarMessage = 'Error while Submitting order';
//       snackbarType = 'error';
//     } else if (submitOrderStatus === 'loading') {
//       snackbarMessage = 'Submitting order';
//       snackbarType = 'info';
//     } else {
//       snackbarMessage = '';
//     }

//     if (snackbarMessage !== '')
//       dispatch(
//         handleOpenSnackbar({
//           snackbarMessage,
//           snackbarType,
//         })
//       );
//   }, [dispatch, submitOrderStatus]);
//   return (
//     <StyledPaper>
//       <Typography
//         variant="h2"
//         sx={{ marginBottom: '1rem' }}
//       >
//         Order Cart
//       </Typography>
//       {addedItemsList.length === 0 ? (
//         <Alert
//           severity="info"
//           sx={{ marginBottom: '1rem', borderRadius: '8px' }}
//         >
//           Try adding some items
//         </Alert>
//       ) : (
//         <>
//           <StyledTable>
//             <StyledTableHead sx={{ fontSize: '1rem' }}>
//               <TableRow>
//                 <StyledTableHeadCell>Item name</StyledTableHeadCell>
//                 <StyledTableHeadCell>Item quantity</StyledTableHeadCell>
//                 <StyledTableHeadCell></StyledTableHeadCell>
//               </TableRow>
//             </StyledTableHead>
//             <TableBody>
//               {addedItemsList.map((addedItem, index) => (
//                 <StyledTableRow
//                   key={index}
//                   sx={{ fontSize: '0.875rem' }}
//                 >
//                   <StyledTableCell>{addedItem.itemname}</StyledTableCell>
//                   <StyledTableCell>{addedItem.itemquantity}</StyledTableCell>
//                   <StyledTableCell>
//                     <StyledButton
//                       variant="contained"
//                       color="primary"
//                       startIcon={<RemoveRounded sx={{ color: 'white' }} />}
//                       sx={{ padding: '0.5rem 0.9rem' }}
//                       onClick={() => {
//                         handleRemoveAddedItem(addedItem._id);
//                       }}
//                     >
//                       Remove Item
//                     </StyledButton>
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))}
//             </TableBody>
//           </StyledTable>
//           <ContainerRowBox
//             sx={{ marginTop: '1rem', justifyContent: 'space-between' }}
//           >
//             <StyledButton
//               startIcon={
//                 saveOrderStatus === 'loading' ? (
//                   <CircularProgress sx={{ color: 'white' }} />
//                 ) : null
//               }
//               color="info"
//               variant="contained"
//               sx={{
//                 padding: '1rem 0',
//                 boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
//               }}
//               onClick={handleOrder.bind(this, 'save')}
//             >
//               Save Order
//             </StyledButton>
//             <StyledButton
//               startIcon={
//                 submitOrderStatus === 'loading' ? (
//                   <CircularProgress sx={{ color: 'white' }} />
//                 ) : null
//               }
//               color="success"
//               variant="contained"
//               sx={{
//                 padding: '1rem 0',
//                 boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
//               }}
//               onClick={handleOrder.bind(this, 'submit')}
//             >
//               Submit order
//             </StyledButton>
//           </ContainerRowBox>
//         </>
//       )}
//     </StyledPaper>
//   );
// };

// export default PlaceOrderDetails;
