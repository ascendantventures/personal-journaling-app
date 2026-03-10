export type Mood =
  | 'happy'
  | 'calm'
  | 'grateful'
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'reflective'
  | 'energized';

export const ALL_MOODS: Mood[] = [
  'happy', 'calm', 'grateful', 'anxious',
  'sad', 'angry', 'reflective', 'energized',
];

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
}

export type View = 'read' | 'edit' | 'calendar';

export interface AppState {
  entries: JournalEntry[];
  activeEntryId: string | null;
  view: View;
  searchQuery: string;
  moodFilter: Mood | null;
  dateFilter: string | null; // ISO date string YYYY-MM-DD
  theme: 'light' | 'dark';
  isLoading: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error';
  confirmDialog: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  };
  unsavedChanges: boolean;
}

export type AppAction =
  | { type: 'LOAD_ENTRIES'; entries: JournalEntry[] }
  | { type: 'LOAD_PREFERENCES'; theme: 'light' | 'dark' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'ADD_ENTRY'; entry: JournalEntry }
  | { type: 'UPDATE_ENTRY'; entry: JournalEntry }
  | { type: 'DELETE_ENTRY'; id: string }
  | { type: 'SET_ACTIVE_ENTRY'; id: string | null }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_MOOD_FILTER'; mood: Mood | null }
  | { type: 'SET_DATE_FILTER'; date: string | null }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'SHOW_TOAST'; message: string; toastType: 'success' | 'error' }
  | { type: 'HIDE_TOAST' }
  | { type: 'SHOW_CONFIRM'; title: string; message: string; onConfirm: () => void }
  | { type: 'HIDE_CONFIRM' }
  | { type: 'SET_UNSAVED'; unsaved: boolean };
