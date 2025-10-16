import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import {
  Inbox as InboxIcon,
  SearchOff as SearchOffIcon,
  ErrorOutline as ErrorIcon,
  FolderOpen as FolderOpenIcon,
  CloudOff as CloudOffIcon,
} from '@mui/icons-material';

type ButtonColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

export interface EmptyStateProps {
  icon?: React.ReactElement | SvgIconComponent;
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: ButtonColor;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'text' | 'outlined' | 'contained';
    color?: ButtonColor;
  };
  iconSize?: number;
  iconColor?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  sx?: SxProps<Theme>;
  minHeight?: string | number;
}

export const EmptyStateTypes = {
  NO_DATA: {
    icon: InboxIcon,
    message: 'No data available',
    description: 'There is no data to display at the moment.',
  },
  NO_RESULTS: {
    icon: SearchOffIcon,
    message: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
  ERROR: {
    icon: ErrorIcon,
    message: 'Something went wrong',
    description: 'Unable to load data. Please try again.',
    iconColor: 'error' as const,
  },
  EMPTY_FOLDER: {
    icon: FolderOpenIcon,
    message: 'This folder is empty',
    description: 'Add items to get started.',
  },
  OFFLINE: {
    icon: CloudOffIcon,
    message: 'You are offline',
    description: 'Please check your internet connection.',
    iconColor: 'disabled' as const,
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  description,
  action,
  secondaryAction,
  iconSize = 80,
  iconColor = 'action',
  sx = {},
  minHeight = 400,
}) => {
  const theme = useTheme();

  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    const getIconColor = () => {
      if (iconColor === 'action') {
        return theme.palette.action.active;
      }
      if (iconColor === 'disabled') {
        return theme.palette.action.disabled;
      }
      if (iconColor === 'inherit') {
        return 'inherit';
      }
      const colorKey: ButtonColor = iconColor;
      return theme.palette[colorKey]?.main || theme.palette.action.active;
    };

    const computedColor = getIconColor();

    if (typeof icon === 'function') {
      const IconComponent = icon;
      return (
        <IconComponent
          sx={{
            fontSize: iconSize,
            color: computedColor,
          }}
        />
      );
    }

    return (
      <Box
        sx={{
          fontSize: iconSize,
          color: computedColor,
          display: 'inline-flex',
        }}
      >
        {icon}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        py: 4,
        px: 2,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Stack spacing={2} alignItems="center" maxWidth={500}>
        {/* Icon */}
        {icon && (
          <Box
            sx={{
              mb: 1,
              opacity: 0.7,
            }}
          >
            {renderIcon()}
          </Box>
        )}

        {/* Message */}
        <Typography
          variant="h6"
          component="h3"
          color="text.primary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 400 }}
          >
            {description}
          </Typography>
        )}

        {/* Action Buttons */}
        {(action || secondaryAction) && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            {action && (
              <Button
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                onClick={action.onClick}
                size="large"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outlined'}
                color={secondaryAction.color || 'primary'}
                onClick={secondaryAction.onClick}
                size="large"
              >
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export const NoDataEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState {...EmptyStateTypes.NO_DATA} {...props} />
);

export const NoResultsEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState {...EmptyStateTypes.NO_RESULTS} {...props} />
);

export const ErrorEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState {...EmptyStateTypes.ERROR} {...props} />
);

export const EmptyFolderState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState {...EmptyStateTypes.EMPTY_FOLDER} {...props} />
);

export const OfflineEmptyState: React.FC<Partial<EmptyStateProps>> = (props) => (
  <EmptyState {...EmptyStateTypes.OFFLINE} {...props} />
);

export default EmptyState;