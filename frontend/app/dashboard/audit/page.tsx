import React from 'react';
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr';

export default function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Security Audit Logs</h2>
      </div>
      <div className="bg-card border border-border rounded-sm p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-base font-medium text-slate-900 dark:text-white">Compliance & Tracking</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md">All administrative payroll actions are strictly logged. Export capabilities will be unlocked by the IT Director.</p>
      </div>
    </div>
  );
}
