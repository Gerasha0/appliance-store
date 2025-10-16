import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type ThemeMode = 'light' | 'dark';
type Locale = 'en' | 'uk';

interface UiState {
  theme: ThemeMode;
  locale: Locale;
  isLoading: boolean;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  theme: (localStorage.getItem('theme') as ThemeMode) || 'light',
  locale: (localStorage.getItem('locale') as Locale) || 'en',
  isLoading: false,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
      localStorage.setItem('locale', action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setLocale, setLoading, toggleSidebar, setSidebarOpen } =
  uiSlice.actions;

export const selectUi = (state: RootState) => state.ui;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectLocale = (state: RootState) => state.ui.locale;
export const selectIsLoading = (state: RootState) => state.ui.isLoading;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;

export default uiSlice.reducer;