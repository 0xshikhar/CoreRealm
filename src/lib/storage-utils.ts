// Utility functions for localStorage management with error handling and logging

/**
 * Safely get an item from localStorage with error handling
 */
export function safeGetItem(key: string): string | null {
    try {
        const value = localStorage.getItem(key);
        return value;
    } catch (error) {
        console.error(`Error getting item from localStorage (${key}):`, error);
        return null;
    }
}

/**
 * Safely set an item in localStorage with error handling
 */
export function safeSetItem(key: string, value: string): boolean {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(`Error setting item in localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Safely remove an item from localStorage with error handling
 */
export function safeRemoveItem(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing item from localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Constants for auth storage
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_ATTEMPTS_KEY = 'auth_attempts';
export const AUTH_LAST_ADDRESS_KEY = 'auth_last_address'; 