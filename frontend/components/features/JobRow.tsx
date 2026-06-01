import React from 'react';
import { 
  CheckCircle,
  WarningCircle,
  ArrowClockwise,
  CircleNotch,
  CaretDown,
  CaretRight,
  Trash
} from '@phosphor-icons/react/dist/ssr';

import { Job } from '@/hooks/useJobs';

interface JobRowProps {
  job: Job;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function JobRow({ job, isExpanded, onToggle, onDelete }: JobRowProps) {
  return (
    <>
      <tr className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={onToggle}>
        <td className="text-center">
          {isExpanded ? <CaretDown className="w-4 h-4 text-slate-400" /> : <CaretRight className="w-4 h-4 text-slate-400" />}
        </td>
        <td className={`font-mono text-xs ${job.status === 'active' ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
          {job.batchId}
        </td>
        <td className="text-center">{job.totalRecords}</td>
        <td>
          {job.status === 'active' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100">
              <CircleNotch className="w-3 h-3 animate-spin" />
              {job.progressText}
            </span>
          )}
          {job.status === 'failed' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-100">
              <WarningCircle weight="fill" className="w-3 h-3" />
              Partial Failure
            </span>
          )}
          {job.status === 'completed' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100">
              <CheckCircle weight="fill" className="w-3 h-3" />
              Completed
            </span>
          )}
        </td>
        <td className="text-center font-semibold text-emerald-600">{job.completedCount}</td>
        <td className={`text-center ${job.failedCount > 0 ? 'font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-sm' : 'text-slate-400'}`}>
          {job.failedCount}
        </td>
        <td className="text-center text-slate-500 text-xs">{job.startedAt}</td>
        <td className="text-right">
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-colors"
              title="Delete Batch"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      
      {/* Job Details Drawer */}
      {isExpanded && (
        <tr className="bg-slate-50 border-b border-slate-200">
          <td colSpan={8} className="p-0">
            <div className="px-12 py-4 space-y-4">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Job Details ({job.status === 'active' ? 'Live' : job.status})
              </h4>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-3 rounded-sm shadow-sm">
                  <span className="text-xs text-slate-500 block mb-1">Processed Employees</span>
                  <span className="text-lg font-mono text-slate-900">{job.completedCount} / {job.totalRecords}</span>
                </div>
                <div className={`bg-white border p-3 rounded-sm shadow-sm ${job.failedCount > 0 ? 'border-rose-200' : 'border-slate-200'}`}>
                  <span className={`text-xs block mb-1 ${job.failedCount > 0 ? 'text-rose-500' : 'text-slate-500'}`}>Failed Emails</span>
                  <span className={`text-lg font-mono ${job.failedCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{job.failedCount}</span>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-sm shadow-sm flex items-center">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">System Status</span>
                    {job.status !== 'active' ? (
                      <span className={`text-sm font-medium ${job.failedCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Batch completed: {job.completedCount} successful, {job.failedCount} failed.
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-blue-600 flex items-center gap-2">
                        <CircleNotch className="w-4 h-4 animate-spin" />
                        Processing {job.totalRecords - (job.completedCount + job.failedCount)} remaining records...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
