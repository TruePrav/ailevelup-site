-- Run this in the Supabase SQL editor

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key_hash text not null unique,
  key_prefix text not null,
  scopes text[] not null default array['proposals:read', 'proposals:write']::text[],
  created_at timestamptz not null default now(),
  created_by text,
  last_used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists api_keys_key_hash_idx on api_keys(key_hash);
create index if not exists api_keys_revoked_at_idx on api_keys(revoked_at);

create table if not exists api_audit (
  id uuid primary key default gen_random_uuid(),
  key_id uuid references api_keys(id) on delete set null,
  key_name text,
  actor text,
  method text not null,
  path text not null,
  status int not null,
  summary text,
  ip text,
  ts timestamptz not null default now()
);

create index if not exists api_audit_ts_idx on api_audit(ts desc);
create index if not exists api_audit_key_id_idx on api_audit(key_id);
