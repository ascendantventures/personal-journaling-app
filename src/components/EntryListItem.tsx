import React from 'react';
import type { JournalEntry } from '../types';
import { MoodBadge } from './MoodBadge';

interface EntryListItemProps {
  entry: JournalEntry;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function EntryListItem({ entry, isActive, onClick, index }: EntryListItemProps) {
  return (
    <div
      data-testid="entry-item"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-pressed={isActive}
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        background: isActive ? 'var(--bg-surface)' : 'transparent',
        boxShadow: isActive ? 'var(--shadow-1)' : 'none',
        transition: 'all 150ms ease',
        animation: `staggerFade 300ms ease ${Math.min(index, 10) * 40}ms both`,
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--focus-ring)';
      }}
      onBlur={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap' as const,
          marginBottom: '6px',
        }}
      >
        {entry.title || 'Untitled'}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          {formatDate(entry.createdAt)}
        </span>
        <MoodBadge mood={entry.mood} />
      </div>
    </div>
  );
}
