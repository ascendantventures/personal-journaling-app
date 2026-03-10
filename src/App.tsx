import React, { useReducer, useEffect, useMemo, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, AppAction, JournalEntry, Mood } from './types';
import type { User } from './lib/auth';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { EntryView } from './components/EntryView';
import { CalendarHeatMap } from './components/CalendarHeatMap';
import { EmptyState } from './components/EmptyState';
import { Toast } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Calendar } from 'lucide-react';
import {
  saveEntry,
  loadAllEntries,
  deleteEntry as storageDeleteEntry,
  savePreferences,
  loadPreferences,
} from './lib/storage';
import { onAuthStateChange, signOut as authSignOut } from './lib/auth';

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: AppState = {
  entries: [],
  activeEntryId: null,
  view: 'read',
  searchQuery: '',
  moodFilter: null,
  dateFilter: null,
  theme: 'light',
  isLoading: true,
  toastMessage: null,
  toastType: 'success',
  confirmDialog: { open: false, title: '', message: '', onConfirm: null },
  unsavedChanges: false,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_ENTRIES':
      return { ...state, entries: action.entries, isLoading: false };
    case 'LOAD_PREFERENCES':
      return { ...state, theme: action.theme };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'ADD_ENTRY': {
      const entries = [action.entry, ...state.entries];
      return {
        ...state,
        entries,
        activeEntryId: action.entry.id,
        view: 'read',
        unsavedChanges: false,
      };
    }
    case 'UPDATE_ENTRY': {
      const entries = state.entries.map((e) =>
        e.id === action.entry.id ? action.entry : e,
      );
      return { ...state, entries, view: 'read', unsavedChanges: false };
    }
    case 'DELETE_ENTRY': {
      const entries = state.entries.filter((e) => e.id !== action.id);
      return {
        ...state,
        entries,
        activeEntryId: state.activeEntryId === action.id ? null : state.activeEntryId,
        view: state.activeEntryId === action.id ? 'read' : state.view,
      };
    }
    case 'SET_ACTIVE_ENTRY':
      return { ...state, activeEntryId: action.id, view: 'read', unsavedChanges: false };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'SET_MOOD_FILTER':
      return { ...state, moodFilter: action.mood };
    case 'SET_DATE_FILTER':
      return { ...state, dateFilter: action.date };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.message, toastType: action.toastType };
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };
    case 'SHOW_CONFIRM':
      return {
        ...state,
        confirmDialog: {
          open: true,
          title: action.title,
          message: action.message,
          onConfirm: action.onConfirm,
        },
      };
    case 'HIDE_CONFIRM':
      return {
        ...state,
        confirmDialog: { open: false, title: '', message: '', onConfirm: null },
      };
    case 'SET_UNSAVED':
      return { ...state, unsavedChanges: action.unsaved };
    default:
      return state;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hydrate from storage on mount (only when authenticated)
  useEffect(() => {
    if (!user) return;
    async function init() {
      try {
        const [entries, prefs] = await Promise.all([loadAllEntries(user!.id), loadPreferences()]);
        dispatch({ type: 'LOAD_ENTRIES', entries });

        // Theme: prefs > prefers-color-scheme
        if (prefs?.theme) {
          dispatch({ type: 'LOAD_PREFERENCES', theme: prefs.theme });
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          dispatch({ type: 'LOAD_PREFERENCES', theme: prefersDark ? 'dark' : 'light' });
        }
      } catch {
        dispatch({ type: 'SET_LOADING', loading: false });
        dispatch({
          type: 'SHOW_TOAST',
          message: 'Failed to load journal entries.',
          toastType: 'error',
        });
      }
    }
    init();
  }, [user]);

  // Apply theme to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (state.theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [state.theme]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    let result = state.entries;

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q),
      );
    }

    if (state.moodFilter) {
      result = result.filter((e) => e.mood === state.moodFilter);
    }

    if (state.dateFilter) {
      result = result.filter((e) => {
        const d = new Date(e.createdAt);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return dateStr === state.dateFilter;
      });
    }

    return result;
  }, [state.entries, state.searchQuery, state.moodFilter, state.dateFilter]);

  const activeEntry = state.entries.find((e) => e.id === state.activeEntryId) ?? null;

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handleNewEntry = useCallback(() => {
    if (state.unsavedChanges && state.view === 'edit') {
      dispatch({
        type: 'SHOW_CONFIRM',
        title: 'Discard changes?',
        message: 'You have unsaved changes. If you continue, your changes will be lost.',
        onConfirm: () => {
          dispatch({ type: 'HIDE_CONFIRM' });
          dispatch({ type: 'SET_ACTIVE_ENTRY', id: null });
          dispatch({ type: 'SET_VIEW', view: 'edit' });
          dispatch({ type: 'SET_UNSAVED', unsaved: false });
        },
      });
    } else {
      dispatch({ type: 'SET_ACTIVE_ENTRY', id: null });
      dispatch({ type: 'SET_VIEW', view: 'edit' });
    }
  }, [state.unsavedChanges, state.view]);

  const handleSelectEntry = useCallback(
    (id: string) => {
      if (state.unsavedChanges && state.view === 'edit') {
        dispatch({
          type: 'SHOW_CONFIRM',
          title: 'Discard changes?',
          message: 'You have unsaved changes. If you continue, your changes will be lost.',
          onConfirm: () => {
            dispatch({ type: 'HIDE_CONFIRM' });
            dispatch({ type: 'SET_ACTIVE_ENTRY', id });
          },
        });
      } else {
        dispatch({ type: 'SET_ACTIVE_ENTRY', id });
      }
    },
    [state.unsavedChanges, state.view],
  );

  const handleSave = useCallback(
    async (data: { title: string; body: string; mood: Mood }) => {
      if (!user) return;
      const now = new Date().toISOString();
      try {
        if (activeEntry) {
          // Update
          const updated: JournalEntry = { ...activeEntry, ...data, updatedAt: now };
          await saveEntry(updated, user.id);
          dispatch({ type: 'UPDATE_ENTRY', entry: updated });
          dispatch({ type: 'SHOW_TOAST', message: 'Entry updated.', toastType: 'success' });
        } else {
          // Create
          const newEntry: JournalEntry = {
            id: uuidv4(),
            ...data,
            createdAt: now,
            updatedAt: now,
          };
          await saveEntry(newEntry, user.id);
          dispatch({ type: 'ADD_ENTRY', entry: newEntry });
          dispatch({ type: 'SHOW_TOAST', message: 'Entry saved.', toastType: 'success' });
        }
      } catch {
        dispatch({
          type: 'SHOW_TOAST',
          message: 'Failed to save entry. Please try again.',
          toastType: 'error',
        });
      }
    },
    [activeEntry, user],
  );

  const handleEdit = useCallback(() => {
    dispatch({ type: 'SET_VIEW', view: 'edit' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    if (state.unsavedChanges) {
      dispatch({
        type: 'SHOW_CONFIRM',
        title: 'Discard changes?',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        onConfirm: () => {
          dispatch({ type: 'HIDE_CONFIRM' });
          dispatch({ type: 'SET_UNSAVED', unsaved: false });
          if (activeEntry) {
            dispatch({ type: 'SET_VIEW', view: 'read' });
          } else {
            dispatch({ type: 'SET_ACTIVE_ENTRY', id: null });
          }
        },
      });
    } else {
      if (activeEntry) {
        dispatch({ type: 'SET_VIEW', view: 'read' });
      } else {
        dispatch({ type: 'SET_ACTIVE_ENTRY', id: null });
      }
    }
  }, [state.unsavedChanges, activeEntry]);

  const handleDeleteRequest = useCallback(() => {
    if (!activeEntry) return;
    dispatch({
      type: 'SHOW_CONFIRM',
      title: 'Delete entry?',
      message: `Are you sure you want to delete "${activeEntry.title || 'this entry'}"? This action cannot be undone.`,
      onConfirm: async () => {
        dispatch({ type: 'HIDE_CONFIRM' });
        try {
          await storageDeleteEntry(activeEntry.id);
          dispatch({ type: 'DELETE_ENTRY', id: activeEntry.id });
          dispatch({ type: 'SHOW_TOAST', message: 'Entry deleted.', toastType: 'success' });
        } catch {
          dispatch({
            type: 'SHOW_TOAST',
            message: 'Failed to delete entry.',
            toastType: 'error',
          });
        }
      },
    });
  }, [activeEntry]);

  const handleLogout = useCallback(async () => {
    await authSignOut();
    dispatch({ type: 'LOAD_ENTRIES', entries: [] });
    dispatch({ type: 'SET_ACTIVE_ENTRY', id: null });
  }, []);

  const handleThemeToggle = useCallback(async () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', theme: newTheme });
    try {
      await savePreferences({ theme: newTheme });
    } catch {
      // non-critical
    }
  }, [state.theme]);

  const handleUnsavedChange = useCallback((hasChanges: boolean) => {
    dispatch({ type: 'SET_UNSAVED', unsaved: hasChanges });
  }, []);

  // ─── Render main panel content ───────────────────────────────────────────────

  function renderMain() {
    if (state.isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    if (state.view === 'calendar') {
      return (
        <CalendarHeatMap
          entries={state.entries}
          onDateFilter={(date) => dispatch({ type: 'SET_DATE_FILTER', date })}
          activeDateFilter={state.dateFilter}
        />
      );
    }

    if (state.view === 'edit') {
      return (
        <Editor
          entry={activeEntry}
          onSave={handleSave}
          onCancel={handleCancelEdit}
          onUnsavedChange={handleUnsavedChange}
        />
      );
    }

    // Read view
    if (activeEntry) {
      return (
        <EntryView
          entry={activeEntry}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      );
    }

    // No active entry
    if (state.entries.length === 0) {
      return <EmptyState type="welcome" onNewEntry={handleNewEntry} />;
    }

    return <EmptyState type="select-entry" />;
  }

  // Show loading spinner while auth state is being determined
  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E7E5E4', borderTopColor: '#C2410C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Show auth screens when not logged in
  if (!user) {
    if (authView === 'signup') {
      return <SignupForm onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginForm onSwitchToSignup={() => setAuthView('signup')} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar
        entries={state.entries}
        filteredEntries={filteredEntries}
        activeEntryId={state.activeEntryId}
        searchQuery={state.searchQuery}
        moodFilter={state.moodFilter}
        theme={state.theme}
        userEmail={user.email ?? ''}
        onNewEntry={handleNewEntry}
        onSelectEntry={handleSelectEntry}
        onSearch={(q) => dispatch({ type: 'SET_SEARCH', query: q })}
        onMoodFilter={(mood) => dispatch({ type: 'SET_MOOD_FILTER', mood })}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
        onExportSuccess={() =>
          dispatch({ type: 'SHOW_TOAST', message: 'Journal exported.', toastType: 'success' })
        }
      />

      {/* Main content area */}
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          padding: '48px 32px',
        }}
        className="main-content"
      >
        {/* Calendar toggle */}
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto 24px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={() =>
              dispatch({
                type: 'SET_VIEW',
                view: state.view === 'calendar' ? (activeEntry ? 'read' : 'read') : 'calendar',
              })
            }
            title={state.view === 'calendar' ? 'Back to entries' : 'Calendar view'}
            aria-label={state.view === 'calendar' ? 'Back to entries' : 'View calendar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: state.view === 'calendar' ? 'var(--primary)' : 'var(--bg-surface)',
              color: state.view === 'calendar' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              if (state.view !== 'calendar') {
                e.currentTarget.style.background = 'var(--bg-surface-alt)';
                e.currentTarget.style.borderColor = 'var(--text-muted)';
              }
            }}
            onMouseLeave={(e) => {
              if (state.view !== 'calendar') {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }
            }}
          >
            <Calendar size={16} />
            {state.view === 'calendar' ? 'Back to entries' : 'Calendar'}
          </button>
        </div>

        {renderMain()}
      </main>

      {/* Toast */}
      {state.toastMessage && (
        <Toast
          message={state.toastMessage}
          type={state.toastType}
          onDismiss={() => dispatch({ type: 'HIDE_TOAST' })}
        />
      )}

      {/* Confirm Dialog */}
      {state.confirmDialog.open && state.confirmDialog.onConfirm && (
        <ConfirmDialog
          title={state.confirmDialog.title}
          message={state.confirmDialog.message}
          onConfirm={state.confirmDialog.onConfirm}
          onCancel={() => dispatch({ type: 'HIDE_CONFIRM' })}
          confirmLabel={
            state.confirmDialog.title.toLowerCase().includes('delete') ? 'Delete' : 'Discard'
          }
          danger={state.confirmDialog.title.toLowerCase().includes('delete')}
        />
      )}

      <style>{`
        @media (max-width: 767px) {
          .main-content {
            margin-left: 0 !important;
            padding: 72px 16px 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
