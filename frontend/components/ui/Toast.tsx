'use client';

import React from 'react';
import { CheckCircle, Warning, Trash, X } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  description: string;
  variant?: 'success' | 'danger' | 'confirm';
  onConfirm?: () => void; // Only used for confirm variant
}

const styles = {
  success: {
    wrapper: 'bg-emerald-50 border-emerald-200',
    icon: <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500 shrink-0" />,
    title: 'text-emerald-900',
    desc: 'text-emerald-700',
    close: 'text-emerald-400 hover:text-emerald-600',
  },
  danger: {
    wrapper: 'bg-rose-50 border-rose-200',
    icon: <Warning weight="fill" className="w-5 h-5 text-rose-500 shrink-0" />,
    title: 'text-rose-900',
    desc: 'text-rose-700',
    close: 'text-rose-400 hover:text-rose-600',
  },
  confirm: {
    wrapper: 'bg-rose-50 border-rose-300',
    icon: <Trash weight="fill" className="w-5 h-5 text-rose-500 shrink-0" />,
    title: 'text-rose-900',
    desc: 'text-rose-700',
    close: 'text-rose-400 hover:text-rose-600',
  },
};

export default function Toast({ show, onClose, title, description, variant = 'success', onConfirm }: ToastProps) {
  const s = styles[variant];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 right-6 border shadow-lg rounded-sm p-4 flex items-start gap-3 z-50 max-w-sm ${s.wrapper}`}
        >
          {s.icon}
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${s.title}`}>{title}</h4>
            <p className={`text-xs mt-0.5 ${s.desc}`}>{description}</p>

            {/* Confirm / Cancel buttons for confirm variant */}
            {variant === 'confirm' && onConfirm && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={onConfirm}
                  className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-sm hover:bg-rose-700 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1 bg-white border border-rose-300 text-rose-700 text-xs font-semibold rounded-sm hover:bg-rose-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className={`${s.close} ml-auto shrink-0`}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
