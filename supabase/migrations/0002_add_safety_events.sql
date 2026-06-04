create table if not exists safety_events (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversation_sessions(id) on delete cascade,
  risk_type text,
  risk_level text not null,
  action_taken text not null,
  created_at timestamptz not null default now()
);

create index if not exists safety_events_conversation_id_idx on safety_events(conversation_id);

alter table safety_events enable row level security;
