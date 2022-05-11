import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface AdminOrderProduct {
  itemid: string;
  itemtype: 'loose' | 'packed';
  itemname: string;
  itemquantity: number;
  approvedquantity: number;
  itemunit: string;
  itemprice: number;
  itemdescription: string;
  _id: string;
}

export interface AdminOrderBid {
  shgId: string;
  shgname: string;
  shgcontact: string;
  shglocation: string;
  products: {
    shgproduct: string;
    quantity: number;
    unit: string;
    unitprice: number;
    totalprice: number;
    _id: string;
  }[];
  status: 'approved' | 'pending' | 'cancelled' | 'completed';
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface AdminOrderDataType {
  _id: string;
  items: AdminOrderProduct[];
  bid: AdminOrderBid[];
  approvedbid: AdminOrderBid[];
  institutename: string;
  instituteid: string;
  department: string;
  institutelocation: string;
  status: 'approved' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AdminInstituteOrderedProduct {
  shgproduct: string;
  quantity: number;
  unit: string;
  unitprice: number;
  totalprice: number;
  _id: string;
}
export interface AdminSHGProduct {
  name: string;
  type: 'loose' | 'packed';
  quantity: number;
  unit: string;
  _id: string;
}

export interface AdminSHGOrder {
  orderid: string;
  institutename: string;
  institutelocation: string;
  department:
    | 'education'
    | 'healthcare'
    | 'tribal welfare'
    | 'social welfare'
    | 'women and child development'
    | 'ceo';
  products: AdminInstituteOrderedProduct[];
  delivered: boolean;
}
export interface AdminSHGDataType {
  _id: string;
  name: string;
  contact: string;
  location: string;
  products: AdminSHGProduct[];
  createdAt: string;
  updatedAt: string;
  orders: AdminSHGOrder[];
}

export interface AdminDepartmentDataType {
  _id: string;
  department: string;
}
export interface AdminDataType {
  shgData: {
    shgDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    shgData: AdminSHGDataType[] | undefined;
  };
  orderData: {
    orderDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    orderData: AdminOrderDataType[];
  };
  departmentData: {
    departmentDataStatus: 'loading' | 'failed' | 'succeeded' | 'idle';
    departmentData: AdminDepartmentDataType[];
  };
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
  departmentData: {
    departmentData: [],
    departmentDataStatus: 'idle',
  },
};

export const fetchDepartments = createAsyncThunk(
  'adminData/fetchDepartments',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      if (token === undefined) throw new Error('Token error');
      const headers = new Headers();

      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/ceo/getdepartments',
        requestOptions
      );
      console.log(response);
      if (response.status === 400)
        throw new Error('Error while fetching all departments: admin');
      const result: { departmentdata: AdminDepartmentDataType[] } =
        await response.json();
      console.log(result);
      return result.departmentdata;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const fetchOrderByDepartmentId = createAsyncThunk(
  'adminData/fetchAllOrderData',
  async (
    { token, departmentId }: { token: string; departmentId: string },
    { rejectWithValue }
  ) => {
    try {
      if (token === undefined) throw new Error('Token error');
      const headers = new Headers();

      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/ceo/getordersbydepartment',
        requestOptions
      );
      console.log(response);
      if (response.status === 400)
        throw new Error('Error while fetching all orders: admin');
      const result: { totalOrders: number; orders: AdminOrderDataType[] } =
        await response.json();
      console.log(result);
      return result.orders;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const fetchAllShgData = createAsyncThunk(
  'adminData/fetchAllShgData',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      if (token === undefined) throw new Error('Token error');
      const headers = new Headers();

      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
      };
      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/getshgdata',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('Error occurred while fetching Shg Data');

      const result: { message: string; data: AdminSHGDataType[] } =
        await response.json();
      console.log(result);
      return result.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const adminDataSlice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {},
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
      .addCase(fetchOrderByDepartmentId.pending, (state) => {
        state.orderData.orderDataStatus = 'loading';
      })
      .addCase(fetchOrderByDepartmentId.fulfilled, (state, action) => {
        state.orderData.orderDataStatus = 'succeeded';
        state.orderData.orderData = action.payload;
      })
      .addCase(fetchOrderByDepartmentId.rejected, (state) => {
        state.orderData.orderDataStatus = 'failed';
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentData.departmentDataStatus = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departmentData.departmentDataStatus = 'succeeded';
        state.departmentData.departmentData = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state) => {
        state.departmentData.departmentDataStatus = 'failed';
      });
  },
});

export const selectAllDepartmentsByAdmin = (state: RootState) =>
  state.admin.departmentData.departmentData;
export const selectAllShgs = (state: RootState) => state.admin.shgData.shgData;
export const selectShgById = (state: RootState, id: string) =>
  state.admin.shgData.shgData?.find((shg) => shg._id === id);
export default adminDataSlice.reducer;
