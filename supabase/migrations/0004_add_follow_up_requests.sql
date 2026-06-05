create table if not exists follow_up_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references conversation_sessions(id) on delete cascade,
  guidance_result_id uuid references guidance_results(id) on delete set null,
  founder_alert_id uuid references founder_alerts(id) on delete set null,
  requested_follow_up text not null check (requested_follow_up in ('later_op_terugkomen', 'verdere_opvolging')),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  municipality text,
  preferred_contact text not null,
  reason text,
  key_themes text,
  urgency_level text not null default 'laag',
  suggested_next_step text,
  status text not null default 'open' check (status in ('open', 'bekeken', 'gesloten')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists follow_up_requests_status_created_at_idx
  on follow_up_requests(status, created_at desc);

create index if not exists follow_up_requests_session_id_idx
  on follow_up_requests(session_id);

alter table follow_up_requests enable row level security;
