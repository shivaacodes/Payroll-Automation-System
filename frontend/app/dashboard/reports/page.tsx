'use client';

import React, { useState, useEffect } from 'react';
import { Eye, DownloadSimple, PaperPlaneRight, FileText, CheckCircle, Warning, Clock, Spinner, Trash } from '@phosphor-icons/react/dist/ssr';
import Toast from '@/components/ui/Toast';

interface Report {
  id: number;
  employeeId: string;
  name: string;
  monthYear: string;
  netSalary: number;
  status: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVar, setToastVar] = useState<'success' | 'danger'>('success');
  const [resendingId, setResendingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/reports`);
        if (res.ok) {
          const data = await res.json();
          setReports(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleResend = async (id: number) => {
    setResendingId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/reports/${id}/resend`, { method: 'POST' });
      if (res.ok) {
        setToastVar('success');
        setToastMsg('Payslip successfully resent via email.');
      } else {
        setToastVar('danger');
        setToastMsg('Failed to resend payslip.');
      }
    } catch (err) {
      setToastVar('danger');
      setToastMsg('Network error occurred.');
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
        setToastVar('success');
        setToastMsg('Report deleted.');
      } else {
        setToastVar('danger');
        setToastMsg('Failed to delete report.');
      }
    } catch (err) {
      setToastVar('danger');
      setToastMsg('Network error.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL reports? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/reports`, { method: 'DELETE' });
      if (res.ok) {
        setReports([]);
        setToastVar('success');
        setToastMsg('All reports cleared.');
      } else {
        setToastVar('danger');
        setToastMsg('Failed to clear reports.');
      }
    } catch (err) {
      setToastVar('danger');
      setToastMsg('Network error.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle className="w-3.5 h-3.5" weight="fill" /> Sent</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200"><Warning className="w-3.5 h-3.5" weight="fill" /> Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3.5 h-3.5" weight="fill" /> Processing</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        show={!!toastMsg}
        onClose={() => setToastMsg('')}
        title={toastVar === 'success' ? 'Success' : 'Error'}
        description={toastMsg}
        variant={toastVar}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Payslip Reports</h2>
        </div>
        {reports.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-3 py-1.5 rounded-sm transition-colors border border-rose-200 flex items-center gap-1.5 shadow-sm"
          >
            <Trash className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm flex flex-col -mx-4 md:mx-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-dense">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Month</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 animate-pulse">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-slate-300 mb-3" weight="light" />
                      <p className="font-semibold text-slate-700">No payslips generated yet.</p>
                      <p className="text-xs mt-1 max-w-sm text-center">Run a payroll batch in the Upload section to generate reports.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="font-medium text-slate-900">{report.name} <span className="text-xs text-slate-400 block font-normal">{report.employeeId}</span></td>
                    <td className="text-slate-600 uppercase text-xs font-semibold tracking-wider">{report.monthYear}</td>
                    <td className="text-slate-900 font-medium">₹ {report.netSalary.toLocaleString('en-IN')}</td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/reports/${report.id}/pdf?action=preview`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview PDF (Requires Password)"
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-violet-50 rounded-sm transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <a 
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/reports/${report.id}/pdf?action=download`}
                          title="Download PDF"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-sm transition-colors"
                        >
                          <DownloadSimple className="w-5 h-5" />
                        </a>
                        <button 
                          onClick={() => handleResend(report.id)}
                          disabled={resendingId === report.id}
                          title="Resend Email"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors disabled:opacity-50"
                        >
                          {resendingId === report.id ? <Spinner className="w-5 h-5 animate-spin text-blue-600" /> : <PaperPlaneRight className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleDelete(report.id)}
                          title="Delete Report"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
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
