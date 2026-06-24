'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { House, List, X, SignOut, Sun, Moon } from '@phosphor-icons/react/dist/ssr';
import { navItems } from './Sidebar';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card shrink-0 relative">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <House className="w-4 h-4" />
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="font-medium text-foreground">
          {navItems.find(item => item.href === pathname)?.label || 'Overview'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-sm text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
        <Link 
          href="/"
          className="p-1.5 rounded-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors hidden md:block"
          title="Logout"
        >
          <SignOut className="w-5 h-5" />
        </Link>
        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden text-slate-500 hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border shadow-lg z-50 md:hidden flex flex-col py-2">
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
                    : 'text-slate-600 hover:bg-slate-50 hover:text-foreground dark:text-slate-400 dark:hover:bg-slate-800 border-l-4 border-transparent'
                }`}
              >
                <item.icon weight={isActive ? 'fill' : 'regular'} className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-border mt-1 pt-1">
            <Link 
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm transition-colors text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-rose-500 border-l-4 border-transparent"
            >
              <SignOut className="w-5 h-5 shrink-0" />
              Logout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
