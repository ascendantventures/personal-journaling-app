import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { JournalEntry } from '../types';

interface CalendarHeatMapProps {
  entries: JournalEntry[];
  onDateFilter: (date: string | null) => void;
  activeDateFilter: string | null;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toLocalDateStr(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CalendarHeatMap({ entries, onDateFilter, activeDateFilter }: CalendarHeatMapProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  // Build a map: dateStr -> count
  const countMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of entries) {
      const d = toLocalDateStr(e.createdAt);
      map[d] = (map[d] || 0) + 1;
    }
    return map;
  }, [entries]);

  const navigateMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  // Days in current month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build grid cells
  const cells: Array<{ day: number | null; dateStr: string | null }> = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({ day: null, dateStr: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr });
  }

  const todayStr = toLocalDateStr(new Date().toISOString());
  const monthName = new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  function getCellStyle(count: number, dateStr: string): React.CSSProperties {
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === activeDateFilter;

    let bg = 'transparent';
    let color = 'var(--text-secondary)';
    let fontWeight: number | string = 400;

    if (count === 1) { bg = 'rgba(194, 120, 92, 0.15)'; color = 'var(--text-primary)'; }
    else if (count === 2) { bg = 'rgba(194, 120, 92, 0.30)'; color = 'var(--text-primary)'; fontWeight = 500; }
    else if (count >= 3) { bg = 'var(--primary)'; color = '#fff'; fontWeight = 600; }

    return {
      aspectRatio: '1',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight,
      cursor: count > 0 ? 'pointer' : 'default',
      background: bg,
      color,
      border: isToday ? '2px solid var(--primary)' : '2px solid transparent',
      boxShadow: isSelected ? '0 0 0 2px rgba(194, 120, 92, 0.5)' : 'none',
      transition: 'all 150ms ease',
      position: 'relative' as const,
    };
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-1)',
        animation: 'fadeIn 200ms ease',
        maxWidth: '680px',
        margin: '0 auto',
      }}
    >
      {/* Month header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-alt)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <ChevronLeft size={20} />
        </button>
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {monthName}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-alt)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday labels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px',
        }}
      >
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textAlign: 'center',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {cells.map((cell, i) => {
          if (!cell.day || !cell.dateStr) {
            return <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />;
          }
          const count = countMap[cell.dateStr] || 0;
          const isSelected = cell.dateStr === activeDateFilter;

          return (
            <div
              key={cell.dateStr}
              title={count > 0 ? `${count} entr${count === 1 ? 'y' : 'ies'}` : ''}
              style={getCellStyle(count, cell.dateStr)}
              onClick={() => count > 0 && onDateFilter(isSelected ? null : cell.dateStr)}
              onMouseEnter={(e) => {
                if (count > 0) {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-2)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  isSelected ? '0 0 0 2px rgba(194, 120, 92, 0.5)' : 'none';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              {cell.day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fewer</span>
        {[0, 1, 2, 3].map((level) => (
          <div
            key={level}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '5px',
              background: level === 0
                ? 'var(--bg-surface-alt)'
                : level === 1 ? 'rgba(194,120,92,0.15)'
                : level === 2 ? 'rgba(194,120,92,0.30)'
                : 'var(--primary)',
              border: '1px solid var(--border)',
            }}
          />
        ))}
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>More</span>
      </div>

      {activeDateFilter && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button
            onClick={() => onDateFilter(null)}
            style={{
              fontSize: '13px',
              color: 'var(--primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear date filter
          </button>
        </div>
      )}
    </div>
  );
}
