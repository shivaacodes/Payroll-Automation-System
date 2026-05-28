'use client';

import React from 'react';
import { CheckCircle, X } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export default function Toast({ show, onClose, title, description }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-emerald-50 border border-emerald-200 shadow-lg rounded-sm p-4 flex items-start gap-3 z-50 max-w-sm"
        >
          <CheckCircle weight="fill" className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900">{title}</h4>
            <p className="text-xs text-emerald-700 mt-0.5">{description}</p>
          </div>
          <button onClick={onClose} className="text-emerald-400 hover:text-emerald-600 ml-auto">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
