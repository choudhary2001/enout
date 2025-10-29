'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { InviteRow } from './types';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (guests: InviteRow[]) => void;
  isLoading: boolean;
}

const csvRowSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  countryCode: z.string().optional().default('+1'),
});

const importFormSchema = z.object({
  csvData: z.string().min(1, 'CSV data is required'),
});

type ImportFormData = z.infer<typeof importFormSchema>;

export function ImportDialog({ isOpen, onClose, onImport, isLoading }: ImportDialogProps) {
  const [previewData, setPreviewData] = useState<InviteRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ImportFormData>({
    resolver: zodResolver(importFormSchema),
  });

  const parseCSV = (csvText: string): { data: InviteRow[]; errors: string[] } => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      return { data: [], errors: ['CSV must have at least a header row and one data row'] };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: InviteRow[] = [];
    const errors: string[] = [];

    // Map common header variations
    const headerMap: Record<string, string> = {
      'first name': 'firstName',
      'firstname': 'firstName',
      'fname': 'firstName',
      'last name': 'lastName',
      'lastname': 'lastName',
      'lname': 'lastName',
      'email': 'email',
      'email address': 'email',
      'phone': 'phone',
      'phone number': 'phone',
      'mobile': 'phone',
      'country code': 'countryCode',
      'country': 'countryCode',
    };

    const mappedHeaders = headers.map(h => headerMap[h] || h);

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row: any = {};
      mappedHeaders.forEach((mappedHeader, index) => {
        row[mappedHeader] = values[index] || '';
      });

      try {
        const validatedRow = csvRowSchema.parse(row);
        data.push(validatedRow);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
          errors.push(`Row ${i + 1}: ${fieldErrors.join(', ')}`);
        }
      }
    }

    return { data, errors };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setParseErrors(['Please select a CSV file']);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      setValue('csvData', csvText);
      const { data, errors } = parseCSV(csvText);
      setPreviewData(data);
      setParseErrors(errors);
      setIsPreviewMode(true);
    };
    reader.readAsText(file);
  };

  const handleTextareaChange = (value: string) => {
    setValue('csvData', value);
    if (value.trim()) {
      const { data, errors } = parseCSV(value);
      setPreviewData(data);
      setParseErrors(errors);
      setIsPreviewMode(true);
    } else {
      setPreviewData([]);
      setParseErrors([]);
      setIsPreviewMode(false);
    }
  };

  const onSubmit = (data: ImportFormData) => {
    if (previewData.length > 0) {
      onImport(previewData);
    }
  };

  const handleClose = () => {
    reset();
    setPreviewData([]);
    setParseErrors([]);
    setIsPreviewMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />

        {/* Dialog - Made smaller and more compact */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
          {/* Header - Compact */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Import Guests</h2>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content - Compact and Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)} id="import-form" className="space-y-4">
              {/* Upload Section - Compact */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload CSV File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">
                      Drag and drop your CSV file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      Format: firstName,lastName,email,phone,countryCode
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Or paste CSV data</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CSV Data
                  </label>
                  <textarea
                    {...register('csvData')}
                    onChange={(e) => handleTextareaChange(e.target.value)}
                    placeholder="firstName,lastName,email,phone,countryCode&#10;John,Doe,john@example.com,1234567890,+1&#10;Jane,Smith,jane@example.com,9876543210,+1"
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-xs"
                  />
                  {errors.csvData && (
                    <p className="mt-1 text-xs text-red-600">{errors.csvData.message}</p>
                  )}
                </div>
              </div>

              {/* Preview Section - Compact */}
              {isPreviewMode && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-900">Preview</h3>
                  </div>

                  {/* Errors - Compact */}
                  {parseErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-medium text-red-800 mb-1">Parse Errors</h4>
                          <ul className="text-xs text-red-700 space-y-0.5">
                            {parseErrors.slice(0, 3).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {parseErrors.length > 3 && (
                              <li>• ... and {parseErrors.length - 3} more errors</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success - Compact */}
                  {previewData.length > 0 && parseErrors.length === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-medium text-green-800 mb-1">
                            Ready to import {previewData.length} guest{previewData.length !== 1 ? 's' : ''}
                          </h4>
                          <p className="text-xs text-green-700">
                            All rows parsed successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview Table - Compact */}
                  {previewData.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {previewData.slice(0, 5).map((guest, index) => (
                              <tr key={index}>
                                <td className="px-2 py-2 text-xs text-gray-900">
                                  {guest.firstName} {guest.lastName || ''}
                                </td>
                                <td className="px-2 py-2 text-xs text-gray-900">{guest.email}</td>
                                <td className="px-2 py-2 text-xs text-gray-900">
                                  {guest.countryCode} {guest.phone || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {previewData.length > 5 && (
                        <div className="px-2 py-2 bg-gray-50 text-xs text-gray-600">
                          ... and {previewData.length - 5} more guest{previewData.length - 5 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Footer - Compact - Fixed at Bottom */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="import-form"
              disabled={isLoading || previewData.length === 0 || parseErrors.length > 0}
              className="px-3 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Importing...' : `Import ${previewData.length} Guest${previewData.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
