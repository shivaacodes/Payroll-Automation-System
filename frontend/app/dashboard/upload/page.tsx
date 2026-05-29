'use client';

import React, { useState } from 'react';
import { 
  CloudArrowUp, 
  CheckCircle, 
  FileMagnifyingGlass,
  Play,
  FileCsv,
  DownloadSimple,
  Warning,
  Spinner
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';

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
  const [processing, setProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [rawPreview, setRawPreview] = useState<string[][] | null>(null);
  const router = useRouter();

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
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (uploadedFile: File) => {
    setFile(uploadedFile);
    setUploadError(null);
    
    // Read raw CSV to show preview before validating
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        // Preview first 6 lines
        const previewLines = lines.slice(0, 6).map(l => l.split(','));
        setRawPreview(previewLines);
      }
    };
    reader.readAsText(uploadedFile);
  };

  const processUpload = async () => {
    if (!file) return;
    setStep(2); // Move to validating step
    setUploadError(null);
    setRawPreview(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the file to our Go Fiber Backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }
      
      setRecords(data.records || []);
      
      // Artificial delay for UI theater (split into two 1.2s chunks)
      setTimeout(() => {
        setStep(3); // Move to third theater step
        setTimeout(() => {
          setStep(4); // Move to preview step
        }, 1200);
      }, 1200);
    } catch (err: any) {
      setUploadError(err.message);
      setStep(1); // Reset on error
    }
  };

  // Helper arrays
  const validRecords = records.filter(r => r.status === 'Valid');
  const errorRecords = records.filter(r => r.status === 'Error');

  const startProcessing = async () => {
    if (validRecords.length === 0) return;
    setProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/jobs/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: validRecords })
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          router.push('/dashboard/jobs');
        }, 2000); // Show toast for 2s then redirect
      } else {
        const data = await res.json();
        setUploadError(data.error || 'Failed to start processing');
        setProcessing(false);
      }
    } catch (err) {
      setUploadError('Failed to connect to backend worker');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Payroll Batch Dispatched!"
        description={`${validRecords.length} salary slips are being generated and emailed in the background.`}
      />
      
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Upload Payroll</h2>
      </div>

      {/* Upload Dropzone (Only visible in Step 1) */}
      {step === 1 && (
        <div className="space-y-4 pt-4">
          
          {uploadError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-sm text-sm flex items-center gap-2">
              <Warning className="w-5 h-5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div 
            className={`border-2 border-dashed rounded-sm p-8 md:p-16 text-center transition-all ${dragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}
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
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-primary/30 group-hover:text-primary transition-all text-slate-400">
                <CloudArrowUp className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-slate-900">Drag and drop your CSV here</p>
              <p className="text-sm text-slate-500 mt-1">or <span className="text-primary font-medium hover:underline">browse files</span></p>
            </label>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 px-2">
            <span>Max file size: 10MB</span>
            <a 
              href="/sample_payroll.csv"
              download="sample_payroll.csv"
              className="font-medium text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-sm hover:bg-slate-50 hover:text-slate-900 inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <DownloadSimple className="w-4 h-4" /> Download Sample CSV
            </a>
          </div>
          
          {/* Raw CSV Preview */}
          {rawPreview && (
            <div className="bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0 mt-6 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileCsv className="w-4 h-4 text-slate-500" /> Raw CSV Preview (First 5 Rows)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-dense">
                  <thead>
                    <tr>
                      {rawPreview[0].map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rawPreview.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="font-mono text-xs">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setFile(null);
                    setRawPreview(null);
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={processUpload}
                  className="bg-primary text-white px-4 py-2 rounded-sm font-medium text-sm transition-colors shadow-sm hover:bg-violet-800"
                >
                  Validate Data
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Processing Steps View (Horizontal Stepper) */}
      {step >= 2 && (
        <div className="mt-8 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="relative min-w-[500px] max-w-3xl mx-auto">
            {/* Connecting Lines */}
            <div className="absolute top-[14px] left-[12%] right-[12%] flex z-0">
               <div className="h-[2px] flex-1 bg-emerald-200"></div>
               <div className={`h-[2px] flex-1 transition-colors duration-500 ${step > 2 ? 'bg-amber-200' : 'bg-slate-100'}`}></div>
               <div className={`h-[2px] flex-1 transition-colors duration-500 ${step > 3 ? 'bg-blue-200' : 'bg-slate-100'}`}></div>
            </div>

            {/* Steps Nodes */}
            <div className="relative z-10 flex justify-between">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-3 w-1/4 text-emerald-600">
                <div className="bg-white rounded-full p-0.5">
                  <CheckCircle weight="fill" className="w-7 h-7 shrink-0" />
                </div>
                <span className="font-semibold text-sm text-center">File Uploaded</span>
              </div>
              
              {/* Step 2 */}
              <div className={`flex flex-col items-center gap-3 w-1/4 transition-opacity duration-500 ease-in-out ${step >= 2 ? 'opacity-100 text-amber-600' : 'opacity-0 text-slate-300'}`}>
                <div className="bg-white rounded-full p-0.5">
                  {step === 2 ? (
                    <Spinner className="w-7 h-7 shrink-0 text-amber-500 animate-spin" />
                  ) : (
                    <CheckCircle weight="fill" className="w-7 h-7 shrink-0 text-amber-500" />
                  )}
                </div>
                <span className="font-semibold text-sm text-center">Validating Data</span>
              </div>

              {/* Step 3 */}
              <div className={`flex flex-col items-center gap-3 w-1/4 transition-opacity duration-500 ease-in-out delay-150 ${step >= 3 ? 'opacity-100 text-blue-500' : 'opacity-0 text-slate-300'}`}>
                <div className="bg-white rounded-full p-0.5">
                  {step === 3 ? (
                    <Spinner className="w-7 h-7 shrink-0 text-blue-500 animate-spin" />
                  ) : (
                    <CheckCircle weight="fill" className="w-7 h-7 shrink-0 text-blue-500" />
                  )}
                </div>
                <span className="font-semibold text-sm text-center">Checking Database</span>
              </div>

              {/* Step 4 (Final) */}
              <div className={`flex flex-col items-center gap-3 w-1/4 transition-opacity duration-500 ease-in-out delay-300 ${step >= 4 ? 'opacity-100' : 'opacity-0'} ${errorRecords.length > 0 ? 'text-rose-600' : 'text-indigo-600'}`}>
                <div className="bg-white rounded-full p-0.5">
                  {step >= 4 && (
                    errorRecords.length > 0 ? (
                      <Warning weight="fill" className="w-7 h-7 shrink-0" />
                    ) : (
                      <CheckCircle weight="fill" className="w-7 h-7 shrink-0" />
                    )
                  )}
                  {step < 4 && <div className="w-7 h-7"></div>}
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-sm text-center">Validation Finished</span>
                  {step === 4 && (
                    <span className={`text-[11px] mt-1 text-center font-medium ${errorRecords.length > 0 ? 'text-rose-600/80' : 'text-indigo-600/80'}`}>
                      Found {validRecords.length} valid rows, {errorRecords.length} errors
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Step 4: Preview Table */}
      {step === 4 && (
        <div className="space-y-4 pt-2">
          
          {/* Validation Errors UI Block */}
          {errorRecords.length > 0 && (
            <div className="bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0">
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

          <div className="bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0">
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
                        <td className="text-right font-mono">₹{record.baseSalary.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                        <td className="text-right font-mono text-emerald-600 font-semibold">₹{record.netSalary.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
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
            <button 
              onClick={startProcessing}
              disabled={validRecords.length === 0 || processing}
              className={`bg-primary text-white px-4 py-2 rounded-sm font-medium text-sm transition-colors inline-flex items-center gap-2 shadow-sm ${(validRecords.length === 0 || processing) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-violet-800'}`}
            >
              <Play weight="fill" className="w-4 h-4" /> 
              {processing ? 'Starting Workers...' : 'Start Payroll Processing'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
