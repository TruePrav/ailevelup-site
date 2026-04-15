-- Global app settings (singleton row).
-- Used for the preparer (Praveen) signature that auto-injects into every proposal.

create table if not exists app_settings (
  id int primary key default 1,
  preparer_signature_data_url text,
  preparer_name text,
  updated_at timestamptz not null default now(),
  constraint app_settings_single_row check (id = 1)
);

insert into app_settings (id) values (1) on conflict (id) do nothing;
