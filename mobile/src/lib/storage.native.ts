// Native storage using expo-secure-store
import * as SecureStore from 'expo-secure-store';

// Sanitize keys for SecureStore (only alphanumeric, ".", "-", "_" allowed)
function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, (char) => {
    if (char === '@') return '_at_';
    if (char === '+') return '_plus_';
    if (char === ' ') return '_';
    return '_';
  });
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const sanitizedKey = sanitizeKey(key);
      return await SecureStore.getItemAsync(sanitizedKey);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      const sanitizedKey = sanitizeKey(key);
      await SecureStore.setItemAsync(sanitizedKey, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      const sanitizedKey = sanitizeKey(key);
      await SecureStore.deleteItemAsync(sanitizedKey);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },

  async clear(): Promise<void> {
    // Note: SecureStore doesn't have a clear all method
    // In a real app, you'd track keys and remove them individually
    console.log('Storage clear called (native)');
  },
};
