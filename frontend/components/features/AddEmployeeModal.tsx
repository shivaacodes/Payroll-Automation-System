import React from 'react';
import { X } from '@phosphor-icons/react/dist/ssr';

interface AddEmployeeModalProps {
  onClose: () => void;
}

export default function AddEmployeeModal({ onClose }: AddEmployeeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md border border-slate-200 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Add Employee</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Employee ID</label>
            <input type="text" placeholder="e.g. EMP-1024" className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" placeholder="Jane Doe" className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" placeholder="jane@company.com" className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
            <input type="text" placeholder="Software Engineer" className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
          </div>
        </div>
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-sm font-medium text-sm hover:bg-violet-800 transition-colors shadow-sm">
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
}
