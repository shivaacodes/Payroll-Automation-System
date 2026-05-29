import { useState, useEffect, useCallback } from 'react';
import { fetchJSON, fetchAPI } from '@/lib/api';

export interface Job {
  id: string;
  batchId: string;
  totalRecords: number;
  status: 'active' | 'failed' | 'completed';
  completedCount: number;
  failedCount: number;
  startedAt: string;
  progressText: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchJSON('/api/jobs');
      const formattedJobs = (data || []).map((b: any): Job => {
        const completed = b.completed_count ?? b.completedCount ?? 0;
        const failed    = b.failed_count   ?? b.failedCount   ?? 0;
        const total     = b.total_records  ?? b.totalRecords  ?? 1;
        const startedAt = b.created_at     ?? b.startedAt;

        const isDone = (completed + failed) >= total;
        let status: 'active' | 'failed' | 'completed' = 'active';
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
          status,
          completedCount: completed,
          failedCount: failed,
          startedAt: new Date(startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          progressText,
        };
      });

      setJobs(formattedJobs);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 2500);
    return () => clearInterval(interval);
  }, [loadJobs]);

  const deleteJob = async (id: string) => {
    setIsDeleting(id);
    try {
      await fetchAPI(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs(prev => prev.filter(j => j.id !== id));
      return true;
    } catch (err: any) {
      throw err;
    } finally {
      setIsDeleting(null);
    }
  };

  const clearHistory = async () => {
    setIsClearing(true);
    try {
      await fetchAPI('/api/jobs', { method: 'DELETE' });
      setJobs([]);
      return true;
    } catch (err: any) {
      throw err;
    } finally {
      setIsClearing(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    isDeleting,
    isClearing,
    deleteJob,
    clearHistory,
    refresh: loadJobs,
  };
}
