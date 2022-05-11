import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SHGProduct {
  shgproduct: string;
  quantity: number;
  unit: string;
  _id: string;
}
export interface Bidder {
  shgId: string;
  shgname: string;
  shgcontact: string;
  shglocation: string;
  products: SHGProduct[];
  status: 'approved' | 'pending' | 'cancelled';
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface DepartmentOrdersState {
  status: 'idle' | 'failed' | 'succeeded' | 'loading';
  approveOrderStatus: 'idle' | 'failed' | 'succeeded' | 'loading';
  approveBidStatus: 'idle' | 'failed' | 'succeeded' | 'loading';
  orders: {
    _id: string;
    items: {
      itemid: string;
      itemtype: string;
      itemname: string;
      itemquantity: string;
      itemunit: string;
      itemprice: string;
      itemdescription: string;
      _id: string;
    }[];
    bid: Bidder[];
    institutename: string;
    instituteid: string;
    departmentid: string;
    department:
      | 'education'
      | 'healthcare'
      | 'tribal welfare'
      | 'social welfare'
      | 'women and child development'
      | 'ceo';
    institutelocation: string;
    status: 'approved' | 'cancelled' | 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
  }[];
}

const initialState: DepartmentOrdersState = {
  status: 'idle',
  approveOrderStatus: 'idle',
  approveBidStatus: 'idle',
  orders: [],
};

export const approveBidByIds = createAsyncThunk(
  'departmentOrders/approveBidByIds',
  async (
    {
      orderId,
      shgId,
      token,
    }: { orderId: string; shgId: string; token: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
        orderid: orderId,
        shgId: shgId,
        token: token,
      });
      const requestOptions: RequestInit = {
        method: 'POST',
        redirect: 'follow',
        body: raw,
        headers,
      };

      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/approveorder',
        requestOptions
      );
      console.log(response);
      if (response.status === 400)
        throw new Error('An error occurred while approving bid');

      const result = await response.json();
      console.log(result);
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const approveOrderById = createAsyncThunk(
  'departmentOrders/approveOrderById',
  async (
    body: {
      token: string | undefined;
      orderid: string | undefined;
      status: 'pending' | 'cancel' | 'approve' | 'complete';
    },
    { rejectWithValue }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${body.token}`);
      headers.append('Content-Type', 'application/json');

      const requestOptions: RequestInit = {
        headers,
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({
          orderid: body.orderid,
          status: body.status,
        }),
      };
      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/approvefordisplay',
        requestOptions
      );

      console.log(response);
      if (response.status === 400)
        throw new Error("Couldn't update status of the order");
      const result = await response.json();
      console.log(result);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchDepartmentOrders = createAsyncThunk(
  'departmentOrders/fetchDepartmentOrders',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/order/department',
        requestOptions
      );
      if (response.status === 400)
        throw new Error("Couldn't fetch orders of the department");
      const result = await response.json();
      console.log(result);

      return result.orders;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const departmentOrdersSlice = createSlice({
  name: 'departmentOrders',
  initialState,
  reducers: {
    resetOnLogout: (state) => {
      state.orders = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(fetchDepartmentOrders.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartmentOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchDepartmentOrders.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(approveOrderById.pending, (state, action) => {
        state.approveOrderStatus = 'loading';
      })
      .addCase(approveOrderById.fulfilled, (state, action) => {
        state.approveOrderStatus = 'succeeded';
      })
      .addCase(approveOrderById.rejected, (state, action) => {
        state.approveOrderStatus = 'failed';
      })
      .addCase(approveBidByIds.pending, (state, action) => {
        state.approveBidStatus = 'loading';
      })
      .addCase(approveBidByIds.fulfilled, (state, action) => {
        state.approveBidStatus = 'succeeded';
      })
      .addCase(approveBidByIds.rejected, (state, action) => {
        state.approveBidStatus = 'failed';
      });
  },
});

export const { resetOnLogout } = departmentOrdersSlice.actions;
export const selectDeparmentOrders = (state: RootState) =>
  state.departmentOrders.orders;

export const selectDepartmentOrderById = (state: RootState, orderId: string) =>
  state.departmentOrders.orders?.find((order) => order._id === orderId);
export default departmentOrdersSlice.reducer;
