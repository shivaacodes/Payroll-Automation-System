import React, { useState } from 'react';
import { X, Spinner } from '@phosphor-icons/react/dist/ssr';

interface AddEmployeeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({ onClose, onSuccess }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    EmployeeID: '',
    Name: '',
    Email: '',
    Designation: '',
    DOBYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8080/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create employee');
      }

      onSuccess(); // Close modal and refresh list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md border border-slate-200 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Add Employee</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {error && (
              <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Employee ID</label>
              <input 
                required
                type="text" 
                name="EmployeeID"
                value={formData.EmployeeID}
                onChange={handleChange}
                placeholder="e.g. EMP-1024" 
                className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="Jane Doe" 
                className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                required
                type="email" 
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="jane@company.com" 
                className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
                <input 
                  required
                  type="text" 
                  name="Designation"
                  value={formData.Designation}
                  onChange={handleChange}
                  placeholder="Software Engineer" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Birth Year</label>
                <input 
                  required
                  type="text" 
                  name="DOBYear"
                  value={formData.DOBYear}
                  onChange={handleChange}
                  placeholder="1995" 
                  pattern="[0-9]{4}"
                  title="Must be a 4-digit year"
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" 
                />
              </div>
            </div>
          </div>
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose} 
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-sm font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-sm font-medium text-sm hover:bg-violet-800 transition-colors shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Spinner className="w-4 h-4 animate-spin" />}
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
