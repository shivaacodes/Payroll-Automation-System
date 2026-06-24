'use client';

import React, { useState } from 'react';
import { Eye, DownloadSimple, PaperPlaneRight, FileText, Spinner, Trash } from '@phosphor-icons/react/dist/ssr';
import Toast from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import { useReports } from '@/hooks/useReports';
import { API_BASE_URL } from '@/lib/api';

export default function ReportsPage() {
  const { reports, loading, resendingId, resendWhatsApp, deleteReport, clearAllReports } = useReports();
  const [toastMsg, setToastMsg] = useState('');
  const [toastVar, setToastVar] = useState<'success' | 'danger'>('success');
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleResend = async (id: number) => {
    try {
      await resendWhatsApp(id);
      setToastVar('success');
      setToastMsg('Payslip successfully resent via WhatsApp.');
    } catch (err) {
      setToastVar('danger');
      setToastMsg('Failed to resend payslip.');
    }
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await deleteReport(id);
      setToastVar('success');
      setToastMsg('Report deleted.');
    } catch (err) {
      setToastVar('danger');
      setToastMsg('Failed to delete report.');
    }
  };

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = async () => {
    setShowClearConfirm(false);
    try {
      await clearAllReports();
      setToastVar('success');
      setToastMsg('All reports cleared.');
    } catch (err) {
      setToastVar('danger');
      setToastMsg('Failed to clear reports.');
    }
  };

  const groupedReports = reports.reduce((acc, report) => {
    const month = report.monthYear || 'Unknown';
    if (!acc[month]) acc[month] = [];
    acc[month].push(report);
    return acc;
  }, {} as Record<string, typeof reports>);

  return (
    <div className="space-y-6">
      <Toast
        show={!!toastMsg}
        onClose={() => setToastMsg('')}
        title={toastVar === 'success' ? 'Success' : 'Error'}
        description={toastMsg}
        variant={toastVar}
      />
      <Toast
        show={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        title="Delete Report?"
        description="Are you sure you want to permanently delete this report?"
        variant="confirm"
        onConfirm={confirmDelete}
      />
      <Toast
        show={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Reports?"
        description="Are you sure you want to clear ALL reports? This action cannot be undone."
        variant="confirm"
        onConfirm={confirmClearAll}
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

      {/* Grouped Reports Tables */}
      <div className="space-y-8">
        {loading ? (
          <div className="bg-card border border-border rounded-sm shadow-sm p-8 text-center text-slate-500 animate-pulse">
            Loading historical data...
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-card border border-border rounded-sm shadow-sm p-12 text-center text-slate-500">
            <div className="flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-300 mb-3" weight="light" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No payslips generated yet.</p>
              <p className="text-xs mt-1 max-w-sm text-center">Run a payroll batch in the Upload section to generate reports.</p>
            </div>
          </div>
        ) : (
          Object.keys(groupedReports).map((month) => (
            <div key={month} className="bg-card border-y md:border border-border md:rounded-sm shadow-sm flex flex-col -mx-4 md:mx-0 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-border px-4 py-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{month}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-dense">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedReports[month].map(report => (
                      <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <td className="font-medium text-slate-900 dark:text-slate-100">{report.name} <span className="text-xs text-slate-400 block font-normal">{report.employeeId}</span></td>
                        <td className="text-slate-900 dark:text-slate-100 font-medium">₹ {report.netSalary.toLocaleString('en-IN')}</td>
                        <td><Badge status={report.status === 'completed' ? 'Sent' : (report.status.charAt(0).toUpperCase() + report.status.slice(1))} variant={report.status === 'completed' ? 'success' : undefined} /></td>
                        <td>
                          <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <a 
                              href={`${API_BASE_URL}/api/reports/${report.id}/pdf?action=preview`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Preview PDF (Requires Password)"
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-red-50 dark:hover:bg-red-950/30 rounded-sm transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </a>
                            <a 
                              href={`${API_BASE_URL}/api/reports/${report.id}/pdf?action=download`}
                              title="Download PDF"
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-sm transition-colors"
                            >
                              <DownloadSimple className="w-5 h-5" />
                            </a>
                            <button 
                              onClick={() => handleResend(report.id)}
                              disabled={resendingId === report.id}
                              title="Resend WhatsApp"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-sm transition-colors disabled:opacity-50"
                            >
                              {resendingId === report.id ? <Spinner className="w-5 h-5 animate-spin text-blue-600" /> : <PaperPlaneRight className="w-5 h-5" />}
                            </button>
                            <button 
                              onClick={() => handleDelete(report.id)}
                              title="Delete Report"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-sm transition-colors"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
