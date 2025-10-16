import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import { Close, CheckCircle, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@/types/models';
import type { Orders } from '@/types/models';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailDialogProps {
  open: boolean;
  order: Orders | null;
  userRole: UserRole | null;
  onClose: () => void;
  onApprove?: (orderId: number) => void;
  onEdit?: (orderId: number) => void;
  onDelete?: (orderId: number) => void;
}

export const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  order,
  userRole,
  onClose,
  onApprove,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (!order) {
    return null;
  }

  const isEmployee = userRole === UserRole.EMPLOYEE;
  const canApprove = isEmployee && !order.approved;
  const canEdit = !order.approved;
  const canDelete = !order.approved;

  const totalAmount = order.orderRows?.reduce((sum, row) => sum + row.amount, 0) || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {t('order.orderDetails')} #{order.id}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Order Information Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {t('order.orderInformation')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">{t('order.orderNumber')}:</Typography>
              <Typography fontWeight="medium">#{order.id}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">{t('order.client')}:</Typography>
              <Typography fontWeight="medium">
                {order.client?.firstName && order.client?.lastName
                  ? `${order.client.firstName} ${order.client.lastName}`
                  : 'N/A'}
              </Typography>
            </Box>
            {isEmployee && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">{t('order.employee')}:</Typography>
                <Typography fontWeight="medium">
                  {order.employee?.firstName && order.employee?.lastName
                    ? `${order.employee.firstName} ${order.employee.lastName}`
                    : '-'}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">{t('order.status')}:</Typography>
              <OrderStatusBadge approved={order.approved} />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Items Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {t('order.orderItems')}
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('appliance.name')}</TableCell>
                  <TableCell>{t('appliance.model')}</TableCell>
                  <TableCell align="right">{t('appliance.price')}</TableCell>
                  <TableCell align="right">{t('order.quantity')}</TableCell>
                  <TableCell align="right">{t('order.amount')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderRows && order.orderRows.length > 0 ? (
                  order.orderRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.appliance?.name || 'N/A'}</TableCell>
                      <TableCell>{row.appliance?.model || 'N/A'}</TableCell>
                      <TableCell align="right">
                        ${row.appliance?.price.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          ${row.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        {t('order.noItems')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Total Amount Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {t('order.totalAmount')}:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            ${totalAmount.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'space-between' }}>
          {/* Action buttons on the left */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canApprove && onApprove && (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  onApprove(order.id);
                  onClose();
                }}
              >
                {t('order.approveOrder')}
              </Button>
            )}
            {canEdit && onEdit && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => {
                  onEdit(order.id);
                  onClose();
                }}
              >
                {t('common.edit')}
              </Button>
            )}
            {canDelete && onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  onDelete(order.id);
                  onClose();
                }}
              >
                {t('common.delete')}
              </Button>
            )}
          </Box>

          {/* Close button on the right */}
          <Button onClick={onClose} color="inherit">
            {t('common.close')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;