import { useState, useEffect, useCallback } from 'react';
import { fetchJSON, fetchAPI } from '@/lib/api';

export interface Employee {
  ID: number;
  EmployeeID: string;
  Name: string;
  Email: string;
  Designation: string;
  DOBYear: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchJSON('/api/employees');
      setEmployees(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const addEmployee = async (employeeData: Employee) => {
    try {
      const data = await fetchJSON('/api/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      setEmployees(prev => [...prev, data]);
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      await fetchAPI(`/api/employees/${employeeId}`, { method: 'DELETE' });
      setEmployees(prev => prev.filter(e => e.EmployeeID !== employeeId));
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const clearAllEmployees = async () => {
    try {
      await fetchAPI('/api/employees', { method: 'DELETE' });
      setEmployees([]);
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    deleteEmployee,
    clearAllEmployees,
    refresh: loadEmployees,
  };
}
