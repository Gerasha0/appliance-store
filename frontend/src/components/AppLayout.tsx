import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Devices,
  ShoppingCart,
  Business,
  People,
  PersonOutline,
  Language,
  Brightness4,
  Brightness7,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector, logout, toggleTheme, setLocale, toggleSidebar, toggleCart, selectCartItemsCount } from '@/store';
import { UserRole } from '@/types/models';
import { CartDrawer } from './CartDrawer';
import { useI18nSync } from '@/i18n/useI18nSync';

const drawerWidth = 240;

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t, i18n } = useTranslation();
  useI18nSync(); // Sync language with Redux store
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { role, email } = useAppSelector(state => state.auth);
  const { theme, locale, sidebarOpen } = useAppSelector(state => state.ui);
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = async (lang: 'en' | 'uk') => {
    await i18n.changeLanguage(lang);
    dispatch(setLocale(lang));
    handleLanguageClose();
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileNavigate = () => {
    navigate('/profile');
    handleProfileClose();
  };

  const menuItems = [
    {
      text: t('menu.dashboard'),
      icon: <Dashboard />,
      path: '/dashboard',
      roles: [UserRole.EMPLOYEE, UserRole.CLIENT]
    },
    {
      text: t('menu.appliances'),
      icon: <Devices />,
      path: '/appliances',
      roles: [UserRole.EMPLOYEE, UserRole.CLIENT]
    },
    {
      text: t('menu.orders'),
      icon: <ShoppingCart />,
      path: '/orders',
      roles: [UserRole.EMPLOYEE, UserRole.CLIENT]
    },
    {
      text: t('menu.manufacturers'),
      icon: <Business />,
      path: '/manufacturers',
      roles: [UserRole.EMPLOYEE]
    },
    {
      text: t('menu.employees'),
      icon: <People />,
      path: '/employees',
      roles: [UserRole.EMPLOYEE]
    },
    {
      text: t('menu.clients'),
      icon: <PersonOutline />,
      path: '/clients',
      roles: [UserRole.EMPLOYEE]
    },
  ];

  const visibleMenuItems = menuItems.filter(item => role && item.roles.includes(role));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => dispatch(toggleSidebar())}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>

          {/* Language Selector */}
          <IconButton
            color="inherit"
            onClick={handleLanguageClick}
            sx={{ mr: 1 }}
          >
            <Language />
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleLanguageClose}
          >
            <MenuItem
              onClick={() => handleLanguageChange('en')}
              selected={locale === 'en'}
            >
              🇬🇧 English
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange('uk')}
              selected={locale === 'uk'}
            >
              🇺🇦 Українська
            </MenuItem>
          </Menu>

          {/* Theme Toggle */}
          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            sx={{ mr: 1 }}
          >
            {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Cart Button - Only for clients */}
          {role === UserRole.CLIENT && (
            <IconButton
              color="inherit"
              onClick={() => dispatch(toggleCart())}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cartItemsCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}

          {/* Profile Menu */}
          <IconButton
            color="inherit"
            onClick={handleProfileClick}
            sx={{ mr: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                {t('profile.role')}: {role}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileNavigate}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              {t('menu.profile')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              {t('auth.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer (Sidebar) */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {visibleMenuItems.map(item => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname.startsWith(item.path)}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: sidebarOpen ? 0 : `-${drawerWidth}px`,
          transition: theme =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          minHeight: '100vh',
          backgroundImage: theme === 'dark'
            ? 'url(/dark_theme.png)'
            : 'url(/light_theme.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>

      {/* Cart Drawer */}
      <CartDrawer />
    </Box>
  );
};

export default AppLayout;
