import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface DepartmentOrdersState {
  status: 'idle' | 'failed' | 'succeeded' | 'loading';
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
    bid: {
      shgId: string;
      shgname: string;
      shgcontact: string;
      shglocation: string;
      shgproduct: string;
      quantity: string;
      approved: boolean;
      _id: string;
      unit: string;
    }[];
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
  orders: [],
};

export const approveOrderById = createAsyncThunk(
  'departmentOrders/approveOrderById',
  async (
    body: {
      token: string | undefined;
      orderid: string | undefined;
      status: 'pending' | 'cancelled' | 'approved' | 'completed';
    },
    { rejectWithValue }
  ) => {
    console.log(body.orderid);
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${body.token}`);
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

      if (response.status === 400)
        throw new Error("Couldn't update status of the order");
      const result = await response.json();
      console.log(result);
      return result.message;
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
        state.status = 'loading';
      })
      .addCase(approveOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(approveOrderById.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export const { resetOnLogout } = departmentOrdersSlice.actions;
export const selectDeparmentOrders = (state: RootState) =>
  state.departmentOrders.orders;

export const selectDepartmentOrderById = (state: RootState, orderId: string) =>
  state.departmentOrders.orders?.find((order) => order._id === orderId);
export default departmentOrdersSlice.reducer;
