import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface Order {
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
  itemdescription: string;
  itemname: string;
  itemprice: number;
  itemquantity: number;
  itemtype: 'loose' | 'packed';
  itemunit: string;
  status: 'pending' | 'approved' | 'cancelled';
}
interface OrderState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orders: Order[] | [];
}

interface Item {
  itemprice: number;
  itemdescription: string;
  itemunit: string;
  itemtype?: 'loose' | 'packed';
}
const initialState: OrderState = {
  status: 'idle',
  orders: [],
};

export const postOrderOfInstitute = createAsyncThunk(
  'orders/postOrderOfInstitute',
  async (
    { items, token }: { items: Item[]; token: string },
    { rejectWithValue }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'POST',
        redirect: 'follow',
        headers,
      };
      const response = await fetch('https://selfhelpgroup-backend.herokuapp.com/order/postorder', requestOptions);

      if (response.status === 400) throw new Error('An error occurred');
      const result = response.json();
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
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
