import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { RootState } from '../../app/store';

interface Order {
  orderId: string;
  orderDate: string;
  orderStatus: 'pending' | 'ordered' | 'cancelled';
}
interface OrderState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orders: Order[] | [];
}
const initialState: OrderState = {
  status: 'idle',
  orders: [],
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await new Promise<Order[] | []>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          orderId: '1',
          orderDate: sub(new Date(), {
            days: 3,
            hours: 5,
            minutes: 6,
          }).toISOString(),
          orderStatus: 'pending',
        },
        {
          orderId: '2',
          orderDate: sub(new Date(), {
            days: 1,
            hours: 3,
            minutes: 10,
          }).toISOString(),
          orderStatus: 'ordered',
        },
        {
          orderId: '3',
          orderDate: sub(new Date(), {
            minutes: 10,
          }).toISOString(),
          orderStatus: 'cancelled',
        },
        {
          orderId: '4',
          orderDate: new Date().toISOString(),
          orderStatus: 'ordered',
        },
      ] as Order[]);
    }, 1000);
  });
  return response;
  // let order: Order[] = [
  //   {
  //     orderId: '4',
  //     orderDate: sub(new Date(), { minutes: 1 }).toISOString(),
  //     orderStatus: 'cancelled',
  //   },
  // ];
  // return order;
});
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchOrders.fulfilled,
        (state: OrderState, { payload }: PayloadAction<Order[] | []>) => {
          state.status = 'succeeded';
          state.orders = payload;
        }
      )
      .addCase(fetchOrders.pending, (state: OrderState) => {
        state.status = 'loading';
      });
  },
});

export const selectAllOrders = (state: RootState): Order[] =>
  state.orders.orders;
export const selectOrderById = (state: RootState, orderId: string) =>
  state.orders.orders.find((order) => order.orderId === orderId);
export default ordersSlice.reducer;
