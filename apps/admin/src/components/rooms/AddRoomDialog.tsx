'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AddRoomRequest } from '@/features/rooms/api';

const addRoomSchema = z.object({
  roomNo: z.string().min(1, 'Room number is required'),
  category: z.string().min(1, 'Category is required'),
  maxGuests: z.enum(['1', '2', '3']).transform(val => parseInt(val) as 1 | 2 | 3),
});

interface AddRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (room: AddRoomRequest) => Promise<void>;
}

const categories = ['Suite', 'Deluxe', 'Standard', 'King', 'Twin', 'Family'];

export function AddRoomDialog({ isOpen, onClose, onAdd }: AddRoomDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof addRoomSchema>>({
    resolver: zodResolver(addRoomSchema),
  });

  const onSubmit = async (data: z.infer<typeof addRoomSchema>) => {
    setIsSubmitting(true);
    try {
      await onAdd(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Room</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Room Number
            </label>
            <input
              {...register('roomNo')}
              type="text"
              placeholder="e.g., 101, A1, Suite-1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.roomNo && (
              <p className="text-sm text-red-600 mt-1">{errors.roomNo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Max Guests
            </label>
            <select
              {...register('maxGuests')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
            </select>
            {errors.maxGuests && (
              <p className="text-sm text-red-600 mt-1">{errors.maxGuests.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



