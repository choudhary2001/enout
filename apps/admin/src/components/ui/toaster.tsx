'use client';

import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-sm',
            toast.variant === 'destructive'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white border-gray-200 text-gray-900'
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="font-medium text-sm">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => {
              // Remove toast logic would go here
            }}
            className="p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
