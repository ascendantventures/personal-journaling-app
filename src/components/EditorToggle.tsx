import React from 'react';

interface EditorToggleProps {
  mode: 'edit' | 'preview';
  onChange: (mode: 'edit' | 'preview') => void;
}

export function EditorToggle({ mode, onChange }: EditorToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Editor mode"
      style={{
        display: 'inline-flex',
        background: 'var(--bg-surface-alt)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '4px',
        gap: '0',
      }}
    >
      <button
        role="tab"
        aria-selected={mode === 'edit'}
        onClick={() => onChange('edit')}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 150ms ease',
          background: mode === 'edit' ? 'var(--primary)' : 'transparent',
          color: mode === 'edit' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: mode === 'edit' ? '0 1px 3px rgba(196, 112, 62, 0.3)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (mode !== 'edit') {
            e.currentTarget.style.background = 'rgba(196, 112, 62, 0.08)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (mode !== 'edit') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        Edit
      </button>
      <button
        role="tab"
        aria-selected={mode === 'preview'}
        onClick={() => onChange('preview')}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 150ms ease',
          background: mode === 'preview' ? 'var(--primary)' : 'transparent',
          color: mode === 'preview' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: mode === 'preview' ? '0 1px 3px rgba(196, 112, 62, 0.3)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (mode !== 'preview') {
            e.currentTarget.style.background = 'rgba(196, 112, 62, 0.08)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (mode !== 'preview') {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        Preview
      </button>
    </div>
  );
}
