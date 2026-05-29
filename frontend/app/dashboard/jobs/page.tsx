'use client';

import React, { useState, useEffect } from 'react';
import { 
  TerminalWindow,
  Trash
} from '@phosphor-icons/react/dist/ssr';
import JobRow, { JobData } from '@/components/features/JobRow';
import Toast from '@/components/ui/Toast';

export default function ProcessingJobs() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    if (expandedJob === id) setExpandedJob(null);
    else setExpandedJob(id);
  };

  const [liveJobs, setLiveJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const executeClearAll = async () => {
    setShowClearConfirm(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/jobs`, { method: 'DELETE' });
      if (res.ok) {
        setLiveJobs([]);
        setToastMsg('All job history cleared.');
      }
    } catch (err) {
      console.error('Failed to clear jobs');
    }
  };

  const handleDelete = async (batchId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}`}/api/jobs/${batchId}`, { method: 'DELETE' });
      if (res.ok) {
        setLiveJobs(prev => prev.filter(j => j.batchId !== batchId));
        setToastMsg(`Batch ${batchId} deleted.`);
      }
    } catch (err) {
      console.error('Failed to delete job');
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/jobs`);
        if (res.ok) {
          const data = await res.json();
          // Transform backend JobBatch into frontend JobData
          const formattedJobs: JobData[] = data.map((b: any) => {
            // Go/GORM returns snake_case: completed_count, failed_count, total_records
            const completed = b.completed_count ?? b.completedCount ?? 0;
            const failed    = b.failed_count   ?? b.failedCount   ?? 0;
            const total     = b.total_records  ?? b.totalRecords  ?? 1;
            const startedAt = b.created_at     ?? b.startedAt;

            const isDone = (completed + failed) >= total;
            let status: JobData['status'] = 'active';
            let progressText = 'Processing...';

            if (isDone) {
              if (failed === 0) {
                status = 'completed';
                progressText = 'Done';
              } else if (completed === 0) {
                status = 'failed';
                progressText = 'Failed completely';
              } else {
                status = 'failed';
                progressText = 'Partial Failure';
              }
            } else {
              const pct = Math.round(((completed + failed) / Math.max(1, total)) * 100);
              progressText = `Generating PDFs & Emails (${pct}%)`;
            }

            return {
              id: b.id,
              batchId: b.id,
              totalRecords: total,
              status: status,
              completedCount: completed,
              failedCount: failed,
              startedAt: new Date(startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              progressText: progressText,
              logs: (
                <div className="text-slate-400">
                  {isDone ?
                    <div className={failed > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      [SYSTEM] Batch completed. {completed} success, {failed} failed.
                    </div>
                  :
                    <div className="text-emerald-400 animate-pulse">
                      [SYSTEM] Background workers processing {total - (completed + failed)} remaining records...
                    </div>
                  }
                </div>
              )
            };
          });
          setLiveJobs(formattedJobs);
        }
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 2500); // Poll every 2.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">

      <Toast
        show={!!toastMsg}
        onClose={() => setToastMsg('')}
        title="Success"
        description={toastMsg}
        variant="success"
      />

      <Toast
        show={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Job History?"
        description="Are you sure you want to clear all job history? This cannot be undone."
        variant="confirm"
        onConfirm={executeClearAll}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Processing Jobs</h2>
        </div>
        {liveJobs.length > 0 && (
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-rose-200 rounded-sm text-sm font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors shadow-sm"
          >
            <Trash className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

        {/* Live Terminal Component */}
        <div className="bg-slate-900 rounded-sm shadow-xl border border-slate-700 overflow-hidden mt-6">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2 text-xs font-mono">
            <TerminalWindow className="w-4 h-4" />
            <span>worker_node_01 / active</span>
          </div>
          <span className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live
          </span>
        </div>
                <div className="p-3 md:p-5 h-64 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
            <div className="flex items-start gap-4 text-slate-500 italic">
            {liveJobs.some(j => j.status === 'active') ? (
              <span className="text-emerald-400 animate-pulse">Processing active batches in background threads...</span>
            ) : (
              <span>Awaiting active batch process...</span>
            )}
          </div>
        </div>
      </div>


        {/* Job History Table */}
        <div className="mt-8 bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm flex flex-col -mx-4 md:mx-0">
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
              ) : liveJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    <p className="font-semibold text-slate-700">No jobs found.</p>
                    <p className="text-xs mt-1">Upload a CSV to dispatch tasks to background workers.</p>
                  </td>
                </tr>
              ) : (
                liveJobs.map(job => (
                  <JobRow 
                    key={job.id} 
                    job={job} 
                    isExpanded={expandedJob === job.id} 
                    onToggle={() => toggleRow(job.id)}
                    onDelete={() => handleDelete(job.id)}
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
