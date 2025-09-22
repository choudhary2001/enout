import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  loadToken: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,
  setToken: (token) => set({ token }),
  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth-token');
      set({ token, isLoading: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load token', error);
      set({ token: null, isLoading: false });
    }
  },
  signOut: async () => {
    try {
      await SecureStore.deleteItemAsync('auth-token');
      set({ token: null });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to sign out', error);
    }
  },
}));