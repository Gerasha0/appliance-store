import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  Devices as DevicesIcon,
  People as PeopleIcon,
  PersonOutline as PersonOutlineIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllAppliancesQuery,
  useGetAllOrdersQuery,
  useGetOrdersByClientQuery,
  useGetAllClientsQuery,
  useGetAllEmployeesQuery,
} from '@/store/api/apiSlice';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ApplianceCard } from '@/components/appliances';
import { useAppSelector } from '@/store';
import { UserRole, Category } from '@/types/models';
import type { Orders, Appliance } from '@/types/models';

// Employee Dashboard Component
const EmployeeDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch data
  const { data: appliancesData, isLoading: appliancesLoading } = useGetAllAppliancesQuery({
    page: 0,
    size: 10,
  });
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery({ page: 0, size: 100 });
  const { data: clientsData, isLoading: clientsLoading } = useGetAllClientsQuery({ page: 0, size: 1000 });
  const { data: employeesData, isLoading: employeesLoading } = useGetAllEmployeesQuery({ page: 0, size: 1000 });

  const isLoading =
    appliancesLoading || ordersLoading || clientsLoading || employeesLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalAppliances = appliancesData?.totalElements || 0;
  const totalOrders = ordersData?.totalElements || 0;
  const totalClients = clientsData?.totalElements || 0;
  const totalEmployees = employeesData?.totalElements || 0;
  const recentOrders = ordersData?.content?.slice(0, 5) || [];
  const pendingOrders = ordersData?.content?.filter((order: Orders) => !order.approved).length || 0;
  const approvedOrders = ordersData?.content?.filter((order: Orders) => order.approved).length || 0;

  // Statistics cards configuration for Employee
  const statsCards = [
    {
      title: t('dashboard.totalAppliances'),
      value: totalAppliances,
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: t('dashboard.totalOrders'),
      value: totalOrders,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: t('dashboard.totalClients'),
      value: totalClients,
      icon: <PersonOutlineIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: t('dashboard.totalEmployees'),
      value: totalEmployees,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  // Quick actions for Employee
  const quickActions = [
    {
      title: t('appliance.addAppliance'),
      icon: <AddIcon />,
      onClick: () => navigate('/appliances'),
      color: 'primary' as const,
    },
    {
      title: t('order.addOrder'),
      icon: <AddIcon />,
      onClick: () => navigate('/orders'),
      color: 'success' as const,
    },
    {
      title: t('client.addClient'),
      icon: <AddIcon />,
      onClick: () => navigate('/clients'),
      color: 'warning' as const,
    },
    {
      title: t('employee.addEmployee'),
      icon: <AddIcon />,
      onClick: () => navigate('/employees'),
      color: 'secondary' as const,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard.overview')}
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
        {statsCards.map((card) => (
          <Box key={card.title} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                  <TrendingUpIcon sx={{ color: 'success.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.quickActions')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {quickActions.map((action) => (
            <Box key={action.title} sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Button
                variant="outlined"
                color={action.color}
                fullWidth
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{ py: 1.5 }}
              >
                {action.title}
              </Button>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Recent Orders Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('dashboard.recentOrders')}
          </Typography>
          <Button
            variant="text"
            endIcon={<ViewIcon />}
            onClick={() => navigate('/orders')}
          >
            {t('dashboard.viewAll')}
          </Button>
        </Box>

        {recentOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {t('order.noOrders')}
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('order.orderNumber')}</TableCell>
                  <TableCell>{t('order.client')}</TableCell>
                  <TableCell>{t('order.items')}</TableCell>
                  <TableCell>{t('order.status')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order: Orders) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>
                      {order.client ? `${order.client.firstName} ${order.client.lastName}` : `Client #${order.clientId}`}
                    </TableCell>
                    <TableCell>{order.orderRows?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.approved ? t('order.approved') : t('order.pending')}
                        color={order.approved ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        aria-label="view order"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Order Statistics */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 4 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.pendingOrders')}
            </Typography>
            <Typography variant="h3" color="warning.main">
              {pendingOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('order.pendingOrders')}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.approvedOrders')}
            </Typography>
            <Typography variant="h3" color="success.main">
              {approvedOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('order.approvedOrders')}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

// Client Dashboard Component
const ClientDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const email = useAppSelector((state) => state.auth.email);
  const userId = useAppSelector((state) => state.auth.userId);
  const firstName = useAppSelector((state) => state.auth.firstName);

  // Fetch popular appliances (larger page for catalog)
  const { data: appliancesData, isLoading: appliancesLoading } = useGetAllAppliancesQuery({
    page: 0,
    size: 20,
  });

  // Fetch user's orders (CLIENT-specific endpoint)
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersByClientQuery(
    { clientId: userId!, page: 0, size: 100 },
    { skip: !userId }
  );

  const isLoading = appliancesLoading || ordersLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const appliancesList = appliancesData?.content || [];
  const ordersList = ordersData?.content || [];

  // Orders are already filtered by userId on backend
  const recentOrders = ordersList.slice(0, 5);

  // Filter appliances by search query
  const filteredAppliances = appliancesList.filter((appliance: Appliance) =>
    appliance.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get popular appliances (first 8 items)
  const popularAppliances = searchQuery ? filteredAppliances.slice(0, 8) : appliancesList.slice(0, 8);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcome', { name: firstName || email })}
      </Typography>

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('appliance.searchAppliances')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Paper>

      {/* Category Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {t('common.categories')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card
            sx={{
              flex: '1 1 300px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => navigate('/appliances?category=BIG')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CategoryIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6">{t('appliance.bigAppliances')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {appliancesList.filter((a: Appliance) => a.category === Category.BIG).length} {t('appliance.items')}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: '1 1 300px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => navigate('/appliances?category=SMALL')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <DevicesIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6">{t('appliance.smallAppliances')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {appliancesList.filter((a: Appliance) => a.category === Category.SMALL).length} {t('appliance.items')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Popular Appliances Catalog */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            {searchQuery ? t('appliance.searchResults') : t('appliance.popularAppliances')}
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ViewIcon />}
            onClick={() => navigate('/appliances')}
          >
            {t('dashboard.viewAll')}
          </Button>
        </Box>

        {popularAppliances.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {t('appliance.noAppliances')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {popularAppliances.map((appliance: Appliance) => (
              <ApplianceCard key={appliance.id} appliance={appliance} />
            ))}
          </Box>
        )}
      </Paper>

      {/* Recent Orders */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">{t('order.recentOrders')}</Typography>
          <Button
            variant="outlined"
            endIcon={<ViewIcon />}
            onClick={() => navigate('/orders')}
          >
            {t('dashboard.viewAll')}
          </Button>
        </Box>

        {recentOrders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('order.noOrders')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate('/appliances')}
              sx={{ mt: 2 }}
            >
              {t('appliance.startShopping')}
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('order.orderNumber')}</TableCell>
                  <TableCell>{t('order.items')}</TableCell>
                  <TableCell>{t('order.status')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order: Orders) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.orderRows?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.approved ? t('order.approved') : t('order.pending')}
                        color={order.approved ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        aria-label="view order"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

// Main Dashboard Component
export const DashboardPage: React.FC = () => {
  const role = useAppSelector((state) => state.auth.role);

  if (role === UserRole.CLIENT) {
    return <ClientDashboard />;
  }

  return <EmployeeDashboard />;
};

export default DashboardPage;
