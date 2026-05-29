import React from 'react';
import { CheckCircle, Warning, Clock } from '@phosphor-icons/react/dist/ssr';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'default';

interface BadgeProps {
  status: string;
  variant?: BadgeVariant;
}

export default function Badge({ status, variant }: BadgeProps) {
  let badgeVariant = variant;

  // Auto-determine variant if not explicitly provided
  if (!badgeVariant) {
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'success' || s === 'sent' || s === 'valid') {
      badgeVariant = 'success';
    } else if (s === 'failed' || s === 'error') {
      badgeVariant = 'danger';
    } else {
      badgeVariant = 'warning';
    }
  }

  switch (badgeVariant) {
    case 'success':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5" weight="fill" /> {status}
        </span>
      );
    case 'danger':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
          <Warning className="w-3.5 h-3.5" weight="fill" /> {status}
        </span>
      );
    case 'warning':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5" weight="fill" /> {status}
        </span>
      );
  }
}
