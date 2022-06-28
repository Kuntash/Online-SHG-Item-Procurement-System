import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface User {
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'nocookie';
  userType?: 'ceo' | 'department' | 'institute';
  email: string | undefined;
  token: string | undefined;
  error?: string | undefined;
}
const initialState: User = {
  status: 'idle',
  email: undefined,
  token: undefined,
  error: '',
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
    headers.append(
      'Access-Control-Allow-Origin',
      'https://selfhelpgroup-backend.herokuapp.com'
    );
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
        'https://selfhelpgroup-backend.herokuapp.com/department/login',
        requestOptions
      );
      const result = await response.json();
      if (response.status === 400)
        return rejectWithValue({ message: result.error });
      return { email: email, userType: result.usertype, token: result.token };
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error?.message);
    }
  }
);
export const getjwt = createAsyncThunk(
  'auth/getjwt',
  async (token: string | undefined, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/jwt',
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if (response.status === 400) throw Error('An error occurred');
      const result = await response.json();
      return result;
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
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append(
        'Access-Control-Allow-Origin',
        'https://selfhelpgroup-backend.herokuapp.com'
      );

      const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow',
        credentials: 'include',
      };
      fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/logout',
        requestOptions
      );
      state.status = 'nocookie';
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
        console.log(action);
        state.status = 'failed';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.status = 'succeeded';
        state.userType = action.payload.userType;
        state.token = action.payload.token;
      })
      .addCase(getjwt.rejected, (state, action) => {
        state.status = 'nocookie';
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
