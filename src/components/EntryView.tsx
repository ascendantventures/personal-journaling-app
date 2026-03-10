import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { JournalEntry } from '../types';
import { MoodBadge } from './MoodBadge';
import { MarkdownRenderer } from './MarkdownRenderer';

interface EntryViewProps {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}

function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EntryView({ entry, onEdit, onDelete }: EntryViewProps) {
  const wasEdited = entry.updatedAt !== entry.createdAt;

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '40px 48px',
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-1)',
        animation: 'fadeInUp 200ms ease',
      }}
    >
      {/* Metadata row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap' as const,
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            fontWeight: 500,
          }}
        >
          {formatFullDate(entry.createdAt)}
        </span>
        <span style={{ color: 'var(--border)', fontSize: '14px' }}>·</span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {formatTime(entry.createdAt)}
        </span>
        <MoodBadge mood={entry.mood} size="md" />
        {wasEdited && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            edited {formatFullDate(entry.updatedAt)}
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          marginBottom: '32px',
        }}
      >
        {entry.title || 'Untitled'}
      </h1>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'var(--border)',
          marginBottom: '32px',
          opacity: 0.6,
        }}
      />

      {/* Body */}
      {entry.body ? (
        <div style={{ marginBottom: '40px' }}>
          <MarkdownRenderer content={entry.body} bare />
        </div>
      ) : (
        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginBottom: '40px',
          }}
        >
          No content written for this entry.
        </p>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <button
          onClick={onEdit}
          aria-label="Edit this entry"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-alt)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Edit2 size={15} />
          Edit
        </button>
        <button
          data-testid="delete-entry"
          onClick={onDelete}
          aria-label="Delete this entry"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(235,87,87,0.3)',
            background: 'transparent',
            color: 'var(--error)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(235,87,87,0.08)';
          }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  );
}
