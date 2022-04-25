import { Box } from '@mui/material';
import React from 'react';
import LoginForm from '../../features/auth/LoginForm';

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LandingPage;
