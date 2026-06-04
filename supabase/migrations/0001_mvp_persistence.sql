create extension if not exists "pgcrypto";

create table if not exists conversation_sessions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'started',
  language text not null default 'nl',
  region text not null default 'Vlaanderen',
  safety_flag boolean not null default false,
  safety_reason text,
  mission_priority boolean not null default false,
  mission_priority_reason text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists conversation_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references conversation_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  safety_flag boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists guidance_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references conversation_sessions(id) on delete cascade,
  title text not null,
  summary text not null,
  result_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists founder_alerts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references conversation_sessions(id) on delete cascade,
  priority text not null check (priority in ('crisis', 'hoog', 'middel', 'laag')),
  reason text not null,
  summary text not null,
  status text not null default 'open' check (status in ('open', 'bekeken', 'gesloten')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists feedback_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references conversation_sessions(id) on delete set null,
  guidance_result_id uuid references guidance_results(id) on delete set null,
  rating text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists conversation_messages_session_id_idx on conversation_messages(session_id);
create index if not exists guidance_results_session_id_idx on guidance_results(session_id);
create index if not exists founder_alerts_status_created_at_idx on founder_alerts(status, created_at desc);
create index if not exists feedback_entries_session_id_idx on feedback_entries(session_id);

alter table conversation_sessions enable row level security;
alter table conversation_messages enable row level security;
alter table guidance_results enable row level security;
alter table founder_alerts enable row level security;
alter table feedback_entries enable row level security;

-- MVP note:
-- Public users do not write directly to Supabase. Next.js server actions use
-- the service role key for anonymous conversation persistence. Founder access
-- is intentionally unprotected in the UI for Milestone 2 and must be protected
-- before public launch.
