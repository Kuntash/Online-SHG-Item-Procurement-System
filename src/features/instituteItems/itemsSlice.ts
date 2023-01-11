import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Item, PlaceOrderItem } from '../../types/custom';

import { backendUrl } from '../../config';

export interface ItemsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  submitOrderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  saveOrderStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  savedOrders?: IItemList[];
  items: Item[];
}

export interface ISHG{
  id:string;
  name:string;
  quantity:number;
  location:string;
  productid:string;
  selectedquantity:number;
  price:number;
}

export interface IItemList {
itemname: string;
itemid: string;
itemunit?: string;
totalquantity: number;
totalPrices: number;
itemType: string;
itemDescription: string;
products: ISHG[];
}

const initialState: ItemsState = {
  status: 'idle',
  submitOrderStatus: 'idle',
  saveOrderStatus: 'idle',
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
        backendUrl+'order/getallitems',
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

export const modifyOrder = createAsyncThunk(
  'items/modifyOrder',
  async (
    {
      addedItemsList,
      token,
      orderId,
    }: {
      addedItemsList: PlaceOrderItem[];
      token: string | undefined;
      orderId: string;
    },
    { rejectWithValue }
  ) => {
    const formattedAddedItemsList = addedItemsList.map((addedItem, index) => ({
      itemid: addedItem._id,
      itemquantity: addedItem.itemquantity,
      itemname: addedItem.itemname,
    }));
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify(formattedAddedItemsList);
      const requestOptions: RequestInit = {
        method: 'PUT',
        headers,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        `${backendUrl}order/modifyorder/${orderId}`,
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
export const saveOrder = createAsyncThunk(
  'items/saveOrder',
  async (
    {
      addedItemsList,
      token,
    }: {
      addedItemsList: IItemList[];
      token: string | undefined;
    },
    { rejectWithValue }
  ) => {
    console.log(addedItemsList);
    const formattedAddedItemsList = addedItemsList.map((addedItem, index) => (addedItem.products.map(product=>({
      productid:product.productid,
      itemquantity:product.selectedquantity,
    })))).flat();
    console.log(formattedAddedItemsList)
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify(formattedAddedItemsList);
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        backendUrl+'institute/saveorder',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('An error occured while posting orders');
      const result = await response.json();
      console.log(result);
      return result;
    } catch (err) {
      rejectWithValue(err)
    }
  }
);
export const submitOrder = createAsyncThunk(
  'items/submitOrder',
  async (
    {
      addedItemsList,
      token,
    }: {
      addedItemsList: IItemList[];
      token: string | undefined;
    },
    { rejectWithValue }
  ) => {
    const formattedAddedItemsList = addedItemsList.map((addedItem, index) => (addedItem.products.map(product=>({
      productid:product.productid,
      itemquantity:product.selectedquantity,
    })))).flat();
    console.log(formattedAddedItemsList)
    try {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      headers.append('Content-type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      const raw = JSON.stringify(formattedAddedItemsList);
      const requestOptions: RequestInit = {
        method: 'POST',
        headers,
        redirect: 'follow',
        body: raw,
      };

      const response = await fetch(
        backendUrl+'order/postorder',
        requestOptions
      );
      if (response.status === 400)
        throw new Error('An error occured while posting orders');
      const result = await response.json();
      console.log(result);
      return result;
    } catch (err) {
      rejectWithValue(err)
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    resetStatus(state: ItemsState) {
      state.saveOrderStatus = 'idle';
      state.submitOrderStatus = 'idle';
    },
  },

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
      .addCase(submitOrder.pending, (state, action) => {
        state.submitOrderStatus = 'loading';
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.submitOrderStatus = 'succeeded';
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.submitOrderStatus = 'failed';
      })
      .addCase(saveOrder.pending, (state, action) => {
        state.saveOrderStatus = 'loading';
      })
      .addCase(saveOrder.fulfilled, (state, action) => {
        state.saveOrderStatus = 'succeeded';
      })
      .addCase(saveOrder.rejected, (state, action) => {
        state.saveOrderStatus = 'failed';
      })
      .addCase(modifyOrder.pending, (state, action) => {
        state.submitOrderStatus = 'loading';
      })
      .addCase(modifyOrder.fulfilled, (state, action) => {
        state.submitOrderStatus = 'succeeded';
      })
      .addCase(modifyOrder.rejected, (state, action) => {
        state.submitOrderStatus = 'failed';
      });
  },
});
export const { resetStatus } = itemsSlice.actions;
export const selectAllItems = (state: RootState) => state.items.items;
export default itemsSlice.reducer;
