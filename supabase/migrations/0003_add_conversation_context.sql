alter table conversation_sessions
  add column if not exists context_json jsonb not null default '{}'::jsonb;
