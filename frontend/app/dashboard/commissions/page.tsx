import React from 'react';
import { CurrencyCircleDollar } from '@phosphor-icons/react/dist/ssr';

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Commissions & Incentives</h2>
      </div>
      <div className="bg-card border border-border rounded-sm p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <CurrencyCircleDollar className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-base font-medium text-slate-900 dark:text-white">Sales & Service Targets</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md">Vehicle delivery bonuses, finance & insurance (F&I) commissions, and technician efficiency payouts are calculated here.</p>
      </div>
    </div>
  );
}
