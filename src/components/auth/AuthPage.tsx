import React from 'react';

interface AuthPageProps {
  children: React.ReactNode;
}

export function AuthPage({ children }: AuthPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* App branding */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        {/* Decorative quote marks */}
        <svg
          width="40"
          height="32"
          viewBox="0 0 40 32"
          fill="none"
          style={{ display: 'block', margin: '0 auto 16px' }}
          aria-hidden="true"
        >
          <path
            d="M14 0H4C1.79 0 0 1.79 0 4v8c0 2.21 1.79 4 4 4h6v2c0 3.31-2.69 6-6 6v4c5.52 0 10-4.48 10-10V4c0-2.21-1.79-4-4-4zm22 0h-10c-2.21 0-4 1.79-4 4v8c0 2.21 1.79 4 4 4h6v2c0 3.31-2.69 6-6 6v4c5.52 0 10-4.48 10-10V4c0-2.21-1.79-4-4-4z"
            fill="#C2410C"
            fillOpacity="0.12"
          />
        </svg>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#1C1917',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          Journal
        </h1>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '14px',
            color: '#78716C',
            marginTop: '8px',
            marginBottom: 0,
          }}
        >
          Capture your thoughts
        </p>
      </div>

      {/* Auth card */}
      {children}
    </div>
  );
}
