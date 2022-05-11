import { createSlice } from '@reduxjs/toolkit';

export interface IUtilityStateProps {
  shouldSnackbarOpen: boolean;
  snackbarMessage: string;
  snackbarType: 'success' | 'warning' | 'info' | 'error';
}

const initialState: IUtilityStateProps = {
  shouldSnackbarOpen: false,
  snackbarMessage: '',
  snackbarType: 'success',
};
const utilitySlice = createSlice({
  name: 'utility',
  initialState,
  reducers: {
    handleCloseSnackbar: (state) => {
      state.shouldSnackbarOpen = false;
    },
    handleOpenSnackbar: (
      state,
      action: {
        type: string;
        payload: {
          snackbarMessage: string;
          snackbarType: 'success' | 'warning' | 'info' | 'error';
        };
      }
    ) => {
      state.shouldSnackbarOpen = true;
      state.snackbarMessage = action.payload.snackbarMessage;
      state.snackbarType = action.payload.snackbarType;
    },
  },
});

export const { handleCloseSnackbar, handleOpenSnackbar } = utilitySlice.actions;
export default utilitySlice.reducer;
