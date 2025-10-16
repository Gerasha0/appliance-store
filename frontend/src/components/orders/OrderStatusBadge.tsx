import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { CheckCircle, Schedule } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface OrderStatusBadgeProps {
  approved: boolean;
  size?: ChipProps['size'];
  variant?: ChipProps['variant'];
  showIcon?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  approved,
  size = 'small',
  variant = 'filled',
  showIcon = true,
}) => {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    if (approved) {
      return {
        label: t('order.approved'),
        color: 'success' as const,
        icon: showIcon ? <CheckCircle /> : undefined,
      };
    }
    return {
      label: t('order.pending'),
      color: 'warning' as const,
      icon: showIcon ? <Schedule /> : undefined,
    };
  };

  const { label, color, icon } = getStatusConfig();

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={variant}
      icon={icon}
    />
  );
};

export default OrderStatusBadge;