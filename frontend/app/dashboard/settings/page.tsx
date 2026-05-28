'use client';

import React, { useState } from 'react';
import { FloppyDisk } from '@phosphor-icons/react/dist/ssr';
import Toast from '@/components/ui/Toast';

export default function SettingsPage() {
  const [enablePdfSecurity, setEnablePdfSecurity] = useState(true);
  const [enableAutoRetry, setEnableAutoRetry] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Configure core dispatch and security parameters.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        
        {/* Email Configuration */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-800">Email Configuration</h3>
          <p className="text-xs text-slate-500 mt-1">Configure SMTP provider and sender details.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Sender Email</label>
              <input type="email" defaultValue="payroll@company.com" className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">SMTP Provider</label>
              <input type="text" defaultValue="smtp.mailgun.org" className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
            </div>
          </div>
        </div>

        {/* PDF Security */}
        <div className="px-6 py-4 border-y border-slate-200 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-800">PDF Security</h3>
          <p className="text-xs text-slate-500 mt-1">Configure encryption parameters for generated salary slips.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Enable Password Protected PDFs</p>
              <p className="text-xs text-slate-500 mt-1">Automatically lock all generated PDFs before dispatch.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={enablePdfSecurity}
                onChange={() => setEnablePdfSecurity(!enablePdfSecurity)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
          
          {enablePdfSecurity && (
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm">
              <p className="text-sm text-blue-900 font-medium">Password Format Rule</p>
              <p className="text-xs text-blue-700 mt-1">The system will dynamically set the PDF password using: <code className="bg-white px-1.5 py-0.5 rounded-sm border border-blue-200 text-blue-800 font-mono font-bold">EMPLOYEE_ID + Birth Year</code></p>
            </div>
          )}
        </div>

        {/* Processing Settings */}
        <div className="px-6 py-4 border-y border-slate-200 bg-slate-50">
          <h3 className="text-sm font-semibold text-slate-800">Processing Settings</h3>
          <p className="text-xs text-slate-500 mt-1">Configure background job behaviors.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Enable Automatic Retry</p>
              <p className="text-xs text-slate-500 mt-1">Automatically retry failed email dispatches up to 3 times before marking as failed.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={enableAutoRetry}
                onChange={() => setEnableAutoRetry(!enableAutoRetry)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-violet-800 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <FloppyDisk weight="fill" className="w-4 h-4" /> Save Configuration
          </button>
        </div>

      </div>

      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        title="Configuration Saved" 
        description="Your global settings have been successfully updated." 
      />

    </div>
  );
}
