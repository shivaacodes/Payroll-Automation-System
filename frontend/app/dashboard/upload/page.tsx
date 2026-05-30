'use client';

import React, { useState } from 'react';
import { 
  CloudArrowUp, 
  FileCsv, 
  DownloadSimple, 
  CheckCircle, 
  Warning, 
  Spinner,
  Play
} from '@phosphor-icons/react/dist/ssr';
import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import { useUploadState } from '@/context/UploadContext';

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
  const { file, setFile, step, setStep, records, setRecords, rawPreview, setRawPreview } = useUploadState();
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [validationText, setValidationText] = useState('');
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
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        const previewLines = lines.map(l => l.split(','));
        setRawPreview(previewLines);
      }
    };
    reader.readAsText(uploadedFile);
  };

  const processUpload = async () => {
    if (!file) return;
    setStep(2); 
    setValidationText('Parsing CSV structure...'); 
    setUploadError(null);
    setRawPreview(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }
      
      setRecords(data.records || []);
      
      setStep(3);
      setValidationText('Cross-referencing Employee Database...');
      setTimeout(() => {
        setValidationText('');
        setStep(4); 
      }, 1000);
    } catch (err: any) {
      setUploadError(err.message);
      setStep(1);
    }
  };

  const validRecords = records.filter(r => r.status === 'Valid');
  const errorRecords = records.filter(r => r.status === 'Error');

  const startProcessing = async () => {
    if (validRecords.length === 0) return;
    setProcessing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: validRecords })
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          router.push('/dashboard/jobs');
        }, 2000); 
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
        description={`${validRecords.length} salary slips are being generated and emailed. (Note: Please check your Spam/Junk folder if you don't see it).`}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Upload Payroll</h2>
        </div>
        
        {/* Evaluator Demo Banner */}
        <div className="flex flex-col md:flex-row bg-indigo-50 border border-indigo-200 rounded-sm py-1.5 px-3 items-start md:items-center justify-between gap-3 shadow-sm w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-600 p-1 rounded-full">
              <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-900 leading-tight">Evaluator Demo Data</p>
              <p className="text-[10px] text-indigo-700 leading-tight">50 records. Triggers SendGrid rate-limit safeguard.</p>
            </div>
          </div>
          <a 
            href="/demo_payroll.csv"
            download="demo_payroll.csv"
            className="shrink-0 font-medium text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-sm hover:bg-indigo-100 transition-colors text-xs inline-flex items-center gap-1.5 shadow-sm"
          >
            Download
          </a>
        </div>
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
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-50 shadow-sm border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-all text-emerald-500">
                    <FileCsv className="w-8 h-8" weight="fill" />
                  </div>
                  <p className="text-base font-semibold text-emerald-700">{file.name}</p>
                  <p className="text-sm text-emerald-600 mt-1">{(file.size / 1024).toFixed(1)} KB • <span className="font-medium underline">Click to change file</span></p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-primary/30 group-hover:text-primary transition-all text-slate-400">
                    <CloudArrowUp className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-slate-900">Drag and drop your CSV here</p>
                  <p className="text-sm text-slate-500 mt-1">or <span className="text-primary font-medium hover:underline">browse files</span></p>
                </>
              )}
            </label>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 px-2">
            <span>Max file size: 10MB</span>
          </div>
          
          {/* Raw CSV Preview */}
          {rawPreview && (
            <div className="bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0 mt-6 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileCsv className="w-4 h-4 text-slate-500" /> Raw CSV Preview
                </h3>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => {
                      setFile(null);
                      setRawPreview(null);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-xs hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={processUpload}
                    className="bg-primary text-white px-3 py-1.5 rounded-sm font-medium text-xs transition-colors shadow-sm hover:bg-violet-800"
                  >
                    Validate Data
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
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
            </div>
          )}

        </div>
      )}

      {/* Minimalist Validation Status Bar */}
      {(step === 2 || step === 3) && (
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 mt-6 mb-4 flex items-center justify-between shadow-sm mx-4 md:mx-0">
          <div className="flex items-center gap-3 text-slate-700">
            <Spinner className="w-5 h-5 animate-spin text-primary" />
            <span className="font-medium text-sm">{validationText}</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {step === 2 ? '[1/2]' : '[2/2]'} Processing
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
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <FileCsv className="w-4 h-4 text-slate-500" /> Validation Preview Table
                </h3>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{validRecords.length} valid</span>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => { setStep(1); setFile(null); setRecords([]); }} 
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-xs hover:bg-slate-50 transition-colors shadow-sm flex-1 md:flex-none text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={startProcessing}
                  disabled={validRecords.length === 0 || processing}
                  className={`bg-primary text-white px-3 py-1.5 rounded-sm font-medium text-xs transition-colors inline-flex justify-center items-center gap-1.5 shadow-sm flex-1 md:flex-none ${(validRecords.length === 0 || processing) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-violet-800'}`}
                >
                  {processing ? <Spinner className="w-3.5 h-3.5 animate-spin" /> : <Play weight="fill" className="w-3.5 h-3.5" />}
                  {processing ? 'Starting...' : 'Process Payroll'}
                </button>
              </div>
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

          </div>
      )}

    </div>
  );
}
