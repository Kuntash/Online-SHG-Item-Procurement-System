import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  ApproveBidProductListType,
  InstituteOrder,
  PlaceOrderItem,
} from '../../types/custom';

import { backendUrl } from '../../config';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';

interface OrderState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  lockOrderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  hasSavedOrder: 'idle' | 'loading' | 'succeeded' | 'failed';
  orderdelivery: 'idle' | 'loading' | 'succeeded' | 'failed';
  approveBidStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updatedelivery: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteorder: 'idle' | 'loading' | 'succeeded' | 'failed';
  savedOrder: PlaceOrderItem[];
  orders: InstituteOrder[] | [];
}

const initialState: OrderState = {
  status: 'idle',
  approveBidStatus: 'idle',
  lockOrderStatus: 'idle',
  hasSavedOrder: 'idle',
  orderdelivery: 'idle',
  updatedelivery: 'idle',
  deleteorder: 'idle',
  savedOrder: [],
  orders: [],
};


export const approveBidByInstitute = createAsyncThunk(
  'instituteOrders/approveBidByInstitute',
  async (
    {
      token,
      orderId,
      shgId,
      products,
    }: {
      token: string | undefined;
      orderId: string;
      shgId: string;
      products: ApproveBidProductListType[];
    },
    { rejectWithValue }
  ) => {
    try {
      console.log(token);
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify({
        orderid: orderId,
        shgId: shgId,
        products,
      });
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        backendUrl+'institute/approveorder',
        requestOptions
      );
      const result = await response.json();
      console.log(result);

      if (response.status === 400)
        throw new Error('An error occured while approving bid');
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getSavedOrder = createAsyncThunk(
  'instituteOrders/getSavedOrder',
  async (token: undefined | string, { rejectWithValue }) => {
    try {
      console.log("getting saved orders",token)
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };
      const response = await fetch(
        backendUrl+'institute/getsavedorder',
        requestOptions
      );
      console.log(response)
      if (response.status === 400)
        throw new Error('Error occurred while getting saved order');
      const result: { message: string; savedorders: PlaceOrderItem[] } =
        await response.json();
        console.log(result.savedorders)
      return result.savedorders;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const lockOrderOfInstitute = createAsyncThunk(
  'instituteOrders/lockOrdersOfInstitute',
  async (
    { token, orderId }: { token: string | undefined; orderId: string },
    { rejectWithValue,dispatch }
  ) => {
    try {dispatch(handleOpenSnackbar({
      snackbarMessage:'locking order',
      snackbarType:'info'
    }))
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify({ orderid: orderId });
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        backendUrl+'order/lock',
        requestOptions
      );
      if(response.status === 200) dispatch(handleOpenSnackbar({
        snackbarMessage:'Order Locked Successfully',
        snackbarType:'success'
      }))
      if (response.status === 400) throw new Error('Error while locking order');
      const result = await response.json();
      return result;
    } catch (err) {
      dispatch(handleOpenSnackbar({
      snackbarMessage:'Failed to lock order',
      snackbarType:'error'
    }))
      
      return rejectWithValue(err);
    }
  }
);
export const fetchAllOrdersOfInstitute = createAsyncThunk(
  'instituteOrders/fetchAllOrdersOfInstitute',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
        headers,
      };
      const response = await fetch(
        backendUrl+'order/institute',
        requestOptions
      );

      if (response.status === 400) throw new Error('An error occurred');
      const result = await response.json();
      console.log("result",result);
      return result.orders;
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);

export const orderdelivery = createAsyncThunk(
  'instituteOrders/orderdelivery',
  async (
    {
      token,
      orderId,
      id,
    }: { token: string | undefined; orderId: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify({ orderid: orderId, approvedbidid: id });
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: raw,
      };
      const response = await fetch(
        backendUrl+'institute/verifydelivery',
        requestOptions
      );
      if (response.status === 400) throw new Error('An error occurred');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'instituteOrders/deleteOrder',
  async (
    {
      token,
      orderId,
    }: { token: string | undefined; orderId: string; },
    { rejectWithValue,dispatch }
  ) => {
    try {
      dispatch(handleOpenSnackbar({
        snackbarMessage:'Deleting order',
        snackbarType:'info'
      }))
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify({ orderid: orderId});
      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers,
        redirect: 'follow',
        body: raw,
      };
      const response = await fetch(
        backendUrl+'order/deleteorder/',
        requestOptions
      );
    if(response.status === 200) {dispatch(handleOpenSnackbar({
      snackbarMessage:'Order deleted',
      snackbarType:'success'
    }))
  dispatch(fetchAllOrdersOfInstitute(token));
  }
      if (response.status === 400) throw new Error('An error occurred');
    } catch (err) {
      dispatch(handleOpenSnackbar({
        snackbarMessage:'Error occured while deleting order',
        snackbarType:'error'
      }))
      return rejectWithValue(err);
    }
  }
);


export const updatedelivery = createAsyncThunk(
  'institute/updatedelivery',
  async (
    {
      token,
      order,
    }: { token: string | undefined; order:InstituteOrder},
    { rejectWithValue,dispatch }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const formatted = {
        orderid:order._id,
        products:order.items.map(product=>({productid:product._id}))
      } 
      console.log("request",formatted)
      const raw = JSON.stringify(formatted)
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: raw,
      };
      const response = await fetch(
        backendUrl+'institute/updatedelivery',
        requestOptions
      );
      if (response.status === 400) throw new Error('An error occurred');
      if (response.status === 200) dispatch(fetchAllOrdersOfInstitute(token))
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const instituteOrdersSlice = createSlice({
  name: 'instituteOrders',
  initialState,
  reducers: {
    resetdelivery: (state) => {
      state.orderdelivery = 'idle';
    },
    resetapproveBidStatus: (state) => {
      state.approveBidStatus = 'idle';
    },
    resetupdatedeliver:(state)=>{
      state.updatedelivery = 'idle'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrdersOfInstitute.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrdersOfInstitute.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
        // state.orders = action.payload;
      })
      .addCase(lockOrderOfInstitute.pending, (state, action) => {
        state.lockOrderStatus = 'loading';
      })
      .addCase(lockOrderOfInstitute.fulfilled, (state, action) => {
        state.lockOrderStatus = 'succeeded';
      })
      .addCase(lockOrderOfInstitute.rejected, (state, action) => {
        state.lockOrderStatus = 'failed';
      })
      .addCase(getSavedOrder.pending, (state, action) => {
        state.hasSavedOrder = 'loading';
      })
      .addCase(getSavedOrder.fulfilled, (state, action) => {
        state.hasSavedOrder = 'succeeded';
        state.savedOrder = action.payload;
      })
      .addCase(getSavedOrder.rejected, (state, action) => {
        state.hasSavedOrder = 'failed';
      })
      .addCase(approveBidByInstitute.pending, (state, action) => {
        state.approveBidStatus = 'loading';
      })
      .addCase(approveBidByInstitute.fulfilled, (state, action) => {
        state.approveBidStatus = 'succeeded';
        state.savedOrder = action.payload;
      })
      .addCase(approveBidByInstitute.rejected, (state, action) => {
        state.approveBidStatus = 'failed';
      })
      .addCase(orderdelivery.pending, (state, action) => {
        state.orderdelivery = 'loading';
      })
      .addCase(orderdelivery.fulfilled, (state, action) => {
        state.orderdelivery = 'succeeded';
      })
      .addCase(orderdelivery.rejected, (state, action) => {
        state.orderdelivery = 'failed';
      })
      .addCase(updatedelivery.pending, (state, action) => {
        state.updatedelivery = 'loading';
      })
      .addCase(updatedelivery.fulfilled, (state, action) => {
        state.updatedelivery = 'succeeded';
      })
      .addCase(updatedelivery.rejected, (state, action) => {
        state.updatedelivery = 'failed';
      })
      .addCase(deleteOrder.pending, (state, action) => {
        state.deleteorder = 'loading';
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleteorder = 'succeeded';
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deleteorder = 'failed';
      });
  },
});

export const selectAllInstituteOrders = (state: RootState): InstituteOrder[] =>
  state.instituteOrders.orders;

export const selectSavedOrder = (state: RootState) =>
  state.instituteOrders.savedOrder;
export const selectInstituteOrderById = (state: RootState, orderId: string) =>
  state.instituteOrders.orders.find(
    (order: InstituteOrder) => order._id === orderId
  );
export const { resetdelivery, resetapproveBidStatus } =
  instituteOrdersSlice.actions;
export default instituteOrdersSlice.reducer;
