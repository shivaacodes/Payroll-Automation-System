'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlass, 
  Funnel,
  DownloadSimple,
  Plus
} from '@phosphor-icons/react/dist/ssr';
import AddEmployeeModal from '@/components/features/AddEmployeeModal';

export default function EmployeesDirectory() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Employee Directory</h2>
          <p className="text-sm text-slate-500">Manage employee records.</p>
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

      {/* Employees Table - Reduced Columns */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full table-dense">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">
                  No employee records found. Upload a payroll CSV to begin.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Showing 0 entries</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-slate-300 rounded-sm bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-2 py-1 border border-slate-300 rounded-sm bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {showModal && <AddEmployeeModal onClose={() => setShowModal(false)} />}

    </div>
  );
}
