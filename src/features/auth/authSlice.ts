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
    headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow',
      credentials: 'include',
    };

    try {
      const response = await fetch(
        'http://localhost:5000/department/login',
        requestOptions
      );
      if (response.status === 400) throw Error('An error occurred');
      const result = await response.json();
      console.log(result);
      return { email: email, userType: result.usertype, token: result.token };
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);
export const getjwt = createAsyncThunk('auth/getjwt', async () => {
  try {
    const response = await fetch('http://localhost:5000/department/jwt', {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status === 400) throw Error('An error occurred');
    const result = await response.json();
    return result;
  } catch (error: any) {
    // return rejectWithValue(error?.message);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.status = 'idle';
      state.email = undefined;
      state.token = undefined;
      state.userType = undefined;
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');

      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
        credentials: 'include',
      };
      fetch('http://localhost:5000/department/logout', requestOptions);
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
      })
      .addCase(getjwt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.email = action.payload.email;
        state.userType = action.payload.userType;
        state.token = action.payload.token;
      });
  },
});
export const { logout } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth;
export default authSlice.reducer;
