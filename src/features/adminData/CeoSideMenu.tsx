import { LogoutRounded, TableViewRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../auth/authSlice';
import { StyledList, StyledListItemButton } from '../../components/custom';
import { RootState } from '../../app/store';
import {
  fetchDepartments,
  selectAllDepartmentsByAdmin,
} from './adminDataSlice';

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
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const departmentDataStatus = useAppSelector(
    (state: RootState) => state.admin.departmentData.departmentDataStatus
  );
  const departmentList = useAppSelector(selectAllDepartmentsByAdmin);
  const [listItemSelectedIndex, setListItemSelectedIndex] = useState<number>(0);
  const [ceoSideMenu, setCeoSideMenu] = useState<CeoSideMenuType[]>([]);

  const handleRedirect = (route: string): void => {
    console.log(route);
    if (route === 'view-all-shgs') navigate(`admin/${route}`);
    else navigate(`admin/department/${route}`);
  };

  if (departmentDataStatus === 'idle') dispatch(fetchDepartments(userToken));

  useEffect(() => {
    if (departmentDataStatus === 'failed') navigate('/');
    if (departmentDataStatus === 'succeeded')
      setCeoSideMenu([
        {
          title: 'View all shgs',
          route: 'view-all-shgs',
          icon: <TableViewRounded />,
        },
        ...departmentList.map((department, index) => ({
          title: department.department,
          route: department._id,
          icon: <TableViewRounded />,
        })),
      ]);
  }, [departmentDataStatus, navigate, departmentList]);
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
          dispatch(logout());
          handleRedirect('/');
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
