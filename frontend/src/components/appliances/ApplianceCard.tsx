import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { Appliance } from '@/types/models';
import { Category, UserRole } from '@/types/models';
import { useAppDispatch, useAppSelector, addToCart } from '@/store';

interface ApplianceCardProps {
  appliance: Appliance;
  onClick?: (appliance: Appliance) => void;
}

export const ApplianceCard: React.FC<ApplianceCardProps> = ({ appliance, onClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const role = useAppSelector((state) => state.auth.role);

  const handleClick = () => {
    if (onClick) {
      onClick(appliance);
    } else {
      navigate(`/appliances/${appliance.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    dispatch(addToCart(appliance));
    enqueueSnackbar(t('cart.itemAdded') || 'Item added to cart', { variant: 'success' });
  };

  return (
    <Card
      sx={{
        flex: '1 1 calc(25% - 24px)',
        minWidth: 250,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {appliance.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {appliance.model}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {appliance.manufacturer?.name || t('common.notSpecified')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
          <Chip
            label={t(`appliance.categories.${appliance.category}`)}
            size="small"
            color={appliance.category === Category.BIG ? 'primary' : 'secondary'}
          />
          <Chip
            label={t(`appliance.powerTypes.${appliance.powerType}`)}
            size="small"
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${appliance.price.toFixed(2)}
          </Typography>
          {appliance.power && (
            <Typography variant="body2" color="text.secondary">
              {appliance.power}W
            </Typography>
          )}
        </Box>

        {/* Add to Cart button - only for clients */}
        {role === UserRole.CLIENT && (
          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              size="small"
            >
              {t('cart.addToCart')}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplianceCard;