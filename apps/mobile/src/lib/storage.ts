// Storage stubs (no-op for Phase 1)
// Will be replaced with expo-secure-store in Phase 2

interface StorageInterface {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const storage: StorageInterface = {
  async setItem(key: string, _value: string): Promise<void> {
    // No-op stub
    // eslint-disable-next-line no-console
    console.log(`[Storage Stub] setItem: ${key}`);
  },

  async getItem(key: string): Promise<string | null> {
    // No-op stub
    // eslint-disable-next-line no-console
    console.log(`[Storage Stub] getItem: ${key}`);
    return null;
  },

  async removeItem(key: string): Promise<void> {
    // No-op stub
    // eslint-disable-next-line no-console
    console.log(`[Storage Stub] removeItem: ${key}`);
  },

  async clear(): Promise<void> {
    // No-op stub
    // eslint-disable-next-line no-console
    console.log('[Storage Stub] clear');
  },
};

// Helper functions for common storage operations
export const tokenStorage = {
  async saveToken(token: string): Promise<void> {
    await storage.setItem('auth_token', token);
  },

  async getToken(): Promise<string | null> {
    return await storage.getItem('auth_token');
  },

  async clearToken(): Promise<void> {
    await storage.removeItem('auth_token');
  },
};

interface User {
  email: string;
  id: string;
  role: string;
}

export const userStorage = {
  async saveUser(user: User): Promise<void> {
    await storage.setItem('user_data', JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await storage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  },

  async clearUser(): Promise<void> {
    await storage.removeItem('user_data');
  },
};
