import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  TablePagination,
  Button,
} from '@mui/material';
import { Delete, CheckCircle, Visibility, FilterList, Clear, Add, Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { OrderDetailDialog } from '@/components/orders/OrderDetailDialog';
import { CreateOrderDialog } from '@/components/orders/CreateOrderDialog';
import { EditOrderDialog } from '@/components/orders/EditOrderDialog';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import {
  useGetAllOrdersQuery,
  useGetOrdersByClientQuery,
  useDeleteOrderMutation,
  useApproveOrderMutation,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetClientsPageQuery,
  useGetEmployeesPageQuery,
} from '@/store/api/apiSlice';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types/models';
import type { Client, Employee, Orders } from '@/types/models';

const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const role = useAppSelector(state => state.auth.role);
  const userId = useAppSelector(state => state.auth.userId);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('');
  const [employeeFilter, setEmployeeFilter] = useState<string>('');
  
  const isEmployee = role === UserRole.EMPLOYEE;
  
  const { data: allOrdersResponse, isLoading: isLoadingAll } = useGetAllOrdersQuery(
    { page, size: rowsPerPage },
    { skip: !isEmployee }
  );
  const { data: clientOrdersResponse, isLoading: isLoadingClient } = useGetOrdersByClientQuery(
    { clientId: userId!, page, size: rowsPerPage },
    { skip: isEmployee || !userId }
  );
  
  const ordersResponse = isEmployee ? allOrdersResponse : clientOrdersResponse;
  const isLoading = isEmployee ? isLoadingAll : isLoadingClient;
  
  const { data: clientsData } = useGetClientsPageQuery(
    { page: 0, size: 1000 }, 
    { skip: !isEmployee }
  );
  const { data: employeesData } = useGetEmployeesPageQuery(
    { page: 0, size: 1000 }, 
    { skip: !isEmployee }
  );
  
  const [deleteOrder] = useDeleteOrderMutation();
  const [approveOrder] = useApproveOrderMutation();
  const [createOrder] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: any) => {
    try {
      await createOrder(data).unwrap();
      enqueueSnackbar(t('order.createSuccess'), { variant: 'success' });
      setCreateDialogOpen(false);
    } catch (error: unknown) {
      console.error('Failed to create order:', error);
      enqueueSnackbar(t('order.createError'), { variant: 'error' });
    }
  };

  const handleViewClick = (order: Orders) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrderId) {
      try {
        await deleteOrder(selectedOrderId).unwrap();
        enqueueSnackbar(t('order.deleteSuccess'), { variant: 'success' });
        setDeleteDialogOpen(false);
        setSelectedOrderId(null);
      } catch (error: unknown) {
        console.error('Failed to delete order:', error);
        enqueueSnackbar(t('common.error'), { variant: 'error' });
      }
    }
  };

  const handleApproveClick = (id: number) => {
    setSelectedOrderId(id);
    setApproveDialogOpen(true);
  };

  const handleApproveFromDetail = (id: number) => {
    handleApproveClick(id);
  };

  const handleEditClick = (order: Orders) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleEditFromDetail = (id: number) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      handleEditClick(order);
    }
  };

  const handleEditSubmit = async (orderId: number, data: any) => {
    try {
      await updateOrder({ id: orderId, order: data }).unwrap();
      enqueueSnackbar(t('order.updateSuccess'), { variant: 'success' });
      setEditDialogOpen(false);
      setSelectedOrder(null);
    } catch (error: unknown) {
      console.error('Failed to update order:', error);
      enqueueSnackbar(t('order.updateError'), { variant: 'error' });
    }
  };

  const handleDeleteFromDetail = (id: number) => {
    handleDeleteClick(id);
  };

  const handleApproveConfirm = async () => {
    if (selectedOrderId) {
      try {
        await approveOrder(selectedOrderId).unwrap();
        enqueueSnackbar(t('order.approveSuccess'), { variant: 'success' });
        setApproveDialogOpen(false);
        setSelectedOrderId(null);
      } catch (error: unknown) {
        console.error('Failed to approve order:', error);
        enqueueSnackbar(t('common.error'), { variant: 'error' });
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setClientFilter('');
    setEmployeeFilter('');
    setPage(0);
  };

  const hasActiveFilters = statusFilter !== 'all' || clientFilter || employeeFilter;

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  let filteredOrders = ordersResponse?.content || [];
  
  if (isEmployee) {
    if (statusFilter !== 'all') {
      const isApproved = statusFilter === 'approved';
      filteredOrders = filteredOrders.filter((order: Orders) => order.approved === isApproved);
    }
    
    if (clientFilter) {
      filteredOrders = filteredOrders.filter((order: Orders) => order.client?.id === Number(clientFilter));
    }
    
    if (employeeFilter) {
      filteredOrders = filteredOrders.filter((order: Orders) => order.employee?.id === Number(employeeFilter));
    }
  } else if (statusFilter !== 'all') {
    const isApproved = statusFilter === 'approved';
    filteredOrders = filteredOrders.filter((order: Orders) => order.approved === isApproved);
  }
  
  const orders = filteredOrders;
  const totalElements = filteredOrders.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('order.title')}</Typography>
        {isEmployee && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateClick}
          >
            {t('order.addOrder')}
          </Button>
        )}
      </Box>

        {/* Filters Section */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">{t('common.filters')}</Typography>
            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<Clear />}
                onClick={handleClearFilters}
                sx={{ ml: 'auto' }}
              >
                {t('common.clearFilters')}
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              select
              label={t('order.status')}
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
            >
              <MenuItem value="all">{t('common.all')}</MenuItem>
              <MenuItem value="approved">{t('order.approved')}</MenuItem>
              <MenuItem value="pending">{t('order.pending')}</MenuItem>
            </TextField>
            {isEmployee && (
              <>
                <TextField
                  select
                  label={t('order.client')}
                  value={clientFilter}
                  onChange={e => {
                    setClientFilter(e.target.value);
                    setPage(0);
                  }}
                  size="small"
                  sx={{ flex: 1, minWidth: 200 }}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  {clientsData?.content?.map((client: Client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label={t('order.employee')}
                  value={employeeFilter}
                  onChange={e => {
                    setEmployeeFilter(e.target.value);
                    setPage(0);
                  }}
                  size="small"
                  sx={{ flex: 1, minWidth: 200 }}
                >
                  <MenuItem value="">{t('common.all')}</MenuItem>
                  {employeesData?.content?.map((employee: Employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('order.orderNumber')}</TableCell>
                <TableCell>{t('order.client')}</TableCell>
                {isEmployee && <TableCell>{t('order.employee')}</TableCell>}
                <TableCell>{t('order.status')}</TableCell>
                <TableCell>{t('order.total')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isEmployee ? 6 : 5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      {t('order.noOrders')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map(order => {
                  const total = order.orderRows?.reduce((sum, row) => sum + row.amount, 0) || 0;
                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {order.client?.firstName && order.client?.lastName
                          ? `${order.client.firstName} ${order.client.lastName}`
                          : 'N/A'}
                      </TableCell>
                      {isEmployee && (
                        <TableCell>
                          {order.employee?.firstName && order.employee?.lastName
                            ? `${order.employee.firstName} ${order.employee.lastName}`
                            : '-'}
                        </TableCell>
                      )}
                      <TableCell>
                        <OrderStatusBadge approved={order.approved} />
                      </TableCell>
                      <TableCell>${total.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleViewClick(order)}>
                          <Visibility />
                        </IconButton>
                        {!order.approved && (
                          <IconButton size="small" onClick={() => handleEditClick(order)}>
                            <Edit />
                          </IconButton>
                        )}
                        {isEmployee && !order.approved && (
                          <IconButton size="small" onClick={() => handleApproveClick(order.id)}>
                            <CheckCircle color="success" />
                          </IconButton>
                        )}
                        {!order.approved && (
                          <IconButton size="small" onClick={() => handleDeleteClick(order.id)}>
                            <Delete />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('common.rowsPerPage')}
          />
        </TableContainer>

        <ConfirmDialog
          open={deleteDialogOpen}
          title={t('common.delete')}
          message={t('order.deleteConfirm')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
        />

        <ConfirmDialog
          open={approveDialogOpen}
          title={t('order.approved')}
          message={t('order.approveConfirm')}
          onConfirm={handleApproveConfirm}
          onCancel={() => setApproveDialogOpen(false)}
        />

        <OrderDetailDialog
          open={detailDialogOpen}
          order={selectedOrder}
          userRole={role}
          onClose={() => setDetailDialogOpen(false)}
          onApprove={handleApproveFromDetail}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
        />

        <CreateOrderDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateSubmit}
        />

        <EditOrderDialog
          open={editDialogOpen}
          order={selectedOrder}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleEditSubmit}
        />
    </Box>
  );
};

export default OrdersPage;