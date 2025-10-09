import React from 'react';
import {
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme } from '@/store/slices/uiSlice';

export interface ThemeToggleProps {
  /**
   * Size of the icon button
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color of the icon button
   * @default "inherit"
   */
  color?: 'inherit' | 'default' | 'primary' | 'secondary';
  /**
   * Show tooltip
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Custom tooltip text for light mode
   */
  lightModeTooltip?: string;
  /**
   * Custom tooltip text for dark mode
   */
  darkModeTooltip?: string;
  /**
   * Edge position for IconButton
   */
  edge?: 'start' | 'end' | false;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'medium',
  color = 'inherit',
  showTooltip = true,
  lightModeTooltip = 'Switch to light mode',
  darkModeTooltip = 'Switch to dark mode',
  edge = false,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const currentTheme = useAppSelector((state) => state.ui.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const isDarkMode = currentTheme === 'dark';
  const tooltipText = isDarkMode ? lightModeTooltip : darkModeTooltip;

  const iconButton = (
    <IconButton
      onClick={handleToggle}
      color={color}
      size={size}
      edge={edge}
      aria-label={tooltipText}
      sx={{
        transition: theme.transitions.create(['transform'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          transform: 'rotate(20deg)',
        },
      }}
    >
      {isDarkMode ? (
        <LightModeIcon fontSize={size === 'large' ? 'large' : 'medium'} />
      ) : (
        <DarkModeIcon fontSize={size === 'large' ? 'large' : 'medium'} />
      )}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={tooltipText} arrow>
        {iconButton}
      </Tooltip>
    );
  }

  return iconButton;
};

export default ThemeToggle;
