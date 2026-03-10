-- ============================================================
-- TABLE: journal_entries
-- ⚠️ Uses upsert trigger (PATTERN 2) — BUILD must use upsert()
-- ============================================================

create table if not exists journal_entries (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  body        text,
  mood        text        check (mood in ('happy','calm','grateful','anxious','sad','angry','reflective','energized')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast per-user queries
create index if not exists journal_entries_user_id_idx
  on journal_entries(user_id);

create index if not exists journal_entries_created_at_idx
  on journal_entries(user_id, created_at desc);

-- ⚠️ updated_at trigger — SECURITY DEFINER (PATTERN 11)
create or replace function journal_entries_set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists journal_entries_updated_at on journal_entries;
create trigger journal_entries_updated_at
  before update on journal_entries
  for each row execute function journal_entries_set_updated_at();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

alter table journal_entries enable row level security;

-- Drop existing policies if any (idempotent)
drop policy if exists "journal_entries: select own" on journal_entries;
drop policy if exists "journal_entries: insert own" on journal_entries;
drop policy if exists "journal_entries: update own" on journal_entries;
drop policy if exists "journal_entries: delete own" on journal_entries;

-- Users can only see their own entries
create policy "journal_entries: select own"
  on journal_entries for select
  using (auth.uid() = user_id);

-- Users can only insert entries owned by themselves
create policy "journal_entries: insert own"
  on journal_entries for insert
  with check (auth.uid() = user_id);

-- Users can only update their own entries
create policy "journal_entries: update own"
  on journal_entries for update
  using (auth.uid() = user_id);

-- Users can only delete their own entries
create policy "journal_entries: delete own"
  on journal_entries for delete
  using (auth.uid() = user_id);
