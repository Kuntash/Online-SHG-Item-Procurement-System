import { Alert, Box, Snackbar } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import ViewOrders from './features/instituteOrders/InstituteOrders';
import LandingPage from './components/landing-page';
import PlaceOrder from './features/instituteItems/PlaceOrder';
import DepartmentOrders from './features/departmentOrders/DepartmentOrders';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { RootState } from './app/store';
import { handleCloseSnackbar } from './features/utilityStates/utilitySlice';
import AdminAllShg from './features/adminData/AdminAllShg';
import AdminAllOrders from './features/adminData/AdminAllOrders';
import AdminAllInstitutes from './features/adminData/AdminAllInstitutes';
import AdminOrderDetails from './features/adminData/AdminOrderDetails';
import AdminSingleBid from './features/adminData/AdminSingleBid';
import AdminShgDetails from './features/adminData/AdminShgDetails';
import RegisterShg from './components/admin/RegisterSHG';
function App() {
  const snackbarInfo = useAppSelector((state: RootState) => state.utility);
  const dispatch = useAppDispatch();
  return (
    <Box className="app">
      <Routes>
        {/* TODO: For root path, render the landing page and then embed login form inside of it */}
        
        <Route path="/" />
        <Route
          index
          element={<LandingPage />}
        />
        <Route
          path="dashboard"
          element={<Dashboard />}
        >
          <Route path="institute">
            <Route
              path="home"
              element={<h1>Home</h1>}
            />
            <Route
              path="all-orders"
              element={<ViewOrders />}
            />
            <Route
              path="place-order"
              element={<PlaceOrder />}
            />
          </Route>
          <Route path="department">
            <Route
              path="home"
              element={<h1> Department home</h1>}
            />
            <Route
              path="approve-orders"
              element={<DepartmentOrders />}
            />
            <Route
              path="biddings"
              element={<h1>Biddings</h1>}
            />
          </Route>
          <Route path="admin">
        <Route path="registershg" element={<RegisterShg />} />
            <Route path="view-all-shgs">
              <Route
                index
                element={<AdminAllShg />}
              />
              <Route
                path=":shgId"
                element={<AdminShgDetails />}
              />
            </Route>
            <Route path="bids">
              <Route
                path=":bidId"
                element={<AdminSingleBid />}
              />
            </Route>
            <Route path="view-all-orders">
              <Route
                index
                element={<AdminAllOrders />}
              />
              <Route path=":orderId">
                <Route
                  index
                  element={<AdminOrderDetails />}
                />
              </Route>
            </Route>
            <Route path="view-all-institutes">
              <Route
                index
                element={<AdminAllInstitutes />}
              />
              <Route
                path=":instituteId"
                element={<h1>Individual Institute</h1>}
              />
            </Route>
            {/* NOTE: The department routes are not needed as of now */}
            {/* <Route path="department">
              <Route
                path=":id"
                element={<h1>Department</h1>}
              ></Route>
            </Route> */}
            {/* SHG List */}
            {/* Shg Individual profile */}
          </Route>
        </Route>
      </Routes>
      <Snackbar
        onClose={() => {
          dispatch(handleCloseSnackbar());
        }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={snackbarInfo.shouldSnackbarOpen}
        autoHideDuration={3000}
      >
        <Alert
          onClose={() => {
            dispatch(handleCloseSnackbar());
          }}
          variant="filled"
          severity={snackbarInfo.snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarInfo.snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
