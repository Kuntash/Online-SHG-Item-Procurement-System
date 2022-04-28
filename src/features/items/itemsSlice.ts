import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
export interface Item {
  _id: string;
  itemtype: 'loose' | 'packed';
  itemprice: number;
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
  items: [],
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
      token,
    }: {
      addedItemsList: PlaceOrderItem[];
      token: string | undefined;
    },
    { rejectWithValue }
  ) => {
    const formattedAddedItemsList = addedItemsList.map((addedItem, index) => ({
      itemid: addedItem._id,
      itemquantity: addedItem.itemquantity,
    }));

    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify(formattedAddedItemsList);
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/order/postorder',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('An error occured while posting orders');
      const result = await response.json();
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
