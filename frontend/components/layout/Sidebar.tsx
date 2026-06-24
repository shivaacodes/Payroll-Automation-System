'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  House, 
  CloudArrowUp, 
  HardDrives, 
  Users,
  SignOut,
  Receipt,
  FileText,
  CarProfile,
  Moon,
  Sun
} from '@phosphor-icons/react/dist/ssr';
import { useTheme } from 'next-themes';

export const navItems = [
  { href: '/dashboard', label: 'HR Overview', icon: House },
  { href: '/dashboard/employees', label: 'Employee Directory', icon: Users },
  { href: '/dashboard/upload', label: 'Process Payroll', icon: CloudArrowUp },
  { href: '/dashboard/jobs', label: 'Batch Jobs', icon: HardDrives },
  { href: '/dashboard/reports', label: 'Payroll History', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col hidden md:flex shrink-0">
      {/* Logo Area */}
      <div className="h-14 flex items-center justify-center border-b border-border py-2">
        <Link href="/dashboard" className="flex items-center justify-center hover:opacity-80 transition-opacity w-full h-full">
          <Image src="/nippon_toyota.png" alt="Nippon Toyota" width={150} height={40} style={{ width: 'auto', height: '100%', maxHeight: '40px' }} className="object-contain" />
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-sm transition-colors ${
                isActive 
                  ? 'bg-primary text-white font-medium shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon weight={isActive ? 'fill' : 'regular'} className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area with Logout & Theme Toggle */}
      <div className="p-4 border-t border-border space-y-1">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white w-full"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        )}
        <Link 
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm transition-colors text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-rose-500 w-full"
        >
          <SignOut className="w-4 h-4 shrink-0" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>

    </aside>
  );
}
