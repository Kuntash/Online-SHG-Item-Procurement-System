import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Order {
  _id: string;
  approvedfordisplay: boolean;
  bid: [];
  createdAt: string;
  department:
    | 'education'
    | 'healthcare'
    | 'tribal welfare'
    | 'social welfare'
    | 'women and child development'
    | 'ceo';
  departmentid: string;
  instituteid: string;
  institutelocation: string;
  institutename: string;
  items: {
    itemname: string;
    itemquantity: number;
    itemunit: string;
    itemprice: string;
    itemid: string;
    itemtype: 'loose' | 'packed';
    itemdescription: string;
  }[];

  status: 'pending' | 'approved' | 'cancelled' | 'completed';
}
interface OrderState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orders: Order[] | [];
}

const initialState: OrderState = {
  status: 'idle',
  orders: [],
};

export const fetchAllOrdersOfInstitute = createAsyncThunk(
  'orders/fetchAllOrdersOfInstitute',
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

const ordersSlice = createSlice({
  name: 'orders',
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
      });
  },
});

export const selectAllOrders = (state: RootState): Order[] =>
  state.orders.orders;

export const selectOrderById = (state: RootState, orderId: string) =>
  state.orders.orders.find((order: Order) => order._id === orderId);
export default ordersSlice.reducer;
