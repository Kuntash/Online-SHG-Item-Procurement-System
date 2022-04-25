import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import ViewOrders from './features/orders/ViewOrders';
import LandingPage from './components/landing-page';
function App() {
  return (
    <Box className="app">
      <Routes>
        {/* TODO: For root path, render the landing page and then embed login form inside of it */}
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        >
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
            element={<h1>Place Orders</h1>}
          />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
