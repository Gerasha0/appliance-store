import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import { Delete, Search, Add, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetAllAppliancesQuery } from '@/store/api/apiSlice';
import { QuantityInput } from '@/components';
import type { Orders, Appliance, OrderRequestDTO } from '@/types/models';

interface EditOrderDialogProps {
  open: boolean;
  order: Orders | null;
  onClose: () => void;
  onSubmit: (orderId: number, data: OrderRequestDTO) => Promise<void>;
  isLoading?: boolean;
}

interface OrderItem {
  appliance: Appliance;
  quantity: number;
  subtotal: number;
}

export const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  order,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Items selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Only fetch appliances when dialog is open
  const { data: appliancesData } = useGetAllAppliancesQuery(
    { page: 0, size: 1000 },
    { skip: !open }
  );
  const appliances = appliancesData?.content || [];

  // Filter appliances based on search
  const filteredAppliances = searchQuery
    ? appliances.filter(
        app =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appliances;

  // Calculate total amount
  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Initialize form with existing order data
  useEffect(() => {
    if (open && order) {
      // Load existing order items
      const existingItems: OrderItem[] =
        order.orderRows?.map(row => ({
          appliance: row.appliance!,
          quantity: row.quantity,
          // Ensure amount is a number (it might be BigDecimal from backend)
          subtotal: typeof row.amount === 'number' ? row.amount : Number(row.amount),
        })) || [];
      setOrderItems(existingItems);
    }
  }, [open, order]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedAppliance(null);
      setQuantity(1);
      setOrderItems([]);
      setSearchQuery('');
    }
  }, [open]);

  const handleAddItem = () => {
    if (selectedAppliance && quantity > 0) {
      const existingItemIndex = orderItems.findIndex(
        item => item.appliance.id === selectedAppliance.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...orderItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].subtotal =
          Math.round(updatedItems[existingItemIndex].quantity * selectedAppliance.price * 100) / 100;
        setOrderItems(updatedItems);
      } else {
        // Add new item
        const newItem: OrderItem = {
          appliance: selectedAppliance,
          quantity,
          subtotal: Math.round(quantity * selectedAppliance.price * 100) / 100,
        };
        setOrderItems([...orderItems, newItem]);
      }

      // Reset selection
      setSelectedAppliance(null);
      setQuantity(1);
      setSearchQuery('');
    }
  };

  const handleRemoveItem = (applianceId: number) => {
    setOrderItems(orderItems.filter(item => item.appliance.id !== applianceId));
  };

  const handleQuantityChange = (applianceId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      const updatedItems = orderItems.map(item => {
        if (item.appliance.id === applianceId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: Math.round(newQuantity * item.appliance.price * 100) / 100,
          };
        }
        return item;
      });
      setOrderItems(updatedItems);
    }
  };

  const handleSubmit = async () => {
    if (!order) {
      console.error('Order is null');
      return;
    }

    if (orderItems.length === 0) {
      console.error('No order items');
      return;
    }

    // Ensure we have a valid clientId
    const clientId = order.client?.id || order.clientId;
    if (!clientId) {
      console.error('Client ID is missing', { order });
      return;
    }

    const orderData: OrderRequestDTO = {
      clientId: clientId,
      orderRows: orderItems.map(item => ({
        applianceId: item.appliance.id,
        quantity: item.quantity,
        // Round amount to 2 decimal places to match backend BigDecimal(10,2) constraint
        amount: Math.round(item.subtotal * 100) / 100,
      })),
    };

    console.log('Submitting order update:', {
      orderId: order.id,
      orderData,
      orderItems,
    });

    await onSubmit(order.id, orderData);
  };

  if (!order) {
    return null;
  }

  const canSubmit = orderItems.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {t('order.editOrder')} #{order.id}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Client Information (Read-only) */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('order.client')}
          </Typography>
          <Typography variant="body1">
            {order.client?.firstName} {order.client?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.client?.email}
          </Typography>
        </Box>

        {/* Edit Items Section */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {t('order.editItems')}
          </Typography>

          {/* Appliance Selection */}
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              options={filteredAppliances}
              getOptionLabel={(option) => `${option.name} - ${option.model} ($${option.price})`}
              value={selectedAppliance}
              onChange={(_, newValue) => setSelectedAppliance(newValue)}
              inputValue={searchQuery}
              onInputChange={(_, newValue) => setSearchQuery(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('order.selectAppliance')}
                  placeholder={t('order.searchAppliances')}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                label={t('order.quantity')}
                type="number"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                slotProps={{
                  htmlInput: { min: 1 },
                }}
                sx={{ width: 150 }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddItem}
                disabled={!selectedAppliance}
                sx={{ height: 56 }}
              >
                {t('order.addItem')}
              </Button>
            </Box>
          </Box>

          {/* Items List */}
          {orderItems.length > 0 && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                {t('order.orderItems')}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('appliance.name')}</TableCell>
                      <TableCell>{t('appliance.model')}</TableCell>
                      <TableCell align="right">{t('appliance.price')}</TableCell>
                      <TableCell align="center" sx={{ width: 120 }}>
                        {t('order.quantity')}
                      </TableCell>
                      <TableCell align="right">{t('order.subtotal')}</TableCell>
                      <TableCell align="center" sx={{ width: 80 }}>
                        {t('common.actions')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map(item => (
                      <TableRow key={item.appliance.id}>
                        <TableCell>{item.appliance.name}</TableCell>
                        <TableCell>{item.appliance.model}</TableCell>
                        <TableCell align="right">${item.appliance.price.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <QuantityInput
                              value={item.quantity}
                              onChange={(newQty) => handleQuantityChange(item.appliance.id, newQty)}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">
                            ${item.subtotal.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.appliance.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="h6" fontWeight="bold">
                          {t('order.total')}:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          ${totalAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {orderItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {t('order.noItemsAdded')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? t('common.saving') : t('order.updateOrder')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog;
