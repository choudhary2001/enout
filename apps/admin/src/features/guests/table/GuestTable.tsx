'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Guest, GuestFilters, statusColors, PaginatedGuests } from '../types';
import { guestsApi } from '../api';
import { RowActions } from './RowActions';
import { useCan } from '@/lib/useCan';
import { AttendeeDetailsModal } from '@/components/guests/AttendeeDetailsModal';

const columnHelper = createColumnHelper<Guest>();

interface GuestTableProps {
  guests: Guest[];
  guestsData?: PaginatedGuests | null;
  isLoading: boolean;
  selectedGuests: string[];
  onSelectionChange: (selected: string[]) => void;
  filters: GuestFilters;
  onFiltersChange: (filters: Partial<GuestFilters>) => void;
  eventId: string;
  onEditGuest: (guest: Guest) => void;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function GuestTable({
  guests,
  guestsData,
  isLoading,
  selectedGuests,
  onSelectionChange,
  filters,
  onFiltersChange,
  eventId,
  onEditGuest,
}: GuestTableProps) {
  const queryClient = useQueryClient();
  const canDelete = useCan('attendee.delete' as any);
  const canEdit = useCan('attendee.edit' as any);
  const canSendInvites = useCan('attendee.invite' as any);

  // Row actions mutations
  const sendInviteMutation = useMutation({
    mutationFn: (guestId: string) => guestsApi.sendInvite(eventId, guestId),
    onSuccess: () => {
      toast({
        title: 'Invite sent',
        description: 'Invite sent successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to send invite',
        description: error.message || 'Failed to send invite',
        variant: 'destructive',
      });
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: (guestId: string) => guestsApi.resendInvite(eventId, guestId),
    onSuccess: () => {
      toast({
        title: 'Invite resent',
        description: 'Invite resent successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to resend invite',
        description: error.message || 'Failed to resend invite',
        variant: 'destructive',
      });
    },
  });

  const deleteGuestMutation = useMutation({
    mutationFn: (guestId: string) => guestsApi.deleteGuest(eventId, guestId),
    onSuccess: () => {
      toast({
        title: 'Guest removed',
        description: 'Guest removed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to remove guest',
        description: error.message || 'Failed to remove guest',
        variant: 'destructive',
      });
    },
  });

  const [selectedGuest, setSelectedGuest] = React.useState<Guest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => {
            table.toggleAllPageRowsSelected(e.target.checked);
            const allIds = table.getRowModel().rows.map(row => row.original.id);
            onSelectionChange(e.target.checked ? allIds : []);
          }}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(e.target.checked);
            const currentSelected = selectedGuests.filter(id => id !== row.original.id);
            onSelectionChange(e.target.checked
              ? [...currentSelected, row.original.id]
              : currentSelected
            );
          }}
          className="rounded border-gray-300"
        />
      ),
    }),
    columnHelper.display({
      id: 'srNo',
      header: 'Sr No',
      cell: ({ row }) => {
        const pageIndex = filters.page || 1;
        const pageSize = filters.pageSize || 20;
        return (pageIndex - 1) * pageSize + row.index + 1;
      },
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => (
        <div className="font-medium text-gray-900">
          {info.getValue() || <span className="text-gray-400">—</span>}
        </div>
      ),
    }),
    columnHelper.accessor('countryCode', {
      header: 'Country Code',
      cell: (info) => (
        <div className="text-gray-600">
          {info.getValue() || <span className="text-gray-400">—</span>}
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => (
        <div className="text-gray-600">
          {info.getValue() || <span className="text-gray-400">—</span>}
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <div className="text-gray-600">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor('derivedStatus', {
      header: 'Status',
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'details',
      header: 'Details',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedGuest(row.original);
            setIsDetailsModalOpen(true);
          }}
          className="p-1 text-gray-400 hover:text-primary transition-colors"
          title="View registration details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <RowActions
          guest={row.original}
          onSendInvite={() => sendInviteMutation.mutate(row.original.id)}
          onResendInvite={() => resendInviteMutation.mutate(row.original.id)}
          onDelete={() => deleteGuestMutation.mutate(row.original.id)}
          canDelete={canDelete}
          canEdit={canEdit}
          canSendInvites={canSendInvites}
          isLoading={sendInviteMutation.isPending || resendInviteMutation.isPending || deleteGuestMutation.isPending}
          onEdit={onEditGuest}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: guests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((guests.length || 0) / (filters.pageSize || 20)),
    state: {
      pagination: {
        pageIndex: (filters.page || 1) - 1,
        pageSize: filters.pageSize || 20,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border border-gray-200 rounded-lg">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap relative">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((filters.page || 1) - 1) * (filters.pageSize || 20) + 1} to{' '}
          {Math.min(
            (filters.page || 1) * (filters.pageSize || 20),
            guestsData?.total || 0
          )}{' '}
          of {guestsData?.total || 0} results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFiltersChange({ page: 1 })}
            disabled={(filters.page || 1) <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            title="First page"
          >
            ««
          </button>
          <button
            onClick={() => onFiltersChange({ page: (filters.page || 1) - 1 })}
            disabled={(filters.page || 1) <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {(() => {
              const currentPage = filters.page || 1;
              const totalPages = guestsData?.totalPages || 1;
              const pages: (number | string)[] = [];

              if (totalPages <= 7) {
                // Show all pages if 7 or fewer
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);

                if (currentPage > 3) {
                  pages.push('...');
                }

                // Show current page and neighbors
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (currentPage < totalPages - 2) {
                  pages.push('...');
                }

                // Always show last page
                pages.push(totalPages);
              }

              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => onFiltersChange({ page: page as number })}
                    className={`px-3 py-1 text-sm border rounded-lg transition-colors ${page === currentPage
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
          </div>

          <button
            onClick={() => onFiltersChange({ page: (filters.page || 1) + 1 })}
            disabled={(filters.page || 1) >= (guestsData?.totalPages || 1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
          <button
            onClick={() => onFiltersChange({ page: guestsData?.totalPages || 1 })}
            disabled={(filters.page || 1) >= (guestsData?.totalPages || 1)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            title="Last page"
          >
            »»
          </button>
        </div>
      </div>

      {/* Empty State */}
      {guests.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-lg font-medium text-gray-900 mb-2">No guests yet</div>
          <p className="text-gray-500 mb-4">
            Start by importing your guest list or adding guests manually.
          </p>
        </div>
      )}

      {/* Attendee Details Modal */}
      <AttendeeDetailsModal
        isOpen={isDetailsModalOpen}
        attendee={selectedGuest}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedGuest(null);
        }}
      />
    </div>
  );
}
