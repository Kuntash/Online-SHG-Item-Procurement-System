import {
  Box,
  BoxProps,
  Paper,
  PaperProps,
  styled,
  TextField,
  TextFieldProps,
  ButtonProps,
  Button,
  Theme,
  CSSObject,
  ListItemButton,
  List,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

export const StyledPaper = styled(Paper)<PaperProps>(({ theme }) => ({
  boxShadow:
    'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
}));

export const StyledTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    minWidth: 100,
    width: 400,
    '& .MuiInputBase-root': {
      borderRadius: theme.spacing(1),
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '& .MuiFormControl-root': {
      color: theme.palette.secondary.main,
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.primary.main,
    },
  })
);

export const ContainerColumnBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));
export const ContainerRowBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

export const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: '0 8px 16px 0 rgb(255 48 48 / 24%)',

  '&:hover': {
    boxShadow: 'none',
  },
}));

// Side Drawer Styles
const drawerWidth = '18rem';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  borderRight: '1px dashed rgba(145, 158, 171, 0.24)',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(11)})`,
  },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  '& .MuiToolbar-root': {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  zIndex: theme.zIndex.drawer,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginLeft: drawerWidth,
  height: '60px',
  width: `calc(100% - ${drawerWidth})`,
  ...(open && {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

// Lists
export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&:focus': {
    '& .MuiTypography-root': {
      fontWeight: 500,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.redColor.main,
  },

  '& .MuiSvgIcon-root': {
    color: theme.palette.secondary.dark,
  },

  color: theme.palette.secondary.dark,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1 / 2),
}));

export const StyledList = styled(List)(({ theme }) => ({
  '& .MuiListSubheader-root': {
    textTransform: 'uppercase',
    color: theme.palette.blackColor.main,
    fontWeight: 700,
  },
  padding: theme.spacing(0, 2),
}));

// Styled container

export const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
}));

// Styled table

export const StyledTable = styled(Table)(({ theme }) => ({}));
export const StyledTableHead = styled(TableHead)(({ theme }) => ({}));
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  '&:first-of-type': {
    paddingLeft: theme.spacing(3),
    borderTopLeftRadius: theme.spacing(1),
    borderBottomLeftRadius: theme.spacing(1),
  },
  '&:last-of-type': {
    borderTopRightRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    paddingRight: theme.spacing(3),
  },
}));
export const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: theme.spacing(2),
  color: theme.palette.greyColor.dark,
  backgroundColor: theme.palette.greyColor.light,
}));

// Status Display

export const StyledStatus = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: theme.spacing(3),
  display: 'inline-flex',
  justifyContent: 'center',
  minWidth: theme.spacing(3),
  borderRadius: theme.spacing(1),
  alignItems: 'center',
  fontSize: '0.75rem',
}));
