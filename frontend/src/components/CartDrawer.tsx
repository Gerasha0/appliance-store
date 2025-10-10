import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch, closeCart, updateQuantity, removeFromCart, clearCart } from '@/store';
import { useCreateOrderMutation } from '@/store/api/ordersApi';
import { useSnackbar } from 'notistack';
import type { OrderRequestDTO, OrderRowRequestDTO } from '@/types/models';

export const CartDrawer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const isOpen = useAppSelector((state) => state.cart.isOpen);
  const items = useAppSelector((state) => state.cart.items);
  const userId = useAppSelector((state) => state.auth.userId);
  
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.appliance.price * item.quantity, 0);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleUpdateQuantity = (applianceId: number, newQuantity: number) => {
    dispatch(updateQuantity({ applianceId, quantity: newQuantity }));
  };

  const handleRemove = (applianceId: number) => {
    dispatch(removeFromCart(applianceId));
  };

  const handleCheckout = async () => {
    if (!userId) {
      setError(t('cart.loginRequired') || 'Please login to checkout');
      return;
    }

    if (items.length === 0) {
      setError(t('cart.emptyCart') || 'Cart is empty');
      return;
    }

    try {
      const orderData: OrderRequestDTO = {
        clientId: userId,
        orderRows: items.map((item): OrderRowRequestDTO => ({
          applianceId: item.appliance.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData).unwrap();
      
      enqueueSnackbar(t('cart.orderSuccess') || 'Order placed successfully!', { variant: 'success' });
      dispatch(clearCart());
      dispatch(closeCart());
      navigate('/orders');
    } catch (err: any) {
      console.error('Failed to create order:', err);
      const errorMessage = err?.data?.message || t('cart.orderError') || 'Failed to place order';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 400 } } } }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CartIcon /> {t('cart.title')}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {items.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {t('cart.empty')}
          </Typography>
        </Box>
      ) : (
        <>
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {items.map((item) => (
              <ListItem 
                key={item.appliance.id} 
                sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleRemove(item.appliance.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item.appliance.name}
                  secondary={`${item.appliance.model} - $${item.appliance.price.toFixed(2)}`}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item.appliance.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    size="small"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value);
                      if (!Number.isNaN(val) && val > 0) {
                        handleUpdateQuantity(item.appliance.id, val);
                      }
                    }}
                    sx={{ width: 60 }}
                    slotProps={{ 
                      htmlInput: { min: 1, style: { textAlign: 'center' } } 
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item.appliance.id, item.quantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>

                  <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 'bold' }}>
                    ${(item.appliance.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ width: '100%', mt: 2 }} />
              </ListItem>
            ))}
          </List>

          <Divider />

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">{t('cart.total')}</Typography>
              <Typography variant="h6" color="primary">
                ${total.toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
              sx={{ mb: 1 }}
            >
              {isLoading ? t('cart.processing') : t('cart.checkout')}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => dispatch(clearCart())}
              disabled={items.length === 0}
            >
              {t('cart.clear')}
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;
