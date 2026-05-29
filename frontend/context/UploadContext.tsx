'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type PreviewRecord = {
  employeeId: string;
  name: string;
  email: string;
  baseSalary: number;
  netSalary: number;
  status: 'Valid' | 'Error';
  errorReason?: string;
};

interface UploadContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  step: number;
  setStep: (step: number) => void;
  records: PreviewRecord[];
  setRecords: (records: PreviewRecord[]) => void;
  rawPreview: string[][] | null;
  setRawPreview: (preview: string[][] | null) => void;
  resetUpload: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [records, setRecords] = useState<PreviewRecord[]>([]);
  const [rawPreview, setRawPreview] = useState<string[][] | null>(null);

  const resetUpload = () => {
    setFile(null);
    setStep(1);
    setRecords([]);
    setRawPreview(null);
  };

  return (
    <UploadContext.Provider value={{ file, setFile, step, setStep, records, setRecords, rawPreview, setRawPreview, resetUpload }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploadState() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUploadState must be used within an UploadProvider');
  }
  return context;
}
