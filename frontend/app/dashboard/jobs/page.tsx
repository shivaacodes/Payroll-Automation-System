'use client';

import React, { useState } from 'react';
import { Trash, TerminalWindow } from '@phosphor-icons/react/dist/ssr';
import JobRow from '@/components/features/JobRow';
import Toast from '@/components/ui/Toast';
import { useJobs } from '@/hooks/useJobs';

export default function ProcessingJobs() {
  const { jobs, loading, isClearing, clearHistory, deleteJob } = useJobs();
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    if (expandedJob === id) setExpandedJob(null);
    else setExpandedJob(id);
  };

  return (
    <div className="space-y-6">

      <Toast
        show={isClearing}
        onClose={() => {}}
        title="Processing"
        description="Clearing job history..."
        variant="success"
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Processing Jobs</h2>
        </div>
        {jobs.length > 0 && (
          <button 
            onClick={clearHistory}
            disabled={isClearing}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-200 rounded-sm text-sm font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

        {/* Job History Table */}
        <div className="mt-6 bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm flex flex-col -mx-4 md:mx-0">
          <div className="overflow-x-auto">
          <table className="w-full table-dense">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th>Batch ID</th>
                <th className="text-center">Total Records</th>
                <th>Processing</th>
                <th className="text-center">Completed</th>
                <th className="text-center">Failed</th>
                <th className="text-center">Started At</th>
                <th className="text-right">Retry Failed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 animate-pulse">
                    Connecting to Worker Nodes...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    <p className="font-semibold text-slate-700">No jobs found.</p>
                    <p className="text-xs mt-1">Upload a CSV to dispatch tasks to background workers.</p>
                  </td>
                </tr>
              ) : (
                jobs.map(job => (
                  <JobRow 
                    key={job.id} 
                    job={job} 
                    isExpanded={expandedJob === job.id} 
                    onToggle={() => toggleRow(job.id)}
                    onDelete={() => deleteJob(job.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
