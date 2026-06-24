'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Spinner, DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import { API_BASE_URL } from '@/lib/api';

type ComplianceRecord = {
  ID: number;
  EmployeeID: string;
  MonthYear: string;
  PFAmount: number;
  ESIAmount: number;
  ProfessionalTax: number;
};

export default function CompliancePage() {
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/compliance`)
      .then(res => res.json())
      .then(data => setRecords(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" weight="fill" />
            Statutory Compliance
          </h2>
          <p className="text-sm text-slate-500 mt-1">Ledger for PF, ESI, and Professional Tax deductions.</p>
        </div>
      </div>

      <div className="bg-card border-y md:border border-border md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full table-dense text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Employee ID</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Month</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-right">Provident Fund (PF)</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-right">ESI Amount</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-right">Professional Tax (PT)</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-center">Action</th>
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
                    No statutory deductions logged yet.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.ID} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{rec.EmployeeID}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rec.MonthYear}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{rec.PFAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{rec.ESIAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{rec.ProfessionalTax.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary hover:text-violet-800 transition-colors" title="Download Form 16/Challan">
                        <DownloadSimple className="w-5 h-5 inline-block" />
                      </button>
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
