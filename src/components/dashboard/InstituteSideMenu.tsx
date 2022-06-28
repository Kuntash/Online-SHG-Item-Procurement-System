import {
  AddShoppingCartRounded,
  LogoutRounded,
  TableViewRounded,
} from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { StyledList, StyledListItemButton } from '../custom';

interface InstituteSideMenuType {
  title: string;
  route: string;
  icon: JSX.Element;
}

interface RenderListItem {
  (title: string, route: string, icon: JSX.Element, index: number): JSX.Element;
}

const InstituteSideMenu = ({ drawerOpen }: { drawerOpen: boolean }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [listItemSelectedIndex, setListItemSelectedIndex] = useState<number>(0);
  const instituteSideMenu: InstituteSideMenuType[] = [
    {
      title: 'View all orders',
      route: 'all-orders',
      icon: <TableViewRounded />,
    },
    {
      title: 'Place order',
      route: 'place-order',
      icon: <AddShoppingCartRounded />,
    },
    {
      title: 'Change Password',
      route: 'change-password',
      icon: <KeyIcon />,
    },
  ];
  const handleRedirect = (route: string): void => {
    navigate(`institute/${route}`);
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
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          color="secondary"
          primary={title}
          sx={{ opacity: drawerOpen ? 1 : 0 }}
        />
      </StyledListItemButton>
    );
  };
  return (
    <StyledList
      ref={listRef}
      subheader={
        drawerOpen ? <ListSubheader component="li">Orders</ListSubheader> : null
      }
    >
      {instituteSideMenu.map((menuItem, index) =>
        renderListItem(menuItem.title, menuItem.route, menuItem.icon, index)
      )}
      <StyledListItemButton
        key={'logout'}
        onClick={() => {
          dispatch(logout());
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

export default InstituteSideMenu;
