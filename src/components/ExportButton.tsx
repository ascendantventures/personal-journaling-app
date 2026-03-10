import React from 'react';
import { Download } from 'lucide-react';
import type { JournalEntry } from '../types';
import { exportEntriesToJSON } from '../lib/storage';

interface ExportButtonProps {
  entries: JournalEntry[];
  onSuccess: () => void;
}

export function ExportButton({ entries, onSuccess }: ExportButtonProps) {
  const handleExport = () => {
    exportEntriesToJSON(entries);
    onSuccess();
  };

  return (
    <button
      onClick={handleExport}
      title="Export all entries as JSON"
      aria-label="Export all entries as JSON"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-primary)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      <Download size={20} />
    </button>
  );
}
