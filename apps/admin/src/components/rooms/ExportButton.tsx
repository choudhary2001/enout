'use client';

import { Download } from 'lucide-react';
import { useRoomsExport } from '@/features/rooms/api';

interface ExportButtonProps {
  eventId: string;
  filters?: {
    status?: string[];
    category?: string;
    search?: string;
  };
}

export function ExportButton({ eventId, filters }: ExportButtonProps) {
  const exportMutation = useRoomsExport();

  const handleExport = async () => {
    try {
      const blob = await exportMutation.mutateAsync({
        eventId,
        filters: filters || {},
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.download = `rooms_${eventId}_${today}.csv`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // Error handling would be done by the mutation's onError
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exportMutation.isPending}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <Download className="h-4 w-4" />
      {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}



