'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import styles from './Toast.module.scss';

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    // Allow exit animation to play before removing from DOM
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastIdCounter;
    const toast = { id, message, type, duration, exiting: false };
    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss
    timersRef.current[id] = setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, [removeToast]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Container — renders all active toasts */}
      {toasts.length > 0 && (
        <div className={styles.toastContainer} aria-live="polite" aria-atomic="false">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`${styles.toast} ${styles[toast.type]} ${toast.exiting ? styles.exiting : ''}`}
              onClick={() => removeToast(toast.id)}
              role="alert"
            >
              <div className={styles.iconArea}>
                {toast.type === 'success' && <i className="fas fa-check-circle" aria-hidden="true"></i>}
                {toast.type === 'error' && <i className="fas fa-times-circle" aria-hidden="true"></i>}
                {toast.type === 'info' && <i className="fas fa-info-circle" aria-hidden="true"></i>}
              </div>
              <p className={styles.message}>{toast.message}</p>
              <button className={styles.closeBtn} aria-label="Dismiss toast">
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
              {/* Progress bar for auto-dismiss countdown */}
              <div
                className={styles.progress}
                style={{ animationDuration: `${toast.duration}ms` }}
              ></div>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}
