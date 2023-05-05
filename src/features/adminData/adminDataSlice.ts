import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  AdminChangedPriceOfBid,
  AdminOrderDataType,
  AdminSHGDataType,
  AdminDepartmentDataType,
  AdminProductDataType,
} from '../../types/custom';

import { backendUrl } from '../../config';

export interface AdminDataType {
  shgData: {
    shgDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    shgData: AdminSHGDataType[] | undefined;
  };
  orderData: {
    orderDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    orderData: AdminOrderDataType[];
  };
  department: {
    departmentDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    departmentData: AdminDepartmentDataType[];
  };
  product: {
    productDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    productData: AdminProductDataType[];
  };
  bidChangeStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
}

const initialState: AdminDataType = {
  shgData: {
    shgDataStatus: 'idle',
    shgData: [],
  },
  orderData: {
    orderDataStatus: 'idle',
    orderData: [],
  },
  department: {
    departmentDataStatus: 'idle',
    departmentData: [],
  },
  product: {
    productDataStatus: 'idle',
    productData: [],
  },
  bidChangeStatus: 'idle',
};

export const changeBidPriceOfAnOrder = createAsyncThunk(
  'adminData/changeBidPriceOfAnOrder',
  async (
    {
      token,
      bidId,
      products,
    }: { token: string; bidId: string; products: AdminChangedPriceOfBid[] },
    { rejectWithValue }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-Type', 'application/json');
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: JSON.stringify({
          bidid: bidId,
          products,
        }),
      };
      const response = await fetch(
        backendUrl + 'ceo/changebidprice',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error occurred while changing bids');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const fetchAllAdminOrders = createAsyncThunk(
  'adminData/fetchAllAdminOrders',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      if (token === undefined) throw new Error('Token is undefined');
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };

      const response = await fetch(
        backendUrl + 'ceo/getallorders',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error while fetching all admin orders');
      const result: { success: boolean; orders: AdminOrderDataType[] } =
        await response.json();
      return result.orders;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAllShgData = createAsyncThunk(
  'adminData/fetchAllShgData',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      if (token === undefined) throw new Error('Token is undefined');

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };
      const response = await fetch(
        backendUrl + 'ceo/getshgdata',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error occurred while fetching Shg Data');

      const result: { message: string; data: AdminSHGDataType[] } =
        await response.json();
      return result.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const fetchAllDepartmentData = createAsyncThunk(
  'adminData/fetchAllDepartmentData',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      if (token === undefined) throw new Error('Token is undefined');

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };
      const response = await fetch(
        backendUrl + 'ceo/getdepartments',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error occurred while fetching Department Data');

      const result: {
        message: string;
        departmentdata: AdminDepartmentDataType[];
      } = await response.json();
      return result.departmentdata;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAllProductData = createAsyncThunk(
  'adminData/fetchAllProductData',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      if (token === undefined) throw new Error('Token is undefined');

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };
      const response = await fetch(
        backendUrl + 'order/getallitems',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error occurred while fetching Product Data');
      const result: [AdminProductDataType] = await response.json();
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const adminDataSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    resetOnLogout: (state: AdminDataType) => {
      state.orderData.orderDataStatus = 'idle';
      state.shgData.shgDataStatus = 'idle';
      state.orderData.orderData = [];
      state.shgData.shgData = [];
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(fetchAllShgData.pending, (state) => {
        state.shgData.shgDataStatus = 'loading';
      })
      .addCase(fetchAllShgData.fulfilled, (state, action) => {
        state.shgData.shgDataStatus = 'succeeded';
        state.shgData.shgData = action.payload;
      })
      .addCase(fetchAllShgData.rejected, (state) => {
        state.shgData.shgDataStatus = 'failed';
      })
      .addCase(fetchAllDepartmentData.pending, (state) => {
        state.department.departmentDataStatus = 'loading';
      })
      .addCase(fetchAllDepartmentData.fulfilled, (state, action) => {
        state.department.departmentDataStatus = 'succeeded';
        state.department.departmentData = action.payload;
      })
      .addCase(fetchAllDepartmentData.rejected, (state) => {
        state.department.departmentDataStatus = 'failed';
      })
      .addCase(fetchAllProductData.pending, (state) => {
        state.product.productDataStatus = 'loading';
      })
      .addCase(fetchAllProductData.fulfilled, (state, action) => {
        state.product.productDataStatus = 'succeeded';
        state.product.productData = action.payload;
      })
      .addCase(fetchAllProductData.rejected, (state) => {
        state.product.productDataStatus = 'failed';
      })
      .addCase(fetchAllAdminOrders.pending, (state) => {
        state.orderData.orderDataStatus = 'loading';
      })
      .addCase(fetchAllAdminOrders.fulfilled, (state, action) => {
        state.orderData.orderDataStatus = 'succeeded';
        state.orderData.orderData = action.payload;
      })
      .addCase(fetchAllAdminOrders.rejected, (state) => {
        state.orderData.orderDataStatus = 'failed';
      })
      .addCase(changeBidPriceOfAnOrder.pending, (state) => {
        state.bidChangeStatus = 'loading';
      })
      .addCase(changeBidPriceOfAnOrder.fulfilled, (state) => {
        state.bidChangeStatus = 'succeeded';
      })
      .addCase(changeBidPriceOfAnOrder.rejected, (state) => {
        state.bidChangeStatus = 'failed';
      });
  },
});

export const { resetOnLogout } = adminDataSlice.actions;
export const selectAdminOrderById = (state: RootState, id: string) =>
  state.admin.orderData.orderData.find((order, index) => order._id === id);
export const selectAllShgs = (state: RootState) => state.admin.shgData.shgData;
export const selectAllDepartments = (state: RootState) =>
  state.admin.department.departmentData;
export const selectAllProducts = (state: RootState) =>
  state.admin.product.productData;
export const selectShgById = (state: RootState, id: string) =>
  state.admin.shgData.shgData?.find((shg) => shg._id === id);
export default adminDataSlice.reducer;
