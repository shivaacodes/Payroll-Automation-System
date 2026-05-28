'use client';

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Funnel,
  DownloadSimple,
  Plus,
  Spinner
} from '@phosphor-icons/react/dist/ssr';
import AddEmployeeModal from '@/components/features/AddEmployeeModal';

type Employee = {
  ID: number;
  EmployeeID: string;
  Name: string;
  Email: string;
  Designation: string;
  DOBYear: string;
};

export default function EmployeesDirectory() {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8080/api/employees');
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch employees');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleModalSuccess = () => {
    setShowModal(false);
    fetchEmployees(); // Refresh the list
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Employee Directory</h2>
          <p className="text-sm text-slate-500">Manage employee master records.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-sm">
            <DownloadSimple className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-violet-800 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus weight="bold" className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Funnel className="w-4 h-4" /> Filters
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 text-sm rounded-sm">
          {error}
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full table-dense">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Designation</th>
                <th>Birth Year</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    <Spinner className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    No employee records found. Click "Add Employee" to create one.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.ID}>
                    <td className="font-medium text-slate-900">{emp.EmployeeID}</td>
                    <td>{emp.Name}</td>
                    <td>{emp.Email}</td>
                    <td>{emp.Designation}</td>
                    <td>{emp.DOBYear}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Showing {employees.length} entries</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-300 rounded-sm bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-2 py-1 border border-slate-300 rounded-sm bg-white hover:bg-slate-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddEmployeeModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleModalSuccess} 
        />
      )}

    </div>
  );
}
