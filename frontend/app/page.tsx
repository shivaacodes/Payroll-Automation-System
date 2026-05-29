'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  ArrowDown,
  CloudArrowUp,
  FileMagnifyingGlass,
  FilePdf,
  EnvelopeSimple,
  CaretRight
} from '@phosphor-icons/react/dist/ssr';

export default function LandingPage() {
  const scrollToArchitecture = () => {
    const el = document.getElementById('architecture');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Removed Navbar */}

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        
        {/* 1. Hero Section */}
        <section className="text-center space-y-8 max-w-5xl mx-auto pt-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-900 drop-shadow-sm pb-2"
          >
            Payroll Automation System
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Automated payroll processing and salary slip dispatch platform.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-[320px] justify-center bg-primary text-white px-8 py-4 text-lg rounded-md font-medium inline-flex items-center gap-2 hover:bg-violet-800 transition-all shadow-sm whitespace-nowrap">
              Launch Admin Portal <ArrowRight weight="bold" className="w-5 h-5 flex-shrink-0" />
            </Link>
            <button 
              onClick={scrollToArchitecture}
              className="w-full sm:w-[320px] justify-center bg-white text-slate-700 border border-slate-300 px-8 py-4 text-lg rounded-md font-medium inline-flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap"
            >
              Architecture Docs <ArrowDown weight="bold" className="w-5 h-5 text-slate-400 flex-shrink-0" />
            </button>
          </motion.div>

          {/* Removed Workflow Visualization */}

          {/* Removed Metrics Row */}

        </section>

        {/* 2. Pipeline Visualization */}
        <section className="pt-12 border-t border-slate-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Processing Pipeline</h2>
          </div>
          <div className="w-full max-w-6xl mx-auto">
            <img 
              src="/pipeline.png" 
              alt="System Architecture Pipeline" 
              className="w-full h-auto object-contain" 
            />
          </div>
        </section>

        {/* 3. Database Schema */}
        <section id="schema" className="pt-12 border-t border-slate-200 min-h-[400px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Database Schema</h2>
          </div>
          <div className="w-full max-w-4xl mx-auto p-4">
            <img 
              src="/database-schema.png" 
              alt="Database Schema Diagram" 
              className="w-full h-auto object-contain drop-shadow-sm" 
            />
          </div>
        </section>

        {/* 4. Architecture Section */}
        <section id="architecture" className="pt-12 border-t border-slate-200 min-h-[400px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">System Architecture</h2>
          </div>
          <div className="w-full max-w-6xl mx-auto p-4">
            <img 
              src="/payroll-architecture-diagram.png" 
              alt="Payroll Architecture Diagram" 
              className="w-full h-auto object-contain" 
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 text-center text-slate-500 text-sm">
        <p>Made by Shiva</p>
      </footer>
    </div>
  );
}
