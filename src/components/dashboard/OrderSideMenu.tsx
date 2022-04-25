import { AddShoppingCartRounded, TableViewRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledList, StyledListItemButton } from '../custom';

interface OrderSideMenuType {
  title: string;
  route: string;
  icon: JSX.Element;
}
const orderSideMenu: OrderSideMenuType[] = [
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
];

interface RenderListItem {
  (title: string, route: string, icon: JSX.Element, index: number): JSX.Element;
}

const OrderSideMenu = ({ drawerOpen }: { drawerOpen: boolean }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const handleRedirect = (route: string): void => {
    navigate(route);
  };

  useEffect(() => {
    // Focus on View all orders on initial render
    (listRef.current?.children[1] as HTMLElement)?.focus();
  }, []);
  const renderListItem: RenderListItem = (title, route, icon, index) => {
    return (
      <StyledListItemButton
        key={index}
        onClick={() => {
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
      {orderSideMenu.map((orderItem, index) =>
        renderListItem(orderItem.title, orderItem.route, orderItem.icon, index)
      )}
    </StyledList>
  );
};

export default OrderSideMenu;
