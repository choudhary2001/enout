'use client';

import { User } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Enout Admin</h1>
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            v1.0.0
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User placeholder */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">Admin User</span>
          </div>
        </div>
      </div>
    </div>
  );
}
