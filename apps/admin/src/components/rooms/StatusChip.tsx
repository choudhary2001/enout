'use client';

import { cn } from '@/lib/utils';

interface StatusChipProps {
  status: 'empty' | 'partial' | 'full';
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'empty':
        return {
          label: 'Empty',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
      case 'partial':
        return {
          label: 'Partial',
          className: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'full':
        return {
          label: 'Full',
          className: 'bg-green-100 text-green-700 border-green-200',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-700 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
