-- Project Management Database Schema for Supabase MCP
-- This file contains the complete database schema for the project management platform
-- To be executed via Supabase MCP for proper integration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- Core Tables
-- =========================

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT GENERATED ALWAYS AS (lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))) STORED,
  email TEXT,
  company TEXT,
  phone TEXT,
  address TEXT,
  billing_address TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  contact_preferences JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  project_type TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'review', 'completed', 'on_hold', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  budget_cents BIGINT,
  hourly_rate_cents BIGINT,
  start_date DATE,
  end_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  github_repo_url TEXT,
  hosting_details JSONB DEFAULT '{}',
  tech_stack TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  title TEXT,
  amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void', 'refunded')),
  invoice_number TEXT UNIQUE,
  payment_method TEXT,
  stripe_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reference TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  mentioned_users UUID[],
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project members table
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- GitHub repositories table
CREATE TABLE IF NOT EXISTS public.github_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  repo_url TEXT NOT NULL,
  repo_name TEXT,
  last_commit_sha TEXT,
  last_commit_date TIMESTAMPTZ,
  webhook_secret TEXT,
  access_token_encrypted TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hosting information table
CREATE TABLE IF NOT EXISTS public.hosting_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  provider TEXT,
  domain TEXT,
  ssl_status TEXT,
  ssl_expiry DATE,
  server_location TEXT,
  last_deployment TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  monitoring_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Indexes for Performance
-- =========================

-- Clients indexes
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS clients_slug_idx ON public.clients(slug);
CREATE INDEX IF NOT EXISTS clients_status_idx ON public.clients(status);

-- Projects indexes
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_client_id_idx ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_priority_idx ON public.projects(priority);

-- Invoices indexes
CREATE INDEX IF NOT EXISTS invoices_project_id_idx ON public.invoices(project_id);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON public.invoices(status);
CREATE INDEX IF NOT EXISTS invoices_due_date_idx ON public.invoices(due_date);

-- Payments indexes
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS payments_stripe_id_idx ON public.payments(stripe_payment_id) WHERE stripe_payment_id IS NOT NULL;

-- Comments indexes
CREATE INDEX IF NOT EXISTS comments_project_id_idx ON public.comments(project_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);

-- Project members indexes
CREATE INDEX IF NOT EXISTS project_members_user_id_idx ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS project_members_role_idx ON public.project_members(role);

-- GitHub repos indexes
CREATE INDEX IF NOT EXISTS github_repos_project_id_idx ON public.github_repos(project_id);

-- Hosting info indexes
CREATE INDEX IF NOT EXISTS hosting_info_project_id_idx ON public.hosting_info(project_id);
CREATE INDEX IF NOT EXISTS hosting_info_domain_idx ON public.hosting_info(domain) WHERE domain IS NOT NULL;

-- =========================
-- Triggers for updated_at
-- =========================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply triggers to tables with updated_at
CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_invoices
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_github_repos
  BEFORE UPDATE ON public.github_repos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_hosting_info
  BEFORE UPDATE ON public.hosting_info
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- Row Level Security (RLS)
-- =========================

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_info ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Users can manage their own clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can manage their own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Project members can view projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

-- Invoices policies
CREATE POLICY "Users can manage invoices for their projects" ON public.invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = invoices.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can manage payments for their invoices" ON public.payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      JOIN public.projects ON projects.id = invoices.project_id
      WHERE invoices.id = payments.invoice_id
      AND projects.user_id = auth.uid()
    )
  );

-- Comments policies
CREATE POLICY "Users can manage comments on their projects" ON public.comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = comments.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Project members policies
CREATE POLICY "Project owners can manage members" ON public.project_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_members.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- GitHub repos policies
CREATE POLICY "Users can manage GitHub repos for their projects" ON public.github_repos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = github_repos.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Hosting info policies
CREATE POLICY "Users can manage hosting info for their projects" ON public.hosting_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = hosting_info.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- =========================
-- Useful Views for Analytics
-- =========================

-- Project financial summary view
CREATE OR REPLACE VIEW public.project_financials AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.budget_cents,
  COALESCE(SUM(i.amount_cents) FILTER (WHERE i.status IN ('sent', 'paid')), 0) as invoiced_cents,
  COALESCE(SUM(pay.amount_cents), 0) as paid_cents,
  COALESCE(SUM(i.amount_cents) FILTER (WHERE i.status = 'paid'), 0) as confirmed_paid_cents,
  COALESCE(SUM(i.amount_cents) FILTER (WHERE i.status IN ('sent', 'overdue')), 0) as outstanding_cents
FROM public.projects p
LEFT JOIN public.invoices i ON i.project_id = p.id
LEFT JOIN public.payments pay ON pay.invoice_id = i.id
GROUP BY p.id, p.name, p.budget_cents;

-- Project activity summary view
CREATE OR REPLACE VIEW public.project_activity AS
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.status,
  p.progress_percentage,
  (SELECT COUNT(*) FROM public.comments c WHERE c.project_id = p.id) as comment_count,
  (SELECT COUNT(*) FROM public.invoices i WHERE i.project_id = p.id) as invoice_count,
  (SELECT MAX(c.created_at) FROM public.comments c WHERE c.project_id = p.id) as last_activity
FROM public.projects p;

-- Enable RLS on views
ALTER VIEW public.project_financials SET (security_invoker = true);
ALTER VIEW public.project_activity SET (security_invoker = true);