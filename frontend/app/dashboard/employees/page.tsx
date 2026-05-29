'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus,
  Spinner,
  Trash,
  FileCsv,
  DownloadSimple
} from '@phosphor-icons/react/dist/ssr';
import AddEmployeeModal from '@/components/features/AddEmployeeModal';
import Toast from '@/components/ui/Toast';
import { useEmployees } from '@/hooks/useEmployees';
import { API_BASE_URL } from '@/lib/api';

export default function EmployeesDirectory() {
  const { employees, loading, error, deleteEmployee, clearAllEmployees, refresh } = useEmployees();
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [deleteToast, setDeleteToast] = useState(false);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModalSuccess = () => {
    setShowModal(false);
    refresh();
    setSuccessToast('Employee added to the master database successfully.');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDelete = async (employeeID: string) => {
    setPendingDeleteId(employeeID);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    const employeeID = pendingDeleteId;
    setPendingDeleteId(null);
    setDeletingId(employeeID);
    try {
      await deleteEmployee(employeeID);
      setDeleteToast(true);
      setTimeout(() => setDeleteToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const executeClearAll = async () => {
    setShowClearConfirm(false);
    try {
      await clearAllEmployees();
      setDeleteToast(true);
      setTimeout(() => setDeleteToast(false), 3000);
    } catch {
      // Error handled
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBulk(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/bulk`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload CSV');
      }
      
      const data = await res.json();
      setSuccessToast(`Successfully imported ${data.count} employees!`);
      setTimeout(() => setSuccessToast(''), 3500);
      refresh();
    } catch (error: any) {
      alert(error.message || 'Error uploading file');
    } finally {
      setIsUploadingBulk(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        
        {/* Evaluator Demo Banner */}
        <div className="flex flex-col md:flex-row bg-indigo-50 border border-indigo-200 rounded-sm py-1.5 px-3 items-start md:items-center justify-between gap-3 shadow-sm w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-600 p-1 rounded-full">
              <DownloadSimple weight="bold" className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-900 leading-tight">Evaluator Demo Data</p>
              <p className="text-[10px] text-indigo-700 leading-tight">50-record CSV to test Go bulk ingestion.</p>
            </div>
          </div>
          <a 
            href="/demo_employees.csv"
            download="demo_employees.csv"
            className="shrink-0 font-medium text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-sm hover:bg-indigo-100 transition-colors text-xs inline-flex items-center gap-1.5 shadow-sm"
          >
            Download
          </a>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {employees.length > 0 && (
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <Trash className="w-4 h-4" /> Clear All
            </button>
          )}
          
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingBulk}
            className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isUploadingBulk ? <Spinner className="w-4 h-4 animate-spin" /> : <FileCsv className="w-4 h-4 text-slate-500" />}
            {isUploadingBulk ? 'Importing...' : 'Import CSV'}
          </button>

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
