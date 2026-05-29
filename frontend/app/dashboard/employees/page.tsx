'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Spinner,
  Trash
} from '@phosphor-icons/react/dist/ssr';
import AddEmployeeModal from '@/components/features/AddEmployeeModal';
import Toast from '@/components/ui/Toast';

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null); // for confirm toast
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [deleteToast, setDeleteToast] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/employees`);
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
    fetchEmployees();
    setSuccessToast('Employee added to the master database successfully.');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDelete = async (employeeID: string) => {
    setPendingDeleteId(employeeID); // Show the confirm toast instead of browser popup
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const employeeID = pendingDeleteId;
    setPendingDeleteId(null);
    setDeletingId(employeeID);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}`}/api/employees/${employeeID}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEmployees(prev => prev.filter(e => e.EmployeeID !== employeeID));
        setDeleteToast(true);
        setTimeout(() => setDeleteToast(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete employee');
      }
    } catch {
      setError('Could not connect to server');
    } finally {
      setDeletingId(null);
    }
  };

  const executeClearAll = async () => {
    setShowClearConfirm(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/employees`, { method: 'DELETE' });
      if (res.ok) {
        setEmployees([]);
        setDeleteToast(true);
        setTimeout(() => setDeleteToast(false), 3000);
      } else {
        setError('Failed to clear employees');
      }
    } catch {
      setError('Could not connect to server');
    }
  };

  return (
    <div className="space-y-6">

      {/* Success Toast - employee added */}
      <Toast
        show={!!successToast}
        onClose={() => setSuccessToast('')}
        title="Employee Added!"
        description={successToast}
        variant="success"
      />

      {/* Delete Confirm Toast */}
      <Toast
        show={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        title="Delete Employee?"
        description={`This will permanently remove ${pendingDeleteId} from the master database.`}
        variant="confirm"
        onConfirm={confirmDelete}
      />

      {/* Delete Success Toast */}
      <Toast
        show={deleteToast}
        onClose={() => setDeleteToast(false)}
        title="Employee(s) Removed"
        description="The employee records have been permanently deleted."
        variant="danger"
      />

      {/* Clear All Confirm Toast */}
      <Toast
        show={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Employees?"
        description="Are you sure you want to delete all employee records? This cannot be undone."
        variant="confirm"
        onConfirm={executeClearAll}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Employee Directory</h2>
        </div>
        <div className="flex gap-2">
          {employees.length > 0 && (
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <Trash className="w-4 h-4" /> Clear All
            </button>
          )}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-violet-800 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <Plus weight="bold" className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 text-sm rounded-sm">
          {error}
        </div>
      )}

      {/* Employee List Table */}
      <div className="bg-white border-y md:border border-slate-200 md:rounded-sm shadow-sm flex flex-col -mx-4 md:mx-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-dense">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Designation</th>
                <th>Birth Year</th>
                <th className="text-center w-16"></th>
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
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(emp.EmployeeID)}
                        disabled={deletingId === emp.EmployeeID}
                        className="p-1.5 rounded-sm text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-40"
                        title="Delete employee"
                      >
                        {deletingId === emp.EmployeeID
                          ? <Spinner className="w-4 h-4 animate-spin" />
                          : <Trash className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
          <span>Showing {employees.length} {employees.length === 1 ? 'employee' : 'employees'}</span>
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
