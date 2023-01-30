import {
  AddShoppingCartRounded,
  LogoutRounded,
  TableViewRounded,
  PersonAddRounded,
  SummarizeRounded,
  HomeMaxRounded,
} from '@mui/icons-material';
import KeyIcon from '@mui/icons-material/Key';
import { ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../auth/authSlice';
import { StyledList, StyledListItemButton } from '../../components/custom';
import { resetOnLogout } from './adminDataSlice';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
interface CeoSideMenuType {
  title: string;
  route: string;
  icon: JSX.Element;
}

interface RenderListItem {
  (title: string, route: string, icon: JSX.Element, index: number): JSX.Element;
}

const CeoSideMenu = ({ drawerOpen }: { drawerOpen: boolean }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [listItemSelectedIndex, setListItemSelectedIndex] = useState<number>(0);
  const ceoSideMenu: CeoSideMenuType[] = [
    {
      title: 'Home',
      route: 'home',
      icon: <HomeMaxRounded />,
    },
    {
      title: 'View all shgs',
      route: 'view-all-shgs',
      icon: <TableViewRounded />,
    },
    {
      title: 'View all orders',
      route: 'view-all-orders',
      icon: <AddShoppingCartRounded />,
    },
    {
      title: 'Generate Report',
      route: 'generate-report',
      icon: <SummarizeRounded />,
    },
    {
      title: 'Change Password',
      route: 'change-password',
      icon: <KeyIcon />,
    },
    {
      title: 'Register SHG',
      route: 'registershg',
      icon: <PersonAddRounded />,
    },
    {
      title: 'Add Location',
      route: 'addlocation',
      icon: <AddLocationAltIcon />,
    },
    {
      title: 'New Announcement',
      route: 'newannouncement',
      icon: <CampaignIcon />,
    },
    {
      title: 'Add Item',
      route: 'additem',
      icon: <AddIcon />,
    },
    {
      title: 'Add Admin',
      route: 'addadmin',
      icon: <SupervisorAccountIcon />,
    },
    {
      title: 'Add Block Admin',
      route: 'addblockadmin',
      icon: <AccountBalanceIcon />,
    },
    // {
    //   title: 'View all institutes',
    //   route: 'view-all-institutes',
    //   icon: <SchoolRounded />,
    // },
  ];
  const handleRedirect = (route: string): void => {
    navigate(`admin/${route}`);
  };

  useEffect(() => {
    handleRedirect('home');
    // Focus on View all orders on initial render
    (listRef.current?.children[0] as HTMLElement)?.focus();
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
          sx={{
            opacity: drawerOpen ? 1 : 0,
            display: drawerOpen ? 'block' : 'none',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
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
      {ceoSideMenu.map((menuItem, index) =>
        renderListItem(menuItem.title, menuItem.route, menuItem.icon, index)
      )}
      <StyledListItemButton
        key={'logout'}
        onClick={() => {
          dispatch(resetOnLogout());
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

export default CeoSideMenu;
