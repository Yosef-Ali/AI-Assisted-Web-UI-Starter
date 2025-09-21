-- Project Management Dashboard - Core Schema
-- Migration: 0001_core_schema.sql
-- Date: 2025-09-20
-- Description: Initial schema for project management platform with clients, projects, invoices, and payments

-- =========================
-- Extensions
-- =========================
create extension if not exists "uuid-ossp";

-- =========================
-- Clients & Contacts
-- =========================
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  slug text generated always as (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) stored,
  email text,
  company text,
  phone text,
  address text,
  billing_address text,
  status text not null default 'active' check (status in ('active','inactive')),
  contact_preferences jsonb default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists clients_slug_idx on public.clients(slug);
create index if not exists clients_status_idx on public.clients(status);
create index if not exists clients_user_id_idx on public.clients(user_id);

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
  user_id uuid references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  code text not null,
  description text,
  project_type text default 'website',
  status text not null default 'planning' check (status in ('planning','active','review','completed','on_hold','archived')),
  priority text default 'medium' check (priority in ('low','medium','high','urgent')),
  budget_cents bigint,
  hourly_rate_cents bigint,
  start_date date,
  end_date date,
  progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  github_repo_url text,
  hosting_details jsonb default '{}',
  tech_stack text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists projects_code_idx on public.projects(code);
create index if not exists projects_client_idx on public.projects(client_id);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_priority_idx on public.projects(priority);

-- =========================
-- Project Members
-- =========================
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member','viewer')),
  created_at timestamptz not null default now()
);

create unique index if not exists project_members_unique on public.project_members(project_id, user_id);
create index if not exists project_members_role_idx on public.project_members(role);
create index if not exists project_members_user_idx on public.project_members(user_id);

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
  status text not null default 'draft' check (status in ('draft','sent','paid','overdue','void','refunded')),
  invoice_number text,
  payment_method text,
  stripe_payment_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists invoices_code_idx on public.invoices(code);
create unique index if not exists invoices_number_idx on public.invoices(invoice_number) where invoice_number is not null;
create index if not exists invoices_project_idx on public.invoices(project_id);
create index if not exists invoices_status_idx on public.invoices(status);
create index if not exists invoices_due_date_idx on public.invoices(due_date);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'USD',
  method text,
  paid_at timestamptz not null default now(),
  reference text,
  stripe_payment_id text,
  created_at timestamptz not null default now()
);

create index if not exists payments_invoice_idx on public.payments(invoice_id);
create index if not exists payments_stripe_idx on public.payments(stripe_payment_id) where stripe_payment_id is not null;

-- =========================
-- Comments (Project Communication)
-- =========================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_internal boolean default false,
  mentioned_users uuid[],
  attachments jsonb default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_project_idx on public.comments(project_id);
create index if not exists comments_user_idx on public.comments(user_id);
create index if not exists comments_created_idx on public.comments(created_at desc);

-- =========================
-- GitHub Integration
-- =========================
create table if not exists public.github_repos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  repo_url text not null,
  repo_name text,
  last_commit_sha text,
  last_commit_date timestamptz,
  webhook_secret text,
  access_token_encrypted text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists github_repos_project_idx on public.github_repos(project_id);
create index if not exists github_repos_url_idx on public.github_repos(repo_url);

-- =========================
-- Hosting Information
-- =========================
create table if not exists public.hosting_info (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  provider text, -- vercel, netlify, aws, etc.
  domain text,
  ssl_status text,
  ssl_expiry date,
  server_location text,
  last_deployment timestamptz,
  status text default 'active',
  monitoring_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hosting_info_project_idx on public.hosting_info(project_id);
create index if not exists hosting_info_domain_idx on public.hosting_info(domain) where domain is not null;

-- =========================
-- Updated-at triggers
-- =========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end; $$;

-- Attach triggers to tables with updated_at
create trigger set_updated_at_clients before update on public.clients
for each row execute function public.set_updated_at();

create trigger set_updated_at_projects before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_updated_at_invoices before update on public.invoices
for each row execute function public.set_updated_at();

create trigger set_updated_at_contacts before update on public.contacts
for each row execute function public.set_updated_at();

create trigger set_updated_at_comments before update on public.comments
for each row execute function public.set_updated_at();

create trigger set_updated_at_github_repos before update on public.github_repos
for each row execute function public.set_updated_at();

create trigger set_updated_at_hosting_info before update on public.hosting_info
for each row execute function public.set_updated_at();

-- =========================
-- Row Level Security (RLS) Policies
-- =========================

-- Enable RLS on all tables
alter table public.clients enable row level security;
alter table public.contacts enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.comments enable row level security;
alter table public.github_repos enable row level security;
alter table public.hosting_info enable row level security;

-- Clients policies
create policy "Users can manage their own clients" on public.clients
for all using (auth.uid() = user_id);

-- Contacts policies
create policy "Users can manage contacts of their clients" on public.contacts
for all using (
  exists (
    select 1 from public.clients 
    where clients.id = contacts.client_id 
    and clients.user_id = auth.uid()
  )
);

-- Projects policies
create policy "Users can manage their own projects" on public.projects
for all using (auth.uid() = user_id);

create policy "Project members can view projects" on public.projects
for select using (
  exists (
    select 1 from public.project_members 
    where project_members.project_id = projects.id 
    and project_members.user_id = auth.uid()
  )
);

-- Project members policies
create policy "Project owners can manage members" on public.project_members
for all using (
  exists (
    select 1 from public.projects 
    where projects.id = project_members.project_id 
    and projects.user_id = auth.uid()
  )
);

create policy "Users can view their own memberships" on public.project_members
for select using (auth.uid() = user_id);

-- Invoices policies
create policy "Users can manage invoices for their projects" on public.invoices
for all using (
  exists (
    select 1 from public.projects 
    where projects.id = invoices.project_id 
    and projects.user_id = auth.uid()
  )
);

-- Payments policies
create policy "Users can manage payments for their invoices" on public.payments
for all using (
  exists (
    select 1 from public.invoices 
    join public.projects on projects.id = invoices.project_id
    where invoices.id = payments.invoice_id 
    and projects.user_id = auth.uid()
  )
);

-- Comments policies
create policy "Users can manage comments on their projects" on public.comments
for all using (
  exists (
    select 1 from public.projects 
    where projects.id = comments.project_id 
    and projects.user_id = auth.uid()
  )
);

create policy "Project members can view and add comments" on public.comments
for select using (
  exists (
    select 1 from public.project_members 
    where project_members.project_id = comments.project_id 
    and project_members.user_id = auth.uid()
  )
);

-- GitHub repos policies
create policy "Users can manage GitHub repos for their projects" on public.github_repos
for all using (
  exists (
    select 1 from public.projects 
    where projects.id = github_repos.project_id 
    and projects.user_id = auth.uid()
  )
);

-- Hosting info policies
create policy "Users can manage hosting info for their projects" on public.hosting_info
for all using (
  exists (
    select 1 from public.projects 
    where projects.id = hosting_info.project_id 
    and projects.user_id = auth.uid()
  )
);

-- =========================
-- Useful Views
-- =========================

-- Project financial summary
create view public.project_financials as
select 
  p.id as project_id,
  p.name as project_name,
  p.budget_cents,
  coalesce(sum(i.amount_cents) filter (where i.status in ('sent','paid')), 0) as invoiced_cents,
  coalesce(sum(pay.amount_cents), 0) as paid_cents,
  coalesce(sum(i.amount_cents) filter (where i.status = 'paid'), 0) as confirmed_paid_cents,
  coalesce(sum(i.amount_cents) filter (where i.status in ('sent','overdue')), 0) as outstanding_cents
from public.projects p
left join public.invoices i on i.project_id = p.id
left join public.payments pay on pay.invoice_id = i.id
group by p.id, p.name, p.budget_cents;

-- Project activity summary
create view public.project_activity as
select 
  p.id as project_id,
  p.name as project_name,
  p.status,
  p.progress_percentage,
  (select count(*) from public.comments c where c.project_id = p.id) as comment_count,
  (select count(*) from public.invoices i where i.project_id = p.id) as invoice_count,
  (select max(c.created_at) from public.comments c where c.project_id = p.id) as last_activity
from public.projects p;

-- Enable RLS on views
alter view public.project_financials set (security_invoker = true);
alter view public.project_activity set (security_invoker = true);