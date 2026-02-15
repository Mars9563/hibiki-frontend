'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'rooms' | 'pending';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('rooms');

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error('useViewMode must be used inside ViewProvider');
  return ctx;
}
