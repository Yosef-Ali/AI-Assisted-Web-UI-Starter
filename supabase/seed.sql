-- Seed data for Project Management Dashboard
-- This script creates sample data for development and testing

-- Insert sample users (using hardcoded UUIDs for consistency)
-- Note: In real scenarios, users would be created through auth.users table

-- Sample clients
insert into public.clients (id, user_id, name, email, company, phone, status, notes) values 
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Acme Corporation', 'contact@acme.com', 'Acme Corp', '+1-555-0100', 'active', 'Long-term client, prefers email communication'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'TechStart Inc', 'hello@techstart.com', 'TechStart Inc', '+1-555-0200', 'active', 'Startup client, flexible on requirements'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Global Ventures', 'projects@globalventures.com', 'Global Ventures LLC', '+1-555-0300', 'inactive', 'Project completed, may return for future work')
on conflict (id) do nothing;

-- Sample contacts
insert into public.contacts (client_id, name, email, role) values 
  ('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john@acme.com', 'Project Manager'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah@acme.com', 'Technical Lead'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mike Chen', 'mike@techstart.com', 'CEO'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Emma Davis', 'emma@globalventures.com', 'CTO')
on conflict do nothing;

-- Sample projects
insert into public.projects (id, user_id, client_id, name, code, description, project_type, status, priority, budget_cents, hourly_rate_cents, start_date, end_date, progress_percentage, github_repo_url, tech_stack) values 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Corporate Website Redesign', 'ACME-WEB-2024', 'Complete redesign of corporate website with modern UI/UX', 'website', 'active', 'high', 5000000, 15000, '2024-09-01', '2024-12-01', 75, 'https://github.com/acme/website', array['Next.js', 'TypeScript', 'Tailwind CSS']),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Mobile App MVP', 'TECH-APP-2024', 'React Native mobile app for iOS and Android', 'app', 'active', 'urgent', 8000000, 18000, '2024-08-15', '2024-11-15', 45, 'https://github.com/techstart/mobile-app', array['React Native', 'TypeScript', 'Firebase']),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'API Integration Platform', 'ACME-API-2024', 'Custom API integration platform for third-party services', 'api', 'review', 'medium', 3000000, 15000, '2024-07-01', '2024-10-01', 90, 'https://github.com/acme/api-platform', array['Node.js', 'PostgreSQL', 'Docker']),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'E-commerce Platform', 'GLOBAL-ECOM-2024', 'Full-featured e-commerce platform with payment processing', 'website', 'completed', 'high', 12000000, 20000, '2024-03-01', '2024-08-01', 100, 'https://github.com/global/ecommerce', array['Next.js', 'Stripe', 'PostgreSQL'])
on conflict (id) do nothing;

-- Sample project members
insert into public.project_members (project_id, user_id, role) values 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'owner'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'owner'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'owner'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'owner')
on conflict (project_id, user_id) do nothing;

-- Sample invoices
insert into public.invoices (id, project_id, code, title, amount_cents, currency, issue_date, due_date, status, invoice_number) values 
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'INV-ACME-001', 'Website Redesign - Phase 1', 200000, 'USD', '2024-09-01', '2024-09-30', 'paid', 'INV-2024-001'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'INV-ACME-002', 'Website Redesign - Phase 2', 200000, 'USD', '2024-10-01', '2024-10-30', 'sent', 'INV-2024-002'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'INV-TECH-001', 'Mobile App - Initial Development', 300000, 'USD', '2024-08-15', '2024-09-15', 'paid', 'INV-2024-003'),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'INV-API-001', 'API Platform - Final Invoice', 150000, 'USD', '2024-09-15', '2024-10-15', 'overdue', 'INV-2024-004'),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'INV-GLOBAL-001', 'E-commerce Platform - Complete', 1200000, 'USD', '2024-08-01', '2024-08-31', 'paid', 'INV-2024-005')
on conflict (id) do nothing;

-- Sample payments
insert into public.payments (invoice_id, amount_cents, currency, method, paid_at, reference) values 
  ('770e8400-e29b-41d4-a716-446655440001', 200000, 'USD', 'bank_transfer', '2024-09-05 10:30:00+00', 'TXN-ACME-001'),
  ('770e8400-e29b-41d4-a716-446655440003', 300000, 'USD', 'stripe', '2024-09-10 14:15:00+00', 'pi_1234567890'),
  ('770e8400-e29b-41d4-a716-446655440005', 1200000, 'USD', 'wire_transfer', '2024-08-30 09:00:00+00', 'WIRE-GLOBAL-001')
on conflict do nothing;

-- Sample comments
insert into public.comments (project_id, user_id, content, is_internal, created_at) values 
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Initial design mockups have been approved by the client. Moving forward with development.', false, '2024-09-05 16:00:00+00'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Need to discuss responsive design considerations for mobile devices.', true, '2024-09-10 11:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Authentication flow has been implemented. Ready for testing phase.', false, '2024-09-12 14:45:00+00'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'API documentation completed. Client review scheduled for next week.', false, '2024-09-18 09:15:00+00')
on conflict do nothing;

-- Sample GitHub repositories
insert into public.github_repos (project_id, repo_url, repo_name, last_commit_sha, last_commit_date) values 
  ('660e8400-e29b-41d4-a716-446655440001', 'https://github.com/acme/website', 'acme/website', 'abc123def456', '2024-09-19 15:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440002', 'https://github.com/techstart/mobile-app', 'techstart/mobile-app', 'def456ghi789', '2024-09-18 13:20:00+00'),
  ('660e8400-e29b-41d4-a716-446655440003', 'https://github.com/acme/api-platform', 'acme/api-platform', 'ghi789jkl012', '2024-09-15 11:45:00+00')
on conflict do nothing;

-- Sample hosting information
insert into public.hosting_info (project_id, provider, domain, ssl_status, ssl_expiry, server_location, last_deployment, status) values 
  ('660e8400-e29b-41d4-a716-446655440001', 'vercel', 'www.acme.com', 'valid', '2025-09-01', 'us-east-1', '2024-09-19 16:00:00+00', 'active'),
  ('660e8400-e29b-41d4-a716-446655440003', 'aws', 'api.acme.com', 'valid', '2025-07-15', 'us-west-2', '2024-09-15 12:00:00+00', 'active'),
  ('660e8400-e29b-41d4-a716-446655440004', 'netlify', 'shop.globalventures.com', 'valid', '2025-03-01', 'eu-west-1', '2024-08-01 10:30:00+00', 'active')
on conflict do nothing;