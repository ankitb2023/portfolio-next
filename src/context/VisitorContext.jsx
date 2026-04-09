'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MEMORY_KEY } from '@/constants/constants';

const VisitorContext = createContext(null);

const DEFAULT_MEMORY = {
  visits: 0,
  lastSessionSection: null,
  currentSection: 'home'
};

export function VisitorProvider({ children }) {
  const [memory, setMemory] = useState(DEFAULT_MEMORY);
  const [isReady, setIsReady] = useState(false);
  const memoryRef = useRef(memory);

  // Keep ref updated for beforeunload
  useEffect(() => {
    memoryRef.current = memory;
  }, [memory]);

  // Initialize once on mount
  useEffect(() => {
    try {
      const storedStr = localStorage.getItem(MEMORY_KEY);
      let parsed = DEFAULT_MEMORY;
      
      if (storedStr) {
        const raw = JSON.parse(storedStr);
        parsed = {
          visits: raw.visits || 0,
          lastSessionSection: raw.lastSessionSection || raw.lastSection || null,
          currentSection: 'home'
        };
      }
      
      const newMemory = {
        visits: parsed.visits + 1,
        lastSessionSection: parsed.lastSessionSection,
        currentSection: 'home'
      };
      
      setMemory(newMemory);
      localStorage.setItem(MEMORY_KEY, JSON.stringify({
        visits: newMemory.visits,
        lastSessionSection: newMemory.lastSessionSection
      }));
    } catch (e) {
      console.warn("Failed to read/write visitor memory", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Set up exit listener (Only one listener total)
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        const memObj = memoryRef.current;
        const updated = {
          visits: memObj.visits,
          lastSessionSection: memObj.currentSection
        };
        localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
      } catch (e) {}
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const updateMemory = useCallback((updateObj) => {
    setMemory(prev => ({ ...prev, ...updateObj }));
  }, []);

  const value = {
    memory,
    updateMemory,
    isReady,
    isReturningUser: memory.visits > 1
  };

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitorContext() {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitorContext must be used within a <VisitorProvider>');
  }
  return context;
}
