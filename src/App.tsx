import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import ViewOrders from './features/orders/ViewOrders';
import LandingPage from './components/landing-page';
import PlaceOrder from './features/items/PlaceOrder';
import Home from './components/Home/Home';
function App() {
  return (
    <Box className="app">
      <Routes>
        {/* TODO: For root path, render the landing page and then embed login form inside of it */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<LandingPage />}
        />
        <Route
          path="/dashboard"
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
            ></Route>
          </Route>
          <Route path="ceo">
            <Route
              path="home"
              element={<h1> CEO home</h1>}
            ></Route>
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
