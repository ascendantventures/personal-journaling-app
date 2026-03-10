import React from 'react';
import { BookOpen, Search, Calendar } from 'lucide-react';

interface EmptyStateProps {
  type: 'welcome' | 'no-results' | 'no-entries' | 'select-entry';
  onNewEntry?: () => void;
}

export function EmptyState({ type, onNewEntry }: EmptyStateProps) {
  const configs = {
    welcome: {
      icon: <BookOpen size={48} color="var(--primary)" strokeWidth={1.5} />,
      title: 'Welcome to My Journal',
      description: 'Your personal space to write, reflect, and grow. Start with your first entry today.',
      action: onNewEntry && (
        <button
          onClick={onNewEntry}
          style={{
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            marginTop: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-dark)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(194, 120, 92, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Write your first entry
        </button>
      ),
    },
    'no-results': {
      icon: <Search size={40} color="var(--text-muted)" strokeWidth={1.5} />,
      title: 'No entries found',
      description: 'Try adjusting your search or filters to find what you\'re looking for.',
      action: null,
    },
    'no-entries': {
      icon: <BookOpen size={48} color="var(--primary)" strokeWidth={1.5} />,
      title: 'Your journal is empty',
      description: 'Begin your journaling journey. Write about your day, your thoughts, or anything on your mind.',
      action: onNewEntry && (
        <button
          onClick={onNewEntry}
          style={{
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            marginTop: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
          }}
        >
          Create an entry
        </button>
      ),
    },
    'select-entry': {
      icon: <BookOpen size={40} color="var(--text-muted)" strokeWidth={1.5} />,
      title: 'Select an entry',
      description: 'Choose an entry from the sidebar to read it here, or create a new one.',
      action: null,
    },
  };

  const config = configs[type];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 32px',
        gap: '16px',
        animation: 'fadeIn 300ms ease',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-1)',
        }}
      >
        {config.icon}
      </div>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginTop: '8px',
        }}
      >
        {config.title}
      </h2>
      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          maxWidth: '360px',
        }}
      >
        {config.description}
      </p>
      {config.action}
    </div>
  );
}
