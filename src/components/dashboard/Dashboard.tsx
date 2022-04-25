import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
  NotificationsRounded,
} from '@mui/icons-material';
import { Box, IconButton, Slide, useScrollTrigger } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  ContainerColumnBox,
  ContainerRowBox,
  Drawer,
  DrawerHeader,
} from '../custom';
import OrderSideMenu from './OrderSideMenu';

const HideOnScroll = (props: { children: JSX.Element }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
    >
      {props.children}
    </Slide>
  );
};
const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const handleDrawerState = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <HideOnScroll>
        <AppBar
          position="fixed"
          open={drawerOpen}
        >
          <ContainerRowBox
            sx={{
              justifyContent: 'flex-end',
              paddngLeft: '40px',
              paddingRight: '40px',
            }}
          >
            <IconButton color="secondary">
              <NotificationsRounded sx={{ color: 'greyColor.main' }} />
            </IconButton>
          </ContainerRowBox>
        </AppBar>
      </HideOnScroll>

      <Drawer
        variant="permanent"
        open={drawerOpen}
      >
        <DrawerHeader>
          <IconButton
            aria-label="keyboard double arrow left rounded"
            color="secondary"
            onClick={handleDrawerState}
          >
            {drawerOpen ? (
              <KeyboardDoubleArrowLeftRounded color="primary" />
            ) : (
              <KeyboardDoubleArrowRightRounded color="primary" />
            )}
          </IconButton>
        </DrawerHeader>

        <ContainerColumnBox>
          <OrderSideMenu drawerOpen={drawerOpen} />
        </ContainerColumnBox>
      </Drawer>
      <ContainerColumnBox sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <DrawerHeader />
        <Outlet />
      </ContainerColumnBox>
    </Box>
  );
};

export default Dashboard;
