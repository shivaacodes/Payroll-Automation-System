import React from 'react';
import { 
  Users, 
  CircleNotch, 
  EnvelopeSimple,
  ArrowRight,
  Database
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">System overview and current operational metrics.</p>
        </div>
        <Link 
          href="/dashboard/upload" 
          className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-violet-800 transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          New Payroll Run <ArrowRight weight="bold" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Employees" 
          value="0" 
          subtitle="Active roster" 
          icon={Users} 
        />
        <StatCard 
          title="Current Batch" 
          value="-" 
          subtitle="No active batch" 
          icon={CircleNotch} 
          valueColor="text-slate-400"
        />
        <StatCard 
          title="Emails Sent" 
          value="0" 
          subtitle="Year to date" 
          icon={EnvelopeSimple} 
        />
        <StatCard 
          title="Failed Deliveries" 
          value="0" 
          subtitle="Requires attention" 
          icon={Database} 
          iconColor="text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Recent Jobs Table */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-800">Recent Jobs</h3>
            <Link href="/dashboard/jobs" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-dense">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Month</th>
                  <th>Status</th>
                  <th>Completed</th>
                  <th>Failed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p>No recent jobs found.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
