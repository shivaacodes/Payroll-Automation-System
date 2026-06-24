'use client';

import React, { useState, useEffect } from 'react';
import { CurrencyCircleDollar, Spinner } from '@phosphor-icons/react/dist/ssr';
import { API_BASE_URL } from '@/lib/api';

type CommissionRecord = {
  ID: number;
  EmployeeID: string;
  MonthYear: string;
  VehicleSales: number;
  AccessoriesSales: number;
  EfficiencyBonus: number;
  TotalCommission: number;
};

export default function CommissionsPage() {
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/commissions`)
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
            <CurrencyCircleDollar className="w-6 h-6 text-primary" weight="fill" />
            Commissions & Incentives
          </h2>
          <p className="text-sm text-slate-500 mt-1">Vehicle delivery bonuses, F&I, and efficiency payouts.</p>
        </div>
      </div>

      <div className="bg-card border-y md:border border-border md:rounded-sm shadow-sm overflow-hidden -mx-4 md:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full table-dense text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Employee ID</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Month</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-center">Vehicle Sales</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-right">Accessories</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 text-right">Efficiency Bonus</th>
                <th className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-500 text-right">Total Payout</th>
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
                    No commission data calculated yet.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.ID} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{rec.EmployeeID}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{rec.MonthYear}</td>
                    <td className="px-4 py-3 text-center font-mono">{rec.VehicleSales} units</td>
                    <td className="px-4 py-3 text-right font-mono">₹{rec.AccessoriesSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="px-4 py-3 text-right font-mono">₹{rec.EfficiencyBonus.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600 font-bold">₹{rec.TotalCommission.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
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
