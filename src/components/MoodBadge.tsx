import React from 'react';
import type { Mood } from '../types';
import { MOOD_STYLES } from '../lib/mood';

interface MoodBadgeProps {
  mood: Mood;
  size?: 'sm' | 'md';
}

export function MoodBadge({ mood, size = 'sm' }: MoodBadgeProps) {
  const style = MOOD_STYLES[mood];
  const fontSize = size === 'md' ? '13px' : '12px';
  const padding = size === 'md' ? '5px 12px' : '4px 10px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        borderRadius: '16px',
        fontSize,
        fontWeight: 500,
        textTransform: 'capitalize',
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.text,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: style.border,
          flexShrink: 0,
        }}
      />
      {style.label}
    </span>
  );
}
