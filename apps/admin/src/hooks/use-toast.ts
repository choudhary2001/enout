import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, description, variant };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
    
    return {
      id,
      dismiss: () => setToasts((prev) => prev.filter((t) => t.id !== id)),
    };
  }, []);

  return {
    toast,
    toasts,
  };
}

// Export toast function directly for convenience
export const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
  // Simple console log for now - in a real app this would integrate with a toast system
  // eslint-disable-next-line no-console
  console.log(`Toast: ${title} - ${description} (${variant})`);
};
