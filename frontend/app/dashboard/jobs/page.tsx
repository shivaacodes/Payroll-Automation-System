'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlass, 
  Funnel,
  TerminalWindow
} from '@phosphor-icons/react/dist/ssr';
import JobRow, { JobData } from '@/components/features/JobRow';

export default function ProcessingJobs() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    if (expandedJob === id) setExpandedJob(null);
    else setExpandedJob(id);
  };

  const mockJobs: JobData[] = [
    {
      id: 'job-1',
      batchId: 'BATCH-2026-05B',
      totalRecords: 124,
      status: 'active',
      completedCount: 80,
      failedCount: 0,
      startedAt: '14:02:41',
      progressText: 'Generating PDFs (65%)',
      logs: (
        <div className="text-emerald-400">
          <div>[14:02:45] PDF Gen: EMP-080 ... OK</div>
          <div>[14:02:45] Email Dispatch: EMP-079 ... OK</div>
          <div>[14:02:46] PDF Gen: EMP-081 ... Processing</div>
        </div>
      )
    },
    {
      id: 'job-2',
      batchId: 'BATCH-2026-04B',
      totalRecords: 118,
      status: 'failed',
      completedCount: 116,
      failedCount: 2,
      startedAt: 'Yesterday',
      logs: (
        <div className="text-rose-400">
          <div>[09:12:01] SMTP Error: Timeout connecting to smtp.provider.com (EMP-112)</div>
          <div>[09:12:05] SMTP Error: Timeout connecting to smtp.provider.com (EMP-115)</div>
          <div className="text-emerald-400">[09:15:00] Batch halted. Waiting for manual retry.</div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Processing Jobs</h2>
          <p className="text-sm text-slate-500">Live monitoring of PDF generation and email dispatch queues.</p>
        </div>
      </div>

      {/* Active Pipeline Terminal */}
      <div className="bg-slate-900 rounded-sm overflow-hidden flex flex-col shadow-sm border border-slate-800">
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2 text-xs font-mono">
            <TerminalWindow className="w-4 h-4" />
            <span>worker_node_01 / active</span>
          </div>
          <span className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
          </span>
        </div>
        
        <div className="p-5 font-mono text-xs md:text-sm text-slate-300 space-y-3">
          <div className="flex items-start gap-4 text-slate-500 italic">
            <span>Awaiting active batch process...</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Batch ID..." 
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Funnel className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
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
              {mockJobs.map(job => (
                <JobRow 
                  key={job.id} 
                  job={job} 
                  isExpanded={expandedJob === job.id} 
                  onToggle={() => toggleRow(job.id)} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
