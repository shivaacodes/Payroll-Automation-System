'use client';

import React, { useState, useEffect } from 'react';
import { Certificate, Spinner, WarningCircle, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { API_BASE_URL } from '@/lib/api';

type CertificationRecord = {
  ID: number;
  EmployeeID: string;
  CertificationName: string;
  Provider: string;
  IssueDate: string;
  ValidUntil: string;
};

export default function CertificationsPage() {
  const [records, setRecords] = useState<CertificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/certifications`)
      .then(res => res.json())
      .then(data => setRecords(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isExpiringSoon = (dateString: string) => {
    const validUntil = new Date(dateString);
    const now = new Date();
    const diffTime = validUntil.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Certificate className="w-6 h-6 text-primary" weight="fill" />
            Technician Certifications
          </h2>
          <p className="text-sm text-slate-500 mt-1">Track Global Toyota Standards (Pro-Technician, Master Diagnostic).</p>
        </div>
      </div>

      <div className="bg-card border-y md:border border-border md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full table-dense text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Employee ID</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Certification</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Provider</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Issue Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Valid Until</th>
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
                    No certification records tracked yet.
                  </td>
                </tr>
              ) : (
                records.map((rec) => {
                  const expired = isExpired(rec.ValidUntil);
                  const expiringSoon = isExpiringSoon(rec.ValidUntil);

                  return (
                    <tr key={rec.ID} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{rec.EmployeeID}</td>
                      <td className="px-4 py-3 font-medium text-indigo-700 dark:text-indigo-400">{rec.CertificationName}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rec.Provider}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(rec.IssueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(rec.ValidUntil).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">
                        {expired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-medium">
                            <WarningCircle weight="fill" /> Expired
                          </span>
                        ) : expiringSoon ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                            <WarningCircle weight="fill" /> Expiring Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                            <CheckCircle weight="fill" /> Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
