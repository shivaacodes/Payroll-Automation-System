'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CalendarCheck, CloudArrowUp, Spinner, FileCsv, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { API_BASE_URL } from '@/lib/api';
import Toast from '@/components/ui/Toast';

type AttendanceRecord = {
  ID: number;
  EmployeeID: string;
  MonthYear: string;
  PresentDays: number;
  AbsentDays: number;
  LeaveDays: number;
  Status: string;
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/attendance`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleBulkSync = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/attendance/bulk`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Failed to sync biometric data');
      
      const data = await res.json();
      setToastMsg(`Successfully synced ${data.count} biometric records concurrently!`);
      setTimeout(() => setToastMsg(''), 4000);
      fetchRecords();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSyncing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        show={!!toastMsg}
        onClose={() => setToastMsg('')}
        title="Biometric Sync Complete"
        description={toastMsg}
        variant="success"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-primary" weight="fill" />
            Attendance & Leave Sync
          </h2>
          <p className="text-sm text-slate-500 mt-1">Biometric punch data ingested concurrently via Go Worker Pool.</p>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleBulkSync} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isSyncing}
            className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-violet-800 transition-colors inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSyncing ? <Spinner className="w-4 h-4 animate-spin" /> : <CloudArrowUp className="w-4 h-4" weight="bold" />}
            {isSyncing ? 'Syncing...' : 'Bulk Sync Biometric Data'}
          </button>
        </div>
      </div>

      <div className="bg-card border-y md:border border-border md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full table-dense text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Employee ID</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Month</th>
                <th className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-500 text-center">Present</th>
                <th className="px-4 py-3 font-semibold text-rose-600 dark:text-rose-500 text-center">Absent</th>
                <th className="px-4 py-3 font-semibold text-amber-600 dark:text-amber-500 text-center">Leave</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    <Spinner className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No biometric data synced yet.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.ID} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{rec.EmployeeID}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rec.MonthYear}</td>
                    <td className="px-4 py-3 text-center font-mono text-emerald-600">{rec.PresentDays}</td>
                    <td className="px-4 py-3 text-center font-mono text-rose-600">{rec.AbsentDays}</td>
                    <td className="px-4 py-3 text-center font-mono text-amber-600">{rec.LeaveDays}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                        <CheckCircle weight="fill" /> {rec.Status}
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
  );
}
