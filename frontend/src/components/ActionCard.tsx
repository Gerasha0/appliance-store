import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  alpha
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface ActionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  sx?: SxProps<Theme>;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  color = 'primary',
  sx,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        ...sx,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              mb: 2,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      {(primaryAction || secondaryAction) && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {secondaryAction && (
            <Button
              size="small"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              size="small"
              variant="contained"
              color={color}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};
