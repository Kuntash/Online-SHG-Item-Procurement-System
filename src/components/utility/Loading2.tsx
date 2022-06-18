import React from 'react';
import { Box, styled } from '@mui/system';
import { CircularProgress } from '@mui/material';

const StyledLoading = styled('div')(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Loading2 = () => {
  return (
    <StyledLoading>
      <Box position="relative">
        <CircularProgress className="circleProgress" />
      </Box>
    </StyledLoading>
  );
};

export default Loading2;
