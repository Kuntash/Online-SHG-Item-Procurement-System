import { AddTaskRounded, LogoutRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { resetOnLogout } from '../../features/departmentOrders/departmentOrdersSlice';
import { StyledList, StyledListItemButton } from '../custom';

interface DepartmentSideMenuType {
  title: string;
  route: string;
  icon: JSX.Element;
}

interface RenderListItem {
  (title: string, route: string, icon: JSX.Element, index: number): JSX.Element;
}
const DepartmentSideMenu = ({ drawerOpen }: { drawerOpen: boolean }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [listItemSelectedIndex, setListItemSelectedIndex] = useState<number>(0);
  const departmentSideMenu: DepartmentSideMenuType[] = [
    {
      title: 'Approve orders',
      route: 'approve-orders',
      icon: <AddTaskRounded />,
    },
  ];
  const handleRedirect = (route: string): void => {
    navigate(`department/${route}`);
  };

  useEffect(() => {
    // Focus on View all orders on initial render
    (listRef.current?.children[1] as HTMLElement)?.focus();
  }, []);
  const renderListItem: RenderListItem = (title, route, icon, index) => {
    return (
      <StyledListItemButton
        key={index}
        selected={listItemSelectedIndex === index}
        onClick={() => {
          setListItemSelectedIndex(index);
          handleRedirect(route);
        }}
      >
        <ListItemIcon
        // sx={{ justifyContent: drawerOpen ? 'flex-start' : 'center' }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          color="secondary"
          primary={title}
          sx={{
            opacity: drawerOpen ? 1 : 0,
            display: drawerOpen ? 'block' : 'none',
          }}
        />
      </StyledListItemButton>
  );
  };
  return (
    <StyledList
      ref={listRef}
      subheader={
        drawerOpen ? <ListSubheader component="li">Menu</ListSubheader> : null
      }
    >
      {departmentSideMenu.map((menuItem, index) =>
        renderListItem(menuItem.title, menuItem.route, menuItem.icon, index)
      )}
      <StyledListItemButton
        key={'logout'}
        onClick={() => {
          dispatch(logout());
          dispatch(resetOnLogout());
          navigate('/');
        }}
      >
        <ListItemIcon>{<LogoutRounded />}</ListItemIcon>
        <ListItemText
          color="secondary"
          primary="Logout"
          sx={{ opacity: drawerOpen ? 1 : 0 }}
        />
      </StyledListItemButton>
    </StyledList>
  );
};

export default DepartmentSideMenu;
