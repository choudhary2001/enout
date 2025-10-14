'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { guestsApi } from './api';
import { GuestFilters, statusOptions, sortOptions, InviteRow, Guest } from './types';
import { GuestTable } from './table/GuestTable';
import { GuestFilters as GuestFiltersComponent } from './table/GuestFilters';
import { BulkActions } from './table/BulkActions';
import { ImportDialog } from './ImportDialog';
import { AddGuestDialog } from './AddGuestDialog';
import { EditGuestModal } from './EditGuestModal';
import { StatChips } from '@/components/StatChips';

interface GuestListPageProps {
  eventId: string;
}

export function GuestListPage({ eventId }: GuestListPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  // URL state management
  const [filters, setFilters] = useState<GuestFilters>(() => {
    const q = searchParams.get('q') || undefined;
    const statusParam = searchParams.get('status')?.split(',');
    const status = statusParam?.filter(s => ['not_invited', 'invited', 'email_verified', 'accepted', 'registered'].includes(s)) as GuestFilters['status'];
    const sort = searchParams.get('sort') as GuestFilters['sort'] || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    return { q, status, sort, page, pageSize };
  });

  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isAddGuestDialogOpen, setIsAddGuestDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.q) params.set('q', filters.q);
    if (filters.status?.length) params.set('status', filters.status.join(','));
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    if (filters.pageSize && filters.pageSize !== 20) params.set('pageSize', filters.pageSize.toString());
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Fetch guests data
  const { data: guestsData, isLoading, error } = useQuery({
    queryKey: ['guests', eventId, filters],
    queryFn: () => guestsApi.getGuests(eventId, filters),
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: (guests: InviteRow[]) => guestsApi.importGuests(eventId, guests),
    onSuccess: (result) => {
      toast({
        title: 'Import successful',
        description: `Imported ${result.imported} guests successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      setIsImportDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Import failed',
        description: error.message || 'Failed to import guests',
        variant: 'destructive',
      });
    },
  });

  // Add guest mutation
  const addGuestMutation = useMutation({
    mutationFn: (guest: InviteRow) => guestsApi.importGuests(eventId, [guest]),
    onSuccess: () => {
      toast({
        title: 'Guest added',
        description: 'Guest added successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      setIsAddGuestDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add guest',
        description: error.message || 'Failed to add guest',
        variant: 'destructive',
      });
    },
  });

  // Bulk actions mutations
  const sendInvitesMutation = useMutation({
    mutationFn: async (guestIds: string[]) => {
      await Promise.all(guestIds.map(id => guestsApi.sendInvite(eventId, id)));
    },
    onSuccess: () => {
      toast({
        title: 'Invites sent',
        description: `Sent invites to ${selectedGuests.length} guests.`,
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      setSelectedGuests([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send invites',
        description: error.message || 'Some invites failed to send',
        variant: 'destructive',
      });
    },
  });

  const resendInvitesMutation = useMutation({
    mutationFn: async (guestIds: string[]) => {
      await Promise.all(guestIds.map(id => guestsApi.resendInvite(eventId, id)));
    },
    onSuccess: () => {
      toast({
        title: 'Invites resent',
        description: `Resent invites to ${selectedGuests.length} guests.`,
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      setSelectedGuests([]);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to resend invites',
        description: error.message || 'Some invites failed to resend',
        variant: 'destructive',
      });
    },
  });

  const exportCSVMutation = useMutation({
    mutationFn: async () => {
      if (!guestsData?.data) return;
      
      const csvData = guestsData.data.map((guest: Guest) => ({
        email: guest.email,
        firstName: guest.firstName || '',
        lastName: guest.lastName || '',
        phone: guest.phone || '',
        countryCode: guest.countryCode || '',
        status: guest.derivedStatus,
      }));

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map((row: any) => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guests-${eventId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: 'Export successful',
        description: 'Guest list exported to CSV.',
      });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (guestIds: string[]) => {
      await Promise.all(guestIds.map(id => guestsApi.deleteGuest(eventId, id)));
    },
    onSuccess: () => {
      toast({
        title: 'Guests removed',
        description: 'Selected guests have been removed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      setSelectedGuests([]); // Clear selection after deletion
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to remove guests',
        description: error.message || 'Failed to remove selected guests',
        variant: 'destructive',
      });
    },
  });

  // Get all guests for stats calculation (without pagination/filters)
  const { data: allGuestsData } = useQuery({
    queryKey: ['guests', eventId, { all: true }],
    queryFn: () => guestsApi.getGuests(eventId, { 
      q: undefined, 
      status: undefined, 
      sort: undefined, 
      page: 1, 
      pageSize: 100 // API has max limit of 100
    }),
    enabled: !!eventId,
  });

  // Calculate stats for StatChips using all guests
  const stats = allGuestsData?.data?.reduce((acc: any, guest: Guest) => {
    switch (guest.derivedStatus) {
      case 'invited':
      case 'email_verified':
        acc.invited++;
        break;
      case 'accepted':
        acc.accepted++;
        break;
      case 'registered':
        acc.registered++;
        break;
    }
    return acc;
  }, { invited: 0, accepted: 0, registered: 0 }) || { invited: 0, accepted: 0, registered: 0 };


  const handleFilterChange = (newFilters: Partial<GuestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
  };

  const handleBulkAction = (action: 'send' | 'resend' | 'export' | 'remove') => {
    switch (action) {
      case 'send':
        sendInvitesMutation.mutate(selectedGuests);
        break;
      case 'resend':
        resendInvitesMutation.mutate(selectedGuests);
        break;
      case 'export':
        exportCSVMutation.mutate();
        break;
      case 'remove':
        if (confirm(`Are you sure you want to remove ${selectedGuests.length} guest(s)? This action cannot be undone.`)) {
          bulkDeleteMutation.mutate(selectedGuests);
        }
        break;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-lg font-medium text-red-600 mb-2">Error loading guests</div>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <StatChips 
          invited={stats.invited}
          accepted={stats.accepted}
          registered={stats.registered}
        />
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Customers</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddGuestDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Guest
              </button>
              <button
                onClick={() => setIsImportDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Import
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters */}
          <GuestFiltersComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            statusOptions={statusOptions as unknown as Array<{ value: string; label: string }>}
            sortOptions={sortOptions as unknown as Array<{ value: string; label: string }>}
          />

          {/* Bulk Actions */}
          {selectedGuests.length > 0 && (
            <BulkActions
              selectedCount={selectedGuests.length}
              onAction={handleBulkAction}
              onClearSelection={() => setSelectedGuests([])}
              isLoading={sendInvitesMutation.isPending || resendInvitesMutation.isPending || bulkDeleteMutation.isPending}
            />
          )}

          {/* Table */}
          <GuestTable
            guests={guestsData?.data || []}
            isLoading={isLoading}
            selectedGuests={selectedGuests}
            onSelectionChange={setSelectedGuests}
            filters={filters}
            onFiltersChange={handleFilterChange}
            eventId={eventId}
            onEditGuest={setEditingGuest}
          />
        </div>
      </div>

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={importMutation.mutate}
        isLoading={importMutation.isPending}
      />

      {/* Add Guest Dialog */}
      <AddGuestDialog
        isOpen={isAddGuestDialogOpen}
        onClose={() => setIsAddGuestDialogOpen(false)}
        onAddGuest={addGuestMutation.mutate}
        isLoading={addGuestMutation.isPending}
      />

      {/* Edit Guest Modal */}
      <EditGuestModal
        guest={editingGuest}
        eventId={eventId}
        onClose={() => setEditingGuest(null)}
      />
    </div>
  );
}
