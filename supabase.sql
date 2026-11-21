-- Flipside leaderboard table for Supabase (run once in the SQL editor)
create table if not exists public.scores (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 12),
  score integer not null check (score >= 0 and score < 10000000),
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;

-- anyone can read the board
create policy "read scores" on public.scores for select using (true);
-- anyone can add a score (no updates or deletes from the browser)
create policy "insert scores" on public.scores for insert with check (true);

create index if not exists scores_score_idx on public.scores (score desc);
