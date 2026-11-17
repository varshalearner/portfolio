-- Blog storage for the portfolio.
--
-- Run once: Supabase dashboard → SQL Editor → New query → paste this file → Run.
-- Safe to run again: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- Posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null check (length(btrim(title)) > 0),
  description text not null check (length(btrim(description)) > 0),
  date        date not null,
  tags        text[] not null default '{}',
  draft       boolean not null default true,
  cover       text,
  body        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_draft_date_idx on public.posts (draft, date desc);

-- Keep updated_at current on every edit.
create or replace function public.posts_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.posts_set_updated_at();

-- Locked down: row level security on and no policies, so the public (anon) and
-- signed-in (authenticated) API keys can neither read nor write this table.
-- The site reads and the admin panel writes on the server with the service role
-- (secret) key, which bypasses row level security.
alter table public.posts enable row level security;
revoke all on table public.posts from anon, authenticated;
-- The secret key acts as service_role. Grant it explicitly: newer projects can be
-- set to not expose new tables to the API automatically.
grant select, insert, update, delete on table public.posts to service_role;

-- ---------------------------------------------------------------------------
-- Images used in posts (covers and inline images)
-- ---------------------------------------------------------------------------
-- Public bucket: anyone can view an image by its URL; only the server can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Let the API see the new table right away.
notify pgrst, 'reload schema';
