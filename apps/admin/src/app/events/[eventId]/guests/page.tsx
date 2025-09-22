'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { useDebounce } from '../../../hooks/use-debounce';
import { api } from '../../../lib/api';
import { paginatedGuestsSchema, guestsQueryParamsSchema } from '@enout/shared';

interface GuestsPageProps {
  params: {
    eventId: string;
  };
}

export default function GuestsPage({ params }: GuestsPageProps) {
  const { eventId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse query parameters
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '20');
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  
  // State for search input (debounced)
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);
  
  // State for guests data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  
  // Update URL when filters change
  const updateUrlParams = useCallback((params: Record<string, string>) => {
    const url = new URL(window.location.href);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    
    router.replace(url.pathname + url.search);
  }, [router]);
  
  // Fetch guests when parameters change
  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = guestsQueryParamsSchema.parse({
        page,
        pageSize,
        status: status || undefined,
        search: debouncedSearch || undefined,
      });
      
      // Build query string
      const queryString = new URLSearchParams();
      if (queryParams.page) queryString.append('page', queryParams.page.toString());
      if (queryParams.pageSize) queryString.append('pageSize', queryParams.pageSize.toString());
      if (queryParams.status) queryString.append('status', queryParams.status);
      if (queryParams.search) queryString.append('search', queryParams.search);
      
      const result = await api.get(
        `/events/${eventId}/invites?${queryString.toString()}`,
        paginatedGuestsSchema
      );
      
      setGuests(result.data);
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (err) {
      console.error('Failed to fetch guests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch guests');
    } finally {
      setLoading(false);
    }
  }, [eventId, page, pageSize, status, debouncedSearch]);
  
  // Update search parameter when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateUrlParams({
        search: debouncedSearch,
        page: '1', // Reset to first page on search
      });
    }
  }, [debouncedSearch, search, updateUrlParams]);
  
  // Fetch guests when parameters change
  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);
  
  // Status options
  const statusOptions = useMemo(() => [
    { value: '', label: 'All' },
    { value: 'invited', label: 'Invited' },
    { value: 'email_verified', label: 'Email Verified' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'registered', label: 'Registered' },
  ], []);
  
  // Page size options
  const pageSizeOptions = useMemo(() => [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
  ], []);
  
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrlParams({
      status: e.target.value,
      page: '1', // Reset to first page on status change
    });
  };
  
  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrlParams({
      pageSize: e.target.value,
      page: '1', // Reset to first page on page size change
    });
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    updateUrlParams({
      page: newPage.toString(),
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Event Guests</h1>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by email, name, or phone"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="w-full md:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700 mb-1">
            Page Size
          </label>
          <select
            id="pageSize"
            value={pageSize.toString()}
            onChange={handlePageSizeChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && <GuestsTableSkeleton />}
      
      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error loading guests</h3>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => fetchGuests()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && guests.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
      
      {/* Guests table */}
      {!loading && !error && guests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={guest.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{guest.email}</td>
                  <td className="p-4">
                    {guest.firstName || guest.lastName
                      ? `${guest.firstName || ''} ${guest.lastName || ''}`
                      : '-'}
                  </td>
                  <td className="p-4">
                    {guest.phone
                      ? `${guest.countryCode || ''} ${guest.phone}`
                      : '-'}
                  </td>
                  <td className="p-4">
                    <GuestStatusBadge status={guest.derivedStatus} />
                  </td>
                  <td className="p-4">
                    {format(new Date(guest.createdAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.pageSize, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-1">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded border bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Guest status badge component
 */
function GuestStatusBadge({ status }: { status: string }) {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';
  
  switch (status) {
    case 'invited':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'email_verified':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'accepted':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'registered':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
  }
  
  return (
    <span className={`${bgColor} ${textColor} text-xs px-2 py-1 rounded-full`}>
      {status.replace('_', ' ')}
    </span>
  );
}

/**
 * Guests table skeleton component
 */
function GuestsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}
