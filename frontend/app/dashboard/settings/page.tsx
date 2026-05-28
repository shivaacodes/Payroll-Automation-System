'use client';

import React, { useState } from 'react';
import { FloppyDisk, EnvelopeSimple, Lock, Gear, Info } from '@phosphor-icons/react/dist/ssr';
import Toast from '@/components/ui/Toast';

export default function SettingsPage() {
  const [enablePdfSecurity, setEnablePdfSecurity] = useState(true);
  const [enableAutoRetry, setEnableAutoRetry] = useState(false); // Not yet implemented in backend
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
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <EnvelopeSimple className="w-4 h-4 text-slate-500" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Email Configuration</h3>
            <p className="text-xs text-slate-500 mt-0.5">Active email provider and sender identity.</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Sender Name</label>
              <input
                type="text"
                value="Nippon Toyota HR"
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-500 cursor-not-allowed shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Sender Email</label>
              <input
                type="email"
                value="shivasajay007@gmail.com"
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-500 cursor-not-allowed shadow-sm"
              />
            </div>
          </div>

          {/* Provider Badge */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Active Provider: SendGrid</p>
              <p className="text-xs text-slate-500 mt-0.5">API key configured via environment variable <code className="bg-white border border-slate-200 px-1 rounded font-mono text-slate-700">SENDGRID_API_KEY</code></p>
            </div>
          </div>
        </div>

        {/* PDF Security */}
        <div className="px-6 py-4 border-y border-slate-200 bg-slate-50 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">PDF Security</h3>
            <p className="text-xs text-slate-500 mt-0.5">AES-256 encryption parameters for generated salary slips.</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Enable Password Protected PDFs</p>
              <p className="text-xs text-slate-500 mt-1">Automatically lock all generated PDFs with AES-256 encryption before dispatch.</p>
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
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-3">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password Format Rule</p>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">
                  The system dynamically sets the PDF password using:{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded-sm border border-slate-300 text-primary font-mono font-bold">
                    First Name + Birth Year
                  </code>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">
                  Example: An employee named <strong>Shiva Sajay</strong> born in <strong>2004</strong> would unlock their PDF with{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded-sm border border-slate-200 font-mono text-slate-700">Shiva2004</code>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">
                  Encryption engine: <code className="bg-white px-1.5 py-0.5 rounded-sm border border-slate-200 font-mono text-slate-700">qpdf --encrypt 256</code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Processing Settings */}
        <div className="px-6 py-4 border-y border-slate-200 bg-slate-50 flex items-center gap-2">
          <Gear className="w-4 h-4 text-slate-500" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Processing Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Background worker pool and job queue configuration.</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Worker Count - read only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Concurrent Workers</label>
              <input
                type="number"
                value={5}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-500 cursor-not-allowed shadow-sm"
              />
              <p className="text-xs text-slate-400">Number of parallel Go goroutines processing the job queue.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Queue Buffer Size</label>
              <input
                type="number"
                value={100}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm text-slate-500 cursor-not-allowed shadow-sm"
              />
              <p className="text-xs text-slate-400">Maximum number of pending jobs held in the in-memory channel.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
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

          {enableAutoRetry && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-sm">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Auto-retry logic is not yet wired to the backend worker pool. This toggle is UI-only for now.</p>
            </div>
          )}
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
        variant="success"
      />

    </div>
  );
}
