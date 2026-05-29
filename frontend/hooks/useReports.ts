import { useState, useEffect, useCallback } from 'react';
import { fetchJSON, fetchAPI } from '@/lib/api';

export interface Report {
  id: number;
  employeeId: string;
  name: string;
  monthYear: string;
  netSalary: number;
  status: string;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchJSON('/api/reports');
      setReports(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const resendEmail = async (id: number) => {
    setResendingId(id);
    try {
      await fetchAPI(`/api/reports/${id}/resend`, { method: 'POST' });
      return true;
    } catch (err: any) {
      throw err;
    } finally {
      setResendingId(null);
    }
  };

  const deleteReport = async (id: number) => {
    try {
      await fetchAPI(`/api/reports/${id}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const clearAllReports = async () => {
    try {
      await fetchAPI('/api/reports', { method: 'DELETE' });
      setReports([]);
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    resendingId,
    resendEmail,
    deleteReport,
    clearAllReports,
    refresh: loadReports,
  };
}
