import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface User {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  userType?: 'ceo' | 'department';
  email: string | undefined;
  token: string | undefined;
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
  'user/login',
  async ({ email, password }: LoginParameter) => {
    const response = await fetch('', {
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    console.log(response);
    return response;
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export default authSlice.reducer;
