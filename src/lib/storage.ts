import type { JournalEntry, UserPreferences } from '../types';
import { supabase } from './supabase';

const PREFERENCES_KEY = 'journal_preferences';

// ─── Supabase CRUD for journal_entries ───────────────────────────────────────

export async function saveEntry(entry: JournalEntry, userId: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .upsert(
      {
        id: entry.id,
        user_id: userId,
        title: entry.title,
        body: entry.body,
        mood: entry.mood,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
      },
      { onConflict: 'id' },
    );
  if (error) throw error;
}

export async function loadAllEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, title, body, mood, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    body: (row.body ?? '') as string,
    mood: (row.mood ?? 'calm') as JournalEntry['mood'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── Preferences (localStorage) ──────────────────────────────────────────────

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  } catch {
    // non-critical
  }
}

export async function loadPreferences(): Promise<UserPreferences | null> {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    return raw ? (JSON.parse(raw) as UserPreferences) : null;
  } catch {
    return null;
  }
}

export function exportEntriesToJSON(entries: JournalEntry[]): void {
  const data = JSON.stringify(entries, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `journal-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
