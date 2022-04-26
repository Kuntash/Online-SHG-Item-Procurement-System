import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface User {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  userType?: 'ceo' | 'department' | 'institute';
  email: string | undefined;
  token: string | undefined;
  error?: string;
}
const initialState: User = {
  status: 'idle',
  email: undefined,
  token: undefined,
};
interface LoginParameter {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginParameter, { rejectWithValue }) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/login',
        requestOptions
      );
      if (response.status === 400) throw Error('An error occurred');
      const result = await response.json();
      return { email: email, userType: result.usertype, token: result.token };
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.status = 'idle';
      state.email = undefined;
      state.token = undefined;
      state.userType = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.status = 'succeeded';
        state.userType = action.payload.userType;
        state.token = action.payload.token;
      });
  },
});
export const { logout } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth;
export default authSlice.reducer;
