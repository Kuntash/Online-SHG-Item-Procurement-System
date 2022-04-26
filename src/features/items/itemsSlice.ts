import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
export interface Item {
  _id: string;
  itemtype: 'loose' | 'packed';
  itemname: string;
  itemdescription: string;
  itemunit?: string;
}

export interface PlaceOrderItem extends Item {
  itemquantity: number;
}
export interface ItemsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  items: Item[];
}
const initialState: ItemsState = {
  status: 'idle',
  items: [
    {
      _id: '1',
      itemtype: 'loose',
      itemname: 'टमाटर',
      itemdescription: 'टमाटर',
      itemunit: 'kg',
    },
    {
      _id: '2',
      itemtype: 'packed',
      itemname: 'नमक',
      itemdescription: 'नमक',
    },
  ],
};

export const fetchAllItems = createAsyncThunk(
  'items/fetchAllItems',
  async (_: void, { rejectWithValue }) => {
    try {
      // TODO: Add Bearer token to the api
      // const headers = new Headers();
      // headers.append('Authorization', `Bearer ${token}`);
      const requestOptions: RequestInit = {
        method: 'GET',
        // headers,
        redirect: 'follow',
      };
      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/order/getallitems',
        requestOptions
      );
      if (response.status === 400) throw new Error('An error occurred');
      const result = response.json();
      console.log(result);
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'items/placeOrder',
  async (
    {
      addedItemsList,
      userToken,
    }: {
      addedItemsList: PlaceOrderItem[];
      userToken: string | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${userToken}`);
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
      };

      const response = await fetch(
        'localhost:5000/order/postorder',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('An error occured while posting orders');
      const result = response.json();
      console.log(result);
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(fetchAllItems.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllItems.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(placeOrder.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export const selectAllItems = (state: RootState) => state.items.items;
export default itemsSlice.reducer;
