import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Box, Typography } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSwitcher Component
 * 
 * A reusable component for switching application language between English and Ukrainian.
 * Can be used in AppBar, dialogs, or any other part of the application.
 * 
 * Features:
 * - Icon button with language icon
 * - Dropdown menu with language options
 * - Flags and language names
 * - Highlights currently selected language
 * - Persists language choice in localStorage
 * - Integrates with react-i18next
 * 
 * @example
 * // Basic usage in AppBar
 * <LanguageSwitcher />
 * 
 * @example
 * // With custom color
 * <LanguageSwitcher color="primary" />
 */

interface LanguageSwitcherProps {
  /**
   * Color of the icon button
   * @default 'inherit'
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  
  /**
   * Size of the icon button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional className for custom styling
   */
  className?: string;
  
  /**
   * Whether to show language labels in menu items
   * @default true
   */
  showLabels?: boolean;
}

interface LanguageOption {
  code: 'en' | 'uk';
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
  },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  color = 'inherit',
  size = 'medium',
  className,
  showLabels = true,
}) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (languageCode: 'en' | 'uk') => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('locale', languageCode);
      handleClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <>
      <Tooltip title={t('settings.language') || 'Language'}>
        <IconButton
          color={color}
          size={size}
          onClick={handleClick}
          className={className}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          aria-label="select language"
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            'aria-labelledby': 'language-button',
            role: 'menu',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === i18n.language}
            sx={{
              minWidth: 200,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                width: '100%',
              }}
            >
              <Typography
                variant="h6"
                component="span"
                sx={{ fontSize: '1.5rem' }}
              >
                {language.flag}
              </Typography>
              {showLabels && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {language.nativeName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1 }}
                  >
                    {language.name}
                  </Typography>
                </Box>
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
