import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Item } from '../../types/custom';
import { backendUrl } from '../../config';
import { selectUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import { TableBody, TableRow, Typography } from '@mui/material';
import { StyledButton, StyledPaper, StyledTable, StyledTableCell, StyledTableHead, StyledTableHeadCell, StyledTableRow, StyledTextField } from '../../components/custom';

import { IItemList,ISHG } from './itemsSlice';



export default function FormDialog(props:{
    open:boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    item:IItemList;
    handleAddItems:any;
    displayOnly:boolean
}) {
    const [page, setPage] = React.useState<number>(0);
    const rowsPerPage = 5;
    // const emptyRows =
    //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shgs.length) : 0;

    const [selectedShgs,setSelectedShgs] = React.useState<ISHG[]|[]>([]);
    const [productQuantities,setProductQuatities] = React.useState<{[key:string]:number}>({});
    const {open,setOpen,item} = props;
    const [shgs,setShgs] = React.useState<ISHG[] | null>(null)
    const token = useSelector(selectUser).token;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlequantity=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,productid:string)=>{
    setProductQuatities(prev=>(
      {...prev,
        [productid]:parseFloat(e.target.value)
      }
    ))
  }

  const handleAddShg=(i:ISHG)=>{
    if(productQuantities[i.productid]>i.quantity) return;
    setSelectedShgs(s=>[...s,{...i,selectedquantity:productQuantities[i.productid]}]);
  }

  const handleSubmit=()=>{
    item.products=selectedShgs
    props.handleAddItems(item)
    handleClose()
  }

  React.useEffect(()=>{
    console.log(selectedShgs)
  },[selectedShgs])

  React.useEffect(()=>{
    const itemid = item.itemid;
    if(!itemid) return;
    setShgs(null);
    setSelectedShgs([]);
    const getshgs = async()=>{
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        headers.append('Content-type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        const requestOptions: RequestInit = {
          method: 'GET',
          headers,
        };
        try{
      const response = await fetch(
        `${backendUrl}institute/getinventory/${itemid}`,
        requestOptions
      );
      if (response.status === 400)
        throw new Error('An error occured while posting orders');
      const result = await response.json();
      console.log(result);
      setShgs(result.productdata.map((r:any)=>{
        return {
        productid:r._id,
        name:r.shgid.name,
        id:r.shgid._id,
        quantity:r.quantity,
        location:r.shgid.location,
        price:r.price
        }
      }))
      return result;
    } catch (err) {
        console.log(err)
    }
    }
    if(props.displayOnly) getshgs();
    else {
      setShgs(item.products)
    }
  },[item,props.displayOnly])

  return (
    <div>
      <Dialog sx={{
      "& .MuiDialog-container": {
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "100vw",  // Set your width here
        },
      },
    }}
      
      open={open} onClose={handleClose}>
        <DialogTitle>Selected Item :{item.itemname}</DialogTitle>
        <DialogContent>
          {/* <StyledPaper> */}
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
            {props.displayOnly?"Select items to order":"Selected Items"}
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
                {shgs?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((shg, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      <StyledTableCell>{shg.name}</StyledTableCell>
                      <StyledTableCell>{shg.quantity}</StyledTableCell>
                      <StyledTableCell>{shg.price}</StyledTableCell>
                      <StyledTableCell>
                        {props.displayOnly?
                        <StyledTextField
                          type={'number'}
                          sx={{ width: 'unset' }}
                          name={shg.productid}
                          value={productQuantities[shg.productid]?productQuantities[shg.productid]:''}
                          label={`${item.itemname} की मात्रा (in ${item.itemunit})`}
                          onChange={(e)=>handlequantity(e,shg.productid)}
                        />:shg.selectedquantity}
                      </StyledTableCell>
                      <StyledTableCell>{shg.location}</StyledTableCell>
                      {/* <StyledTableCell>
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
                      </StyledTableCell> */}
                      {props.displayOnly?
                      <StyledTableCell>
                        {!selectedShgs.find(
                          (selectedshg, index) => shg.productid === selectedshg.productid
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
                              handleAddShg(shg);
                            }}
                            // startIcon={<AddRounded sx={{ color: 'white' }} />}
                          >
                            Add
                          </StyledButton>
                        ) : (
                          <StyledButton
                            disabled
                            variant="contained"
                            color="primary"
                            sx={{ padding: '0.5rem 0.9rem' }}
                          >
                            Added
                          </StyledButton>
                        )}
                      </StyledTableCell>:""}
                    </StyledTableRow>
                  ))}
                {/* {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={5} />
                  </StyledTableRow>
                )} */}
                {/* <TableRow>
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
              </TableBody>
            </StyledTable>
          {/* </StyledPaper> */}
        </DialogContent>
        <DialogActions>{!props.displayOnly?
          <Button onClick={handleClose}>Close</Button>:<>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>submit</Button></>}
        </DialogActions>
      </Dialog>
    </div>
  );
}