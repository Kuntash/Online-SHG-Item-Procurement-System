import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  ApproveBidProductListType,
  InstituteOrder,
  PlaceOrderItem,
} from '../../types/custom';

interface OrderState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  lockOrderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  hasSavedOrder: 'idle' | 'loading' | 'succeeded' | 'failed';
  approveBidStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  savedOrder: PlaceOrderItem[];
  orders: InstituteOrder[] | [];
}

const initialState: OrderState = {
  status: 'idle',
  approveBidStatus: 'idle',
  lockOrderStatus: 'idle',
  hasSavedOrder: 'idle',
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
        'https://selfhelpgroup-backend.herokuapp.com/institute/approveorder',
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
        'https://selfhelpgroup-backend.herokuapp.com/institute/getsavedorder',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error occurred while getting saved order');
      const result: { message: string; savedorders: PlaceOrderItem[] } =
        await response.json();
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
    { rejectWithValue }
  ) => {
    try {
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
        'https://selfhelpgroup-backend.herokuapp.com/order/lock',
        requestOptions
      );
      if (response.status === 400) throw new Error('Error while locking order');
      const result = await response.json();
      return result;
    } catch (err) {
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
        'https://selfhelpgroup-backend.herokuapp.com/order/institute',
        requestOptions
      );

      if (response.status === 400) throw new Error('An error occurred');
      const result = await response.json();
      console.log(result);
      return result.orders;
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);

const instituteOrdersSlice = createSlice({
  name: 'instituteOrders',
  initialState,
  reducers: {},
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
export default instituteOrdersSlice.reducer;
