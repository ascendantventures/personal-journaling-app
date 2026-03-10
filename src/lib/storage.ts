import type { JournalEntry, UserPreferences } from '../types';

// window.storage type augmentation
declare global {
  interface Window {
    storage?: {
      set(key: string, value: string): Promise<void>;
      get(key: string): Promise<{ value: string } | null>;
      list(prefix: string): Promise<{ keys: string[] }>;
      delete(key: string): Promise<void>;
    };
  }
}

const ENTRY_PREFIX = 'entry:';
const PREFERENCES_KEY = 'preferences';

// Fallback: in-memory store for environments without window.storage
const memStore = new Map<string, string>();

async function storageSet(key: string, value: string): Promise<void> {
  if (window.storage) {
    await window.storage.set(key, value);
  } else {
    memStore.set(key, value);
  }
}

async function storageGet(key: string): Promise<{ value: string } | null> {
  if (window.storage) {
    return window.storage.get(key);
  }
  const val = memStore.get(key);
  return val != null ? { value: val } : null;
}

async function storageList(prefix: string): Promise<{ keys: string[] }> {
  if (window.storage) {
    return window.storage.list(prefix);
  }
  const keys = Array.from(memStore.keys()).filter((k) => k.startsWith(prefix));
  return { keys };
}

async function storageDelete(key: string): Promise<void> {
  if (window.storage) {
    await window.storage.delete(key);
  } else {
    memStore.delete(key);
  }
}

export async function saveEntry(entry: JournalEntry): Promise<void> {
  await storageSet(`${ENTRY_PREFIX}${entry.id}`, JSON.stringify(entry));
}

export async function loadAllEntries(): Promise<JournalEntry[]> {
  const { keys } = await storageList(ENTRY_PREFIX);
  const entries = await Promise.all(
    keys.map(async (key) => {
      try {
        const result = await storageGet(key);
        return result ? (JSON.parse(result.value) as JournalEntry) : null;
      } catch {
        return null;
      }
    }),
  );
  return (entries.filter(Boolean) as JournalEntry[]).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function deleteEntry(id: string): Promise<void> {
  await storageDelete(`${ENTRY_PREFIX}${id}`);
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  await storageSet(PREFERENCES_KEY, JSON.stringify(prefs));
}

export async function loadPreferences(): Promise<UserPreferences | null> {
  try {
    const result = await storageGet(PREFERENCES_KEY);
    return result ? (JSON.parse(result.value) as UserPreferences) : null;
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
