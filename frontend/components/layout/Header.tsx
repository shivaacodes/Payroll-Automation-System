'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { House } from '@phosphor-icons/react/dist/ssr';
import { navItems } from './Sidebar';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <House className="w-4 h-4" />
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-900">
          {navItems.find(item => item.href === pathname)?.label || 'Overview'}
        </span>
      </div>
    </header>
  );
}
