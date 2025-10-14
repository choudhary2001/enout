'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { GuestFilters as GuestFiltersType } from '../types';

interface GuestFiltersProps {
  filters: GuestFiltersType;
  onFiltersChange: (filters: Partial<GuestFiltersType>) => void;
  statusOptions: Array<{ value: string; label: string }>;
  sortOptions: Array<{ value: string; label: string }>;
}

export function GuestFilters({
  filters,
  onFiltersChange,
  statusOptions,
  sortOptions,
}: GuestFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.q || '');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ q: searchQuery || undefined });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onFiltersChange]);

  const handleStatusToggle = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status as any)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status as any];
    
    onFiltersChange({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({ sort: sort as GuestFiltersType['sort'] });
    setIsSortDropdownOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    onFiltersChange({ q: undefined, status: undefined, sort: undefined });
  };

  const hasActiveFilters = filters.q || filters.status?.length || filters.sort;

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filters Row */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Status
            {filters.status?.length && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                {filters.status.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4" />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {statusOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(option.value as any) || false}
                      onChange={() => handleStatusToggle(option.value)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sort
            <ChevronDown className="h-4 w-4" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 ${
                      filters.sort === option.value ? 'bg-primary/10 text-primary' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.q && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Search: "{filters.q}"
              <button
                onClick={() => {
                  setSearchQuery('');
                  onFiltersChange({ q: undefined });
                }}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.status?.map((status) => (
            <span key={status} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {statusOptions.find(opt => opt.value === status)?.label}
              <button
                onClick={() => handleStatusToggle(status)}
                className="ml-1 hover:text-green-600"
              >
                ×
              </button>
            </span>
          ))}
          
          {filters.sort && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Sort: {sortOptions.find(opt => opt.value === filters.sort)?.label}
              <button
                onClick={() => onFiltersChange({ sort: undefined })}
                className="ml-1 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
