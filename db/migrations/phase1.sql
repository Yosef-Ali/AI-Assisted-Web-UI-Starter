-- Phase 1 Project Management Schema
-- Idempotent-ish: drops are omitted to avoid destructive operations by accident.
-- Execute in Supabase SQL editor or via migration tooling later.

-- =========================
-- Extensions (ensure UUID)
-- =========================
create extension if not exists "uuid-ossp";

-- =========================
-- Clients & Contacts
-- =========================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text generated always as (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) stored,
  status text not null default 'active' check (status in ('active','inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists clients_slug_idx on public.clients(slug);
create index if not exists clients_status_idx on public.clients(status);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  email text not null,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contacts_client_idx on public.contacts(client_id);
create index if not exists contacts_email_idx on public.contacts(email);

-- =========================
-- Projects
-- =========================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  code text not null,
  description text,
  status text not null default 'active' check (status in ('active','archived','completed','on_hold')),
  start_date date,
  end_date date,
  budget_cents bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists projects_code_idx on public.projects(code);
create index if not exists projects_client_idx on public.projects(client_id);
create index if not exists projects_status_idx on public.projects(status);

-- =========================
-- Project Members
-- =========================
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null, -- references auth.users(id) in future auth integration
  role text not null default 'member' check (role in ('owner','member','viewer')),
  created_at timestamptz not null default now()
);
create unique index if not exists project_members_unique on public.project_members(project_id, user_id);
create index if not exists project_members_role_idx on public.project_members(role);

-- =========================
-- Invoices & Payments
-- =========================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text not null,
  title text,
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'USD',
  issue_date date not null default current_date,
  due_date date,
  status text not null default 'draft' check (status in ('draft','sent','paid','overdue','void')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists invoices_code_idx on public.invoices(code);
create index if not exists invoices_project_idx on public.invoices(project_id);
create index if not exists invoices_status_idx on public.invoices(status);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'USD',
  method text,
  paid_at timestamptz not null default now(),
  reference text,
  created_at timestamptz not null default now()
);
create index if not exists payments_invoice_idx on public.payments(invoice_id);

-- =========================
-- Updated-at triggers
-- =========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end; $$;

-- Attach trigger to tables with updated_at
create trigger set_updated_at_clients before update on public.clients
for each row execute function public.set_updated_at();
create trigger set_updated_at_projects before update on public.projects
for each row execute function public.set_updated_at();
create trigger set_updated_at_invoices before update on public.invoices
for each row execute function public.set_updated_at();
create trigger set_updated_at_contacts before update on public.contacts
for each row execute function public.set_updated_at();

-- =========================
-- RLS (Row Level Security) Placeholders (NOT ENABLED YET)
-- IMPORTANT: Phase 1 does NOT enable RLS; these are outline comments only.
-- Future Steps:
-- 1. alter table public.projects enable row level security;
-- 2. create policy "Project owners full" on public.projects for select, update, delete using (
--      exists (select 1 from public.project_members m where m.project_id = id and m.user_id = auth.uid() and m.role = 'owner')
--    );
-- 3. create policy "Project members read" on public.projects for select using (
--      exists (select 1 from public.project_members m where m.project_id = id and m.user_id = auth.uid())
--    );
-- 4. replicate similar pattern for invoices referencing project membership.

-- =========================
-- Seed Helper Comment
-- Use seed script (scripts/seed-projects.ts) to insert initial client/project/invoice during local dev.

-- =========================
-- Simple View (Optional future): aggregated project financial stats
-- create view public.project_financials as
-- select p.id as project_id,
--        coalesce(sum(i.amount_cents) filter (where i.status in ('sent','paid')),0) as invoiced_cents,
--        coalesce(sum(pay.amount_cents),0) as paid_cents
-- from public.projects p
-- left join public.invoices i on i.project_id = p.id
-- left join public.payments pay on pay.invoice_id = i.id
-- group by p.id;

-- End of Phase 1 schema
