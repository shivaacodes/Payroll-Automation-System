import React from 'react';
import { Certificate } from '@phosphor-icons/react/dist/ssr';

export default function CertificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Technician Certifications</h2>
      </div>
      <div className="bg-card border border-border rounded-sm p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <Certificate className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-base font-medium text-slate-900 dark:text-white">Global Toyota Standards</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md">Track Pro-Technician and Diagnostic Master Technician certifications that impact salary tiering.</p>
      </div>
    </div>
  );
}
