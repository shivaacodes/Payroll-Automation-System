'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  House, 
  CloudArrowUp, 
  HardDrives, 
  Users,
  SignOut,
  Receipt,
  FileText,
  CarProfile
} from '@phosphor-icons/react/dist/ssr';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/dashboard/employees', label: 'Employees', icon: Users },
  { href: '/dashboard/upload', label: 'Upload Payroll', icon: CloudArrowUp },
  { href: '/dashboard/jobs', label: 'Processing Jobs', icon: HardDrives },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-slate-900 bg-slate-950 flex flex-col hidden md:flex shrink-0">
      {/* Logo Area */}
      <div className="h-14 flex items-center px-4 border-b border-slate-900">
        <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-white/90 transition-colors">
          <CarProfile className="w-6 h-6 text-primary" weight="fill" />
          <span className="font-bold text-sm tracking-widest uppercase">Nippon Toyota</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <div className="px-2 pb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
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
                  ? 'bg-primary text-white font-medium shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <item.icon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area with Logout */}
      <div className="p-4 border-t border-slate-900">
        <Link 
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm transition-colors text-slate-400 hover:bg-slate-900 hover:text-rose-500 w-full"
        >
          <SignOut className="w-4 h-4 shrink-0" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>

    </aside>
  );
}
