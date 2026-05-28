'use client';

import React, { useState } from 'react';
import { 
  CloudArrowUp, 
  CheckCircle, 
  FileMagnifyingGlass,
  Play,
  FileCsv,
  DownloadSimple,
  Warning
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

type PreviewRecord = {
  employeeId: string;
  name: string;
  email: string;
  baseSalary: number;
  netSalary: number;
  status: 'Valid' | 'Error';
  errorReason?: string;
};

export default function UploadPayroll() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1); // 1: upload, 2: validating, 3: preview
  const [records, setRecords] = useState<PreviewRecord[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setStep(2); // Move to validating step
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      // Send the file to our Go Fiber Backend
      const res = await fetch('http://127.0.0.1:8080/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }
      
      setRecords(data.records || []);
      setStep(3); // Move to preview step
    } catch (err: any) {
      setUploadError(err.message);
      setStep(1); // Reset on error
    }
  };

  // Helper arrays
  const validRecords = records.filter(r => r.status === 'Valid');
  const errorRecords = records.filter(r => r.status === 'Error');

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Upload Payroll</h2>
        <p className="text-sm text-slate-500">Import CSV files to initiate a new payroll processing batch.</p>
      </div>

      {/* Progress Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <div className={`px-4 py-2 border-b-2 text-sm font-medium ${step >= 1 ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
          1. Upload CSV
        </div>
        <div className={`px-4 py-2 border-b-2 text-sm font-medium ${step >= 2 ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
          2. Server Validation
        </div>
        <div className={`px-4 py-2 border-b-2 text-sm font-medium ${step >= 3 ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>
          3. Preview & Processing
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-4">
          
          {uploadError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-sm text-sm flex items-center gap-2">
              <Warning className="w-5 h-5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
              <DownloadSimple className="w-3.5 h-3.5" /> Download Sample CSV
            </button>
          </div>
          <div 
            className={`border-2 border-dashed rounded-sm p-12 text-center transition-colors ${dragActive ? 'border-primary bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".csv"
              onChange={handleChange}
              className="hidden" 
              id="file-upload" 
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <CloudArrowUp className="w-10 h-10 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">Strict requirement: CSV only. Max 10MB.</p>
              </div>
              <div className="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
                Select File
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Validating */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 p-12 rounded-sm shadow-sm text-center flex flex-col items-center gap-4">
          <FileMagnifyingGlass className="w-10 h-10 text-primary animate-pulse" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Validating Records on Server...</h3>
            <p className="text-xs text-slate-500 mt-1">Running structural checks and database lookups in Go.</p>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm flex items-start gap-3">
            <CheckCircle weight="fill" className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-900">Validation Complete</h4>
              <p className="text-xs text-emerald-700 mt-0.5">Found {validRecords.length} valid records in {file?.name}. {errorRecords.length} errors.</p>
            </div>
          </div>

          {/* Validation Errors UI Block */}
          {errorRecords.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Warning className="w-4 h-4 text-rose-500" /> Validation Errors
                </h3>
              </div>
              <div className="p-4 bg-white text-sm">
                <ul className="space-y-2 text-rose-600 font-mono text-xs">
                  {errorRecords.map((err, idx) => (
                    <li key={idx}><span className="font-semibold">{err.employeeId || 'Unknown Row'}:</span> {err.errorReason}</li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 mt-3 italic">Fix these errors in your CSV and re-upload, or proceed to process only valid rows.</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <FileCsv className="w-4 h-4 text-slate-500" /> Validation Preview Table
              </h3>
              <span className="text-xs text-slate-500">Showing {validRecords.length} valid records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-dense">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="text-right">Base Salary</th>
                    <th className="text-right">Net Salary</th>
                    <th className="text-center">Validation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {validRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No valid records found.
                      </td>
                    </tr>
                  ) : (
                    validRecords.map((record, i) => (
                      <tr key={i}>
                        <td className="font-medium text-slate-900">{record.employeeId}</td>
                        <td>{record.name}</td>
                        <td>{record.email}</td>
                        <td className="text-right font-mono">${record.baseSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="text-right font-mono text-emerald-600 font-semibold">${record.netSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                            <CheckCircle weight="fill" /> Ready
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => {
                setStep(1);
                setFile(null);
                setRecords([]);
              }} 
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <Link 
              href="/dashboard/jobs"
              className={`bg-primary text-white px-4 py-2 rounded-sm font-medium text-sm transition-colors inline-flex items-center gap-2 shadow-sm ${validRecords.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-violet-800'}`}
            >
              <Play weight="fill" className="w-4 h-4" /> Start Payroll Processing
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
