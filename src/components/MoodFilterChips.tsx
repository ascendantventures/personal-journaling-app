import React from 'react';
import type { Mood } from '../types';
import { ALL_MOODS } from '../types';
import { MOOD_STYLES } from '../lib/mood';

interface MoodFilterChipsProps {
  active: Mood | null;
  onChange: (mood: Mood | null) => void;
}

export function MoodFilterChips({ active, onChange }: MoodFilterChipsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '6px',
        marginBottom: '16px',
      }}
    >
      <button
        onClick={() => onChange(null)}
        style={{
          padding: '5px 12px',
          borderRadius: '16px',
          fontSize: '13px',
          fontWeight: 500,
          border: '1px solid var(--border)',
          background: active === null ? 'var(--primary)' : 'var(--bg-surface)',
          color: active === null ? '#fff' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          if (active !== null) e.currentTarget.style.borderColor = 'var(--text-muted)';
        }}
        onMouseLeave={(e) => {
          if (active !== null) e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        All
      </button>
      {ALL_MOODS.map((mood) => {
        const style = MOOD_STYLES[mood];
        const isActive = active === mood;
        return (
          <button
            key={mood}
            onClick={() => onChange(isActive ? null : mood)}
            style={{
              padding: '5px 12px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 500,
              border: `1px solid ${isActive ? style.border : 'var(--border)'}`,
              background: isActive ? style.bg : 'var(--bg-surface)',
              color: isActive ? style.text : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              boxShadow: isActive ? 'var(--shadow-1)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = style.bg;
                e.currentTarget.style.borderColor = style.border;
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {style.label}
          </button>
        );
      })}
    </div>
  );
}
