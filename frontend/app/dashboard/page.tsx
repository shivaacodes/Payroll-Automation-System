'use client';

import React, { useState, useEffect } from 'react';
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
  const [stats, setStats] = useState({
    totalEmployees: 0,
    emailsSent: 0,
    failedDeliveries: 0,
    currentBatch: '-',
    recentJobs: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8080/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // Poll every 5 seconds to keep it fresh
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
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
          value={loading ? "..." : stats.totalEmployees.toString()} 
          subtitle="Active roster" 
          icon={Users} 
        />
        <StatCard 
          title="Current Batch" 
          value={loading ? "..." : stats.currentBatch.replace('BATCH-', '')} 
          subtitle={stats.currentBatch === '-' ? 'No active batch' : 'Latest run'} 
          icon={CircleNotch} 
          valueColor={stats.currentBatch !== '-' ? 'text-blue-600' : 'text-slate-400'}
        />
        <StatCard 
          title="Emails Sent" 
          value={loading ? "..." : stats.emailsSent.toString()} 
          subtitle="All time" 
          icon={EnvelopeSimple} 
        />
        <StatCard 
          title="Failed Deliveries" 
          value={loading ? "..." : stats.failedDeliveries.toString()} 
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500 animate-pulse">
                      Loading data...
                    </td>
                  </tr>
                ) : stats.recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p>No recent jobs found.</p>
                    </td>
                  </tr>
                ) : (
                  stats.recentJobs.map((job) => {
                    // Normalize snake_case to camelCase depending on what Go returns
                    const completed = job.completed_count ?? job.completedCount ?? 0;
                    const failed = job.failed_count ?? job.failedCount ?? 0;
                    const total = job.total_records ?? job.totalRecords ?? 1;
                    const isDone = (completed + failed) >= total;
                    
                    let statusLabel = 'Processing';
                    let statusColor = 'bg-blue-100 text-blue-700 border-blue-200';
                    
                    if (isDone) {
                      if (failed === 0) {
                        statusLabel = 'Success';
                        statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                      } else {
                        statusLabel = 'Failed';
                        statusColor = 'bg-rose-100 text-rose-700 border-rose-200';
                      }
                    }

                    return (
                      <tr key={job.id}>
                        <td className="font-mono text-xs">{job.id}</td>
                        <td className="text-slate-500">{new Date(job.created_at || job.startedAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="font-medium text-emerald-600">{completed}</td>
                        <td className={failed > 0 ? 'font-bold text-rose-600' : 'text-slate-400'}>{failed}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
