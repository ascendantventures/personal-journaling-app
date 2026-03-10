import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'success' ? '#2D6A4F' : '#B91C1C',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 2000,
        animation: 'toastEnter 250ms ease',
        maxWidth: 'calc(100vw - 48px)',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      {type === 'success'
        ? <CheckCircle size={18} />
        : <XCircle size={18} />}
      <span>{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '4px',
          borderRadius: '4px',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
