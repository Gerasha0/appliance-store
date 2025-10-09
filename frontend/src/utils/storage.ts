/**
 * Local storage utilities with type safety and error handling
 */

/**
 * Set item in localStorage with JSON serialization
 * @param key - Storage key
 * @param value - Value to store
 */
export const setLocalStorage = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error setting localStorage:', error);
    return false;
  }
};

/**
 * Get item from localStorage with JSON deserialization
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 */
export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue ?? null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue ?? null;
  }
};

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
export const removeLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage:', error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 */
export const clearLocalStorage = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Set item in sessionStorage with JSON serialization
 * @param key - Storage key
 * @param value - Value to store
 */
export const setSessionStorage = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
    return false;
  }
};

/**
 * Get item from sessionStorage with JSON deserialization
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 */
export const getSessionStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return defaultValue ?? null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    return defaultValue ?? null;
  }
};

/**
 * Remove item from sessionStorage
 * @param key - Storage key
 */
export const removeSessionStorage = (key: string): boolean => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing sessionStorage:', error);
    return false;
  }
};

/**
 * Clear all items from sessionStorage
 */
export const clearSessionStorage = (): boolean => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

/**
 * Storage keys constants for type safety
 */
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
