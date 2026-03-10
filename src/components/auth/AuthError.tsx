import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AuthErrorProps {
  message: string;
}

export function AuthError({ message }: AuthErrorProps) {
  return (
    <div
      data-testid="auth-error"
      style={{
        background: '#FEE2E2',
        border: '1px solid #FECACA',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        marginBottom: '16px',
      }}
    >
      <AlertCircle
        size={18}
        color="#B91C1C"
        style={{ flexShrink: 0, marginTop: '1px' }}
      />
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          color: '#991B1B',
          lineHeight: 1.4,
        }}
      >
        {message}
      </span>
    </div>
  );
}
