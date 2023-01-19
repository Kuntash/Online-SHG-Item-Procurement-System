import  React,{useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { backendUrl } from '../../config';
import { selectUser } from '../auth/authSlice';
import { TableBody, TableRow, Typography } from '@mui/material';
import {
  StyledButton,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
  StyledTextField,
} from '../../components/custom';

import itemsSlice, { IItemList, ISHG, modifyOrder } from './itemsSlice';
import { useAppSelector } from '../../app/hooks';
import { useAppDispatch } from '../../app/hooks';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
export default function FormDialog(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  item: IItemList;
  handleAddItems: any;
  modifyOrder: boolean;
}) {
  const dispatch = useAppDispatch();
  const [page, setPage] = React.useState<number>(0);
  const rowsPerPage = 5;
  const [selectedShgs, setSelectedShgs] = React.useState<ISHG[] | []>([]);
  const [productQuantities, setProductQuatities] = React.useState<{
    [key: string]: number;
  }>({});
  const { open, setOpen, item } = props;
  const [shgs, setShgs] = React.useState<ISHG[] | null>(null);
  const token = useAppSelector(selectUser).token;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlequantity = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    productid: string
  ) => {
    setProductQuatities((prev) => ({
      ...prev,
      [productid]: parseFloat(e.target.value),
    }));
  };

  const handleAddShg = (i: ISHG) => {
    if (productQuantities[i.productid] > i.quantity) {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Quantity cannot be more than available quantity',
          snackbarType: 'error',
        })
      );
      return;
    }
    setSelectedShgs((s) => [
      ...s,
      { ...i, selectedquantity: productQuantities[i.productid] },
    ]);
  };
  const handleClearShg = (i: ISHG) => {
    setSelectedShgs((shgs)=>shgs.filter(shg=>shg.id!==i.id))
  }

  const handleSubmit = () => {
    item.products = selectedShgs;
    props.handleAddItems(item);
    handleClose();
  };

  // React.useEffect(() => {
  //   if(props.modifyOrder === false){

  //   }
  // }, [])
  

  React.useEffect(() => {
    setSelectedShgs([])
  }, [item]);

  React.useEffect(() => {
    const itemid = item.itemid;
    if (!itemid) return;
    const getshgs = async () => {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
      };
      try {
        const response = await fetch(
          `${backendUrl}institute/getinventory/${itemid}`,
          requestOptions
        );
        if (response.status === 400)
          throw new Error('An error occured while posting orders');
        const result = await response.json();
        console.log("shgs products",result);
        setShgs(
          result.productdata.map((r: any) => {
            return {
              productid: r._id,
              name: r.shgid.name,
              id: r.shgid._id,
              quantity: r.quantity,
              location: r.shgid.location,
              price: r.price,
            };
          })
        );
        return result;
      } catch (err) {
        console.log(err);
      }
    };
    setShgs(null);
    setSelectedShgs([]);
    getshgs();
    if(props.modifyOrder) {
      const q :{[key: string]:number}={}
      item.products.forEach(product => {
        console.log(product)
        q[product.productid] = product.selectedquantity
      })
      console.log('filtered quantity', q)
      setSelectedShgs(item.products)
      setProductQuatities(q)
    }
    if(props.modifyOrder) console.log("already selected items",item.products)
  }, [item, props.modifyOrder]);

  return (
    <div>
      <Dialog
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '100vw', // Set your width here
            },
          },
        }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Selected Item :{item.itemname}</DialogTitle>
        <DialogContent>
          <Typography
            variant="h2"
            sx={{ marginBottom: '1rem' }}
          >
            {!props.modifyOrder ? 'Select items to order' : 'Modify order'}
          </Typography>
          <StyledTable>
            <StyledTableHead sx={{ fontSize: '1rem' }}>
              <TableRow>
                <StyledTableHeadCell>SHG name</StyledTableHeadCell>
                <StyledTableHeadCell>Available Quantity</StyledTableHeadCell>
                <StyledTableHeadCell>Price</StyledTableHeadCell>
                <StyledTableHeadCell>Quantity</StyledTableHeadCell>
                <StyledTableHeadCell>location</StyledTableHeadCell>
                <StyledTableHeadCell></StyledTableHeadCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {shgs
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((shg, index) => (
                  <StyledTableRow
                    key={index}
                    sx={{ fontSize: '0.875rem' }}
                  >
                    <StyledTableCell>{shg.name}</StyledTableCell>
                    <StyledTableCell>{shg.quantity}</StyledTableCell>
                    <StyledTableCell>{shg.price}</StyledTableCell>
                    <StyledTableCell>
                      {shg.location.toUpperCase()}
                    </StyledTableCell>
                        {!selectedShgs.find(
                          (selectedshg, index) =>
                            shg.productid === selectedshg.productid
                        ) ? (
                          <>
                    <StyledTableCell>
                        <StyledTextField
                          type={'number'}
                          sx={{ width: 'unset' }}
                          name={shg.productid}
                          value={
                            productQuantities[shg.productid]
                              ? productQuantities[shg.productid]
                              : ''
                          }
                          label={`${item.itemname} की मात्रा (in ${item.itemunit})`}
                          onChange={(e) => handlequantity(e, shg.productid)}
                        />
                    </StyledTableCell>
                      <StyledTableCell>
                          <StyledButton
                            variant="contained"
                            color="success"
                            sx={{
                              boxShadow: 'rgb(0 171 85 / 24%) 0px 8px 16px',
                            }}
                            onClick={() => {
                              handleAddShg(shg);
                            }}
                          >
                            Add
                          </StyledButton>
                      </StyledTableCell>
                      </>
                        ) : (
                          <>
                          <StyledTableCell>
                            {productQuantities[shg.productid]}
                          </StyledTableCell>
                          <StyledTableCell>
                          <StyledButton
                            variant="contained"
                            color="error"
                            onClick={() => {
                              handleClearShg(shg);
                            }}
                            sx={{ padding: '0.5rem 0.9rem' }}
                          >
                            Edit
                          </StyledButton>
                          </StyledTableCell>
                          </>
                        )}
                  </StyledTableRow>
                ))}
            </TableBody>
          </StyledTable>
        </DialogContent>
        <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit}>submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
