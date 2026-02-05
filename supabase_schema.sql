-- Run this in Supabase SQL editor
-- Creates profiles + onboarding + documents tables, RLS, and a trigger to bootstrap rows for new auth users.

-- Extensions
create extension if not exists "pgcrypto";

-- 1) Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Onboarding
create table if not exists public.onboarding (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  is_licensed_agent boolean not null default false,
  works_under_agency boolean not null default false,
  agrees_to_rules boolean not null default false,
  verification_status text,
  account_activated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  doc_type text not null,
  status text not null default 'missing',
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, doc_type)
);

-- Minimal constraints
alter table public.documents
  drop constraint if exists documents_doc_type_check;
alter table public.documents
  add constraint documents_doc_type_check
  check (doc_type in ('emiratesId', 'workVisa', 'brokerLicense'));

alter table public.documents
  drop constraint if exists documents_status_check;
alter table public.documents
  add constraint documents_status_check
  check (status in ('missing', 'uploaded', 'verified', 'rejected'));

alter table public.onboarding
  drop constraint if exists onboarding_verification_status_check;
alter table public.onboarding
  add constraint onboarding_verification_status_check
  check (verification_status is null or verification_status in ('pending', 'approved', 'rejected'));

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_onboarding_updated_at on public.onboarding;
create trigger set_onboarding_updated_at
before update on public.onboarding
for each row execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

-- Bootstrap rows when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, '', '')
  on conflict (id) do nothing;

  insert into public.onboarding (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.documents (user_id, doc_type, status)
  values
    (new.id, 'emiratesId', 'missing'),
    (new.id, 'workVisa', 'missing'),
    (new.id, 'brokerLicense', 'missing')
  on conflict (user_id, doc_type) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.onboarding enable row level security;
alter table public.documents enable row level security;

-- RLS policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "onboarding_select_own" on public.onboarding;
create policy "onboarding_select_own" on public.onboarding
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "onboarding_update_own" on public.onboarding;
create policy "onboarding_update_own" on public.onboarding
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "onboarding_insert_own" on public.onboarding;
create policy "onboarding_insert_own" on public.onboarding
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own" on public.documents
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own" on public.documents
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own" on public.documents
for insert
to authenticated
with check (user_id = auth.uid());
