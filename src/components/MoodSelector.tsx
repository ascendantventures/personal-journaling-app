import React from 'react';
import type { Mood } from '../types';
import { ALL_MOODS } from '../types';
import { MOOD_STYLES } from '../lib/mood';

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
  error?: boolean;
}

export function MoodSelector({ value, onChange, error }: MoodSelectorProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: '10px',
        }}
      >
        How are you feeling?
      </label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap' as const,
          gap: '8px',
        }}
      >
        {ALL_MOODS.map((mood) => {
          const style = MOOD_STYLES[mood];
          const isSelected = value === mood;
          return (
            <button
              key={mood}
              type="button"
              onClick={() => onChange(mood)}
              aria-pressed={isSelected}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                border: `2px solid ${isSelected ? style.border : 'transparent'}`,
                background: isSelected ? style.bg : 'var(--bg-surface-alt)',
                color: isSelected ? style.text : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isSelected ? `0 0 0 2px ${style.border}40` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = style.bg;
                  e.currentTarget.style.transform = 'scale(1.03)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'var(--bg-surface-alt)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <span>{style.emoji}</span>
              {style.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '6px' }}>
          Please select a mood
        </p>
      )}
    </div>
  );
}
