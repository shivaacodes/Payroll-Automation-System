'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  House, 
  CloudArrowUp, 
  HardDrives, 
  Users,
  Gear, 
  SignOut,
  Receipt,
  FileText
} from '@phosphor-icons/react/dist/ssr';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/dashboard/upload', label: 'Upload Payroll', icon: CloudArrowUp },
  { href: '/dashboard/jobs', label: 'Processing Jobs', icon: HardDrives },
  { href: '/dashboard/employees', label: 'Employees', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Gear },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight text-slate-900">Sidebar</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <div className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-sm transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area with Logout */}
      <div className="p-4 border-t border-border">
        <Link 
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm transition-colors text-slate-600 hover:bg-slate-100 hover:text-rose-600 w-full"
        >
          <SignOut className="w-4 h-4 shrink-0" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>

    </aside>
  );
}
