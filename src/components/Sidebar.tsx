import React, { useState } from 'react';
import { BookOpen, Plus, Menu, X } from 'lucide-react';
import type { JournalEntry, Mood } from '../types';
import { EntryListItem } from './EntryListItem';
import { SearchInput } from './SearchInput';
import { MoodFilterChips } from './MoodFilterChips';
import { ThemeToggle } from './ThemeToggle';
import { ExportButton } from './ExportButton';
import { EmptyState } from './EmptyState';

interface SidebarProps {
  entries: JournalEntry[];
  filteredEntries: JournalEntry[];
  activeEntryId: string | null;
  searchQuery: string;
  moodFilter: Mood | null;
  theme: 'light' | 'dark';
  onNewEntry: () => void;
  onSelectEntry: (id: string) => void;
  onSearch: (q: string) => void;
  onMoodFilter: (mood: Mood | null) => void;
  onThemeToggle: () => void;
  onExportSuccess: () => void;
}

export function Sidebar({
  entries,
  filteredEntries,
  activeEntryId,
  searchQuery,
  moodFilter,
  theme,
  onNewEntry,
  onSelectEntry,
  onSearch,
  onMoodFilter,
  onThemeToggle,
  onExportSuccess,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}
      >
        <BookOpen size={26} color="var(--primary)" strokeWidth={1.8} />
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          My Journal
        </h3>
      </div>

      {/* New Entry Button */}
      <button
        onClick={() => {
          onNewEntry();
          setMobileOpen(false);
        }}
        style={{
          width: '100%',
          background: 'var(--primary)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '20px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 150ms ease',
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
        <Plus size={18} />
        New Entry
      </button>

      {/* Search */}
      <SearchInput value={searchQuery} onChange={onSearch} />

      {/* Mood filter */}
      <MoodFilterChips active={moodFilter} onChange={onMoodFilter} />

      {/* Entry count */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '8px',
          fontWeight: 500,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        }}
      >
        {filteredEntries.length === entries.length
          ? `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`
          : `${filteredEntries.length} of ${entries.length}`}
      </div>

      {/* Entry list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          margin: '0 -16px',
          padding: '0 16px',
        }}
      >
        {entries.length === 0 ? (
          <div style={{ paddingTop: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No entries yet
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div style={{ paddingTop: '24px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No entries match your search
            </p>
          </div>
        ) : (
          filteredEntries.map((entry, i) => (
            <EntryListItem
              key={entry.id}
              entry={entry}
              isActive={entry.id === activeEntryId}
              index={i}
              onClick={() => {
                onSelectEntry(entry.id);
                setMobileOpen(false);
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {entries.length} total
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <ExportButton entries={entries} onSuccess={onExportSuccess} />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 200,
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-primary)',
        }}
        className="mobile-menu-btn"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 90,
          }}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        aria-label="Journal navigation"
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'var(--bg-surface-alt)',
          borderRight: '1px solid var(--border)',
          padding: '24px 16px',
          overflowY: 'auto',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 250ms ease',
        }}
        className="sidebar-desktop"
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <aside
        aria-label="Journal navigation"
        style={{
          width: '300px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'var(--bg-surface-alt)',
          borderRight: '1px solid var(--border)',
          padding: '24px 16px',
          overflowY: 'auto',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 250ms ease',
          boxShadow: mobileOpen ? 'var(--shadow-3)' : 'none',
        }}
        className="sidebar-mobile"
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
          }}
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
          .sidebar-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
