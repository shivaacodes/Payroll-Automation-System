'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { House, List, X } from '@phosphor-icons/react/dist/ssr';
import { navItems } from './Sidebar';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card shrink-0 relative">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <House className="w-4 h-4" />
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-900">
          {navItems.find(item => item.href === pathname)?.label || 'Overview'}
        </span>
      </div>

      {/* Mobile Hamburger Toggle */}
      <button 
        className="md:hidden text-slate-500 hover:text-slate-900"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-border shadow-lg z-50 md:hidden flex flex-col py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium border-l-4 border-primary' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                <item.icon weight={isActive ? 'fill' : 'regular'} className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
