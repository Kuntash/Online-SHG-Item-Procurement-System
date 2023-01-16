import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
  NotificationsRounded,
} from '@mui/icons-material';
import { Box, IconButton, Slide, Typography, useScrollTrigger } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/authSlice';
import {
  AppBar,
  ContainerColumnBox,
  ContainerRowBox,
  Drawer,
  DrawerHeader,
} from '../custom';
import DepartmentSideMenu from './DepartmentSideMenu';
import InstituteSideMenu from './InstituteSideMenu';
import CeoSideMenu from '../../features/adminData/AdminSideMenu';
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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  let sideMenu;

  if (user.status === 'succeeded') {
    if (user.userType === 'department')
      sideMenu = <DepartmentSideMenu drawerOpen={drawerOpen} />;
    if (user.userType === 'institute')
      sideMenu = <InstituteSideMenu drawerOpen={drawerOpen} />;
    if (user.userType === 'ceo')
      sideMenu = <CeoSideMenu drawerOpen={drawerOpen} />;
  }

  useEffect(() => {
    if (
      user.status === 'idle' ||
      user.status === 'failed' ||
      user.status === 'nocookie'
    ) {
      navigate('/');
    }
  }, [user.status, navigate]);
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
              width: '100%',
              justifyContent: 'space-between',
              display: 'flex',
              paddngLeft: '40px',
              paddingRight: '40px',
            }}
          >
            <ContainerColumnBox sx={{paddingLeft:'40px'}}>
              {user.email?<Typography color='black' sx={{textTransform:'capitalize'}}>{user.email}</Typography>:""}
              {user.department?<Typography color='gray' sx={{textTransform:'capitalize'}}>{user.department} Department</Typography>:""}
            </ContainerColumnBox>
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

        <ContainerColumnBox>{sideMenu}</ContainerColumnBox>
      </Drawer>
      <ContainerColumnBox sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <DrawerHeader />
        <Outlet />
      </ContainerColumnBox>
    </Box>
  );
};

export default Dashboard;
