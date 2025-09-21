import { z } from 'zod';

// =========================
// Enums and Status Types
// =========================
export const ClientStatusEnum = z.enum(['active', 'inactive']);
export const ProjectStatusEnum = z.enum(['planning', 'active', 'review', 'completed', 'on_hold', 'archived']);
export const ProjectPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
export const ProjectTypeEnum = z.enum(['website', 'app', 'api', 'maintenance']);
export const InvoiceStatusEnum = z.enum(['draft', 'sent', 'paid', 'overdue', 'void', 'refunded']);
export const MemberRoleEnum = z.enum(['owner', 'member', 'viewer']);
export const PaymentMethodEnum = z.enum(['bank_transfer', 'stripe', 'wire_transfer', 'paypal', 'cash', 'check']);

// Currency codes (extend as needed)
export const CurrencyEnum = z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']);

// Export type versions
export type ClientStatus = z.infer<typeof ClientStatusEnum>;
export type ProjectStatus = z.infer<typeof ProjectStatusEnum>;
export type ProjectPriority = z.infer<typeof ProjectPriorityEnum>;
export type ProjectType = z.infer<typeof ProjectTypeEnum>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;
export type MemberRole = z.infer<typeof MemberRoleEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export type Currency = z.infer<typeof CurrencyEnum>;

// =========================
// Core Entity Schemas
// =========================

// Client Schema (enhanced with all database fields)
export const ClientSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    email: z.string().email().optional().nullable(),
    company: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    billing_address: z.string().optional().nullable(),
    status: ClientStatusEnum,
    contact_preferences: z.record(z.string(), z.any()).default({}),
    notes: z.string().optional().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
export type Client = z.infer<typeof ClientSchema>;

export const ContactSchema = z.object({
    id: z.string().uuid(),
    client_id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string()
});
export type Contact = z.infer<typeof ContactSchema>;

// Project Schema (enhanced with all database fields)
export const ProjectSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    client_id: z.string().uuid().optional().nullable(),
    name: z.string().min(1),
    code: z.string().min(1),
    description: z.string().optional().nullable(),
    project_type: ProjectTypeEnum.default('website'),
    status: ProjectStatusEnum.default('planning'),
    priority: ProjectPriorityEnum.default('medium'),
    budget_cents: z.number().int().nonnegative().optional().nullable(),
    hourly_rate_cents: z.number().int().nonnegative().optional().nullable(),
    start_date: z.string().date().optional().nullable(),
    end_date: z.string().date().optional().nullable(),
    progress_percentage: z.number().int().min(0).max(100).default(0),
    github_repo_url: z.string().url().optional().nullable(),
    hosting_details: z.record(z.string(), z.any()).default({}),
    tech_stack: z.array(z.string()).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectMemberSchema = z.object({
    id: z.string().uuid(),
    project_id: z.string().uuid(),
    user_id: z.string().uuid(),
    role: MemberRoleEnum,
    created_at: z.string()
});
export type ProjectMember = z.infer<typeof ProjectMemberSchema>;

// Invoice Schema (enhanced with all database fields)
export const InvoiceSchema = z.object({
    id: z.string().uuid(),
    project_id: z.string().uuid(),
    code: z.string().min(1),
    title: z.string().optional().nullable(),
    amount_cents: z.number().int().nonnegative(),
    currency: CurrencyEnum.default('USD'),
    issue_date: z.string().date(),
    due_date: z.string().date().optional().nullable(),
    status: InvoiceStatusEnum.default('draft'),
    invoice_number: z.string().optional().nullable(),
    payment_method: PaymentMethodEnum.optional().nullable(),
    stripe_payment_id: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
export type Invoice = z.infer<typeof InvoiceSchema>;

// Payment Schema (enhanced with all database fields)
export const PaymentSchema = z.object({
    id: z.string().uuid(),
    invoice_id: z.string().uuid(),
    amount_cents: z.number().int().nonnegative(),
    currency: CurrencyEnum.default('USD'),
    method: PaymentMethodEnum.optional().nullable(),
    paid_at: z.string().datetime(),
    reference: z.string().optional().nullable(),
    stripe_payment_id: z.string().optional().nullable(),
    created_at: z.string().datetime()
});
export type Payment = z.infer<typeof PaymentSchema>;

// Comment Schema (for project communication)
export const CommentSchema = z.object({
    id: z.string().uuid(),
    project_id: z.string().uuid(),
    user_id: z.string().uuid(),
    content: z.string().min(1),
    is_internal: z.boolean().default(false),
    mentioned_users: z.array(z.string().uuid()).default([]),
    attachments: z.array(z.any()).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
export type Comment = z.infer<typeof CommentSchema>;

// GitHub Repository Schema
export const GitHubRepoSchema = z.object({
    id: z.string().uuid(),
    project_id: z.string().uuid(),
    repo_url: z.string().url(),
    repo_name: z.string().optional().nullable(),
    last_commit_sha: z.string().optional().nullable(),
    last_commit_date: z.string().datetime().optional().nullable(),
    webhook_secret: z.string().optional().nullable(),
    access_token_encrypted: z.string().optional().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

// Hosting Information Schema
export const HostingInfoSchema = z.object({
    id: z.string().uuid(),
    project_id: z.string().uuid(),
    provider: z.string().optional().nullable(), // vercel, netlify, aws, etc.
    domain: z.string().optional().nullable(),
    ssl_status: z.string().optional().nullable(),
    ssl_expiry: z.string().date().optional().nullable(),
    server_location: z.string().optional().nullable(),
    last_deployment: z.string().datetime().optional().nullable(),
    status: z.string().default('active'),
    monitoring_url: z.string().url().optional().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});
export type HostingInfo = z.infer<typeof HostingInfoSchema>;

// =========================
// Create Input DTOs
// =========================

export const ClientCreateSchema = z.object({
    name: z.string().min(1, 'Client name is required'),
    email: z.string().email().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    billing_address: z.string().optional(),
    status: ClientStatusEnum.default('active'),
    contact_preferences: z.record(z.string(), z.any()).default({}),
    notes: z.string().optional()
});
export type ClientCreateInput = z.infer<typeof ClientCreateSchema>;

export const ProjectCreateSchema = z.object({
    client_id: z.string().uuid().optional(),
    name: z.string().min(1, 'Project name is required'),
    code: z.string().min(1, 'Project code is required'),
    description: z.string().optional(),
    project_type: ProjectTypeEnum.default('website'),
    status: ProjectStatusEnum.default('planning'),
    priority: ProjectPriorityEnum.default('medium'),
    budget_cents: z.number().int().nonnegative().optional(),
    hourly_rate_cents: z.number().int().nonnegative().optional(),
    start_date: z.string().date().optional(),
    end_date: z.string().date().optional(),
    progress_percentage: z.number().int().min(0).max(100).default(0),
    github_repo_url: z.string().url().optional(),
    tech_stack: z.array(z.string()).default([])
});
export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;

export const InvoiceCreateSchema = z.object({
    project_id: z.string().uuid('Valid project ID is required'),
    code: z.string().min(1, 'Invoice code is required'),
    title: z.string().optional(),
    amount_cents: z.number().int().nonnegative('Amount must be non-negative'),
    currency: CurrencyEnum.default('USD'),
    issue_date: z.string().date().optional().default(() => new Date().toISOString().split('T')[0]),
    due_date: z.string().date().optional(),
    status: InvoiceStatusEnum.default('draft'),
    payment_method: PaymentMethodEnum.optional(),
    notes: z.string().optional()
});
export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;

export const CommentCreateSchema = z.object({
    project_id: z.string().uuid('Valid project ID is required'),
    content: z.string().min(1, 'Comment content is required'),
    is_internal: z.boolean().default(false),
    mentioned_users: z.array(z.string().uuid()).default([]),
    attachments: z.array(z.any()).default([])
});
export type CommentCreateInput = z.infer<typeof CommentCreateSchema>;

export const PaymentCreateSchema = z.object({
    invoice_id: z.string().uuid('Valid invoice ID is required'),
    amount_cents: z.number().int().nonnegative('Amount must be non-negative'),
    currency: CurrencyEnum.default('USD'),
    method: PaymentMethodEnum.optional(),
    paid_at: z.string().datetime().optional().default(() => new Date().toISOString()),
    reference: z.string().optional(),
    stripe_payment_id: z.string().optional()
});
export type PaymentCreateInput = z.infer<typeof PaymentCreateSchema>;

// =========================
// Update Input DTOs
// =========================

export const ClientUpdateSchema = ClientCreateSchema.partial();
export type ClientUpdateInput = z.infer<typeof ClientUpdateSchema>;

export const ProjectUpdateSchema = ProjectCreateSchema.partial();
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

export const InvoiceUpdateSchema = InvoiceCreateSchema.partial();
export type InvoiceUpdateInput = z.infer<typeof InvoiceUpdateSchema>;

export const CommentUpdateSchema = z.object({
    content: z.string().min(1).optional(),
    is_internal: z.boolean().optional(),
    mentioned_users: z.array(z.string().uuid()).optional(),
    attachments: z.array(z.any()).optional()
});
export type CommentUpdateInput = z.infer<typeof CommentUpdateSchema>;

// =========================
// Query Parameters & Filters
// =========================

export const ProjectQuerySchema = z.object({
    clientId: z.string().uuid().optional(),
    status: ProjectStatusEnum.optional(),
    priority: ProjectPriorityEnum.optional(),
    project_type: ProjectTypeEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    sort: z.enum(['name', 'created_at', 'updated_at', 'status', 'priority', 'progress_percentage']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
    start_date_from: z.string().date().optional(),
    start_date_to: z.string().date().optional(),
    budget_min: z.number().int().nonnegative().optional(),
    budget_max: z.number().int().nonnegative().optional()
});
export type ProjectQuery = z.infer<typeof ProjectQuerySchema>;

export const ClientQuerySchema = z.object({
    search: z.string().optional(),
    status: ClientStatusEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['name', 'company', 'created_at', 'updated_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc')
});
export type ClientQuery = z.infer<typeof ClientQuerySchema>;

export const InvoiceQuerySchema = z.object({
    projectId: z.string().uuid().optional(),
    status: InvoiceStatusEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['code', 'amount_cents', 'issue_date', 'due_date', 'created_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
    issue_date_from: z.string().date().optional(),
    issue_date_to: z.string().date().optional(),
    due_date_from: z.string().date().optional(),
    due_date_to: z.string().date().optional(),
    amount_min: z.number().int().nonnegative().optional(),
    amount_max: z.number().int().nonnegative().optional()
});
export type InvoiceQuery = z.infer<typeof InvoiceQuerySchema>;

// =========================
// API Response Types
// =========================

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    meta?: {
        timestamp: string;
        requestId?: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        filters?: Record<string, any>;
    };
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
        requestId?: string;
    };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// =========================
// Supabase Database Types
// =========================

// Row types for direct database queries
export interface ClientRow {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    email?: string | null;
    company?: string | null;
    phone?: string | null;
    address?: string | null;
    billing_address?: string | null;
    status: ClientStatus;
    contact_preferences: Record<string, any>;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectRow {
    id: string;
    user_id: string;
    client_id?: string | null;
    name: string;
    code: string;
    description?: string | null;
    project_type: ProjectType;
    status: ProjectStatus;
    priority: ProjectPriority;
    budget_cents?: number | null;
    hourly_rate_cents?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    progress_percentage: number;
    github_repo_url?: string | null;
    hosting_details: Record<string, any>;
    tech_stack: string[];
    created_at: string;
    updated_at: string;
}

export interface InvoiceRow {
    id: string;
    project_id: string;
    code: string;
    title?: string | null;
    amount_cents: number;
    currency: Currency;
    issue_date: string;
    due_date?: string | null;
    status: InvoiceStatus;
    invoice_number?: string | null;
    payment_method?: PaymentMethod | null;
    stripe_payment_id?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

// =========================
// Extended Types with Relations
// =========================

export interface ProjectWithClient extends Project {
    client?: Client | null;
}

export interface ProjectWithInvoices extends Project {
    invoices: Invoice[];
}

export interface ProjectWithMembers extends Project {
    members: ProjectMember[];
}

export interface InvoiceWithProject extends Invoice {
    project: Project;
}

export interface InvoiceWithPayments extends Invoice {
    payments: Payment[];
}

export interface ClientWithProjects extends Client {
    projects: Project[];
}

// Full project with all relations
export interface ProjectFull extends Project {
    client?: Client | null;
    members: ProjectMember[];
    invoices: Invoice[];
    comments: Comment[];
    github_repos: GitHubRepo[];
    hosting_info?: HostingInfo | null;
}

// =========================
// Utility Types
// =========================

export type EntityId = string; // UUID string
export type TimestampString = string; // ISO 8601 datetime string
export type DateString = string; // YYYY-MM-DD date string
export type CentsAmount = number; // Amount in cents (integer)

// Service result types
export interface ServiceSuccess<T> {
    ok: true;
    data: T;
}

export interface ServiceError {
    ok: false;
    error: string;
    cause?: unknown;
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

// =========================
// Form & UI Types
// =========================

export interface FormErrors {
    [key: string]: string | string[] | undefined;
}

export interface TableColumn<T = any> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => any; // Will be React.ReactNode when React is available
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface FilterState {
    search?: string;
    status?: string;
    priority?: string;
    dateRange?: {
        from?: string;
        to?: string;
    };
    amountRange?: {
        min?: number;
        max?: number;
    };
}

// =========================
// Feature Flags & Settings
// =========================

export interface ProjectSettings {
    notifications: {
        email: boolean;
        slack: boolean;
        discord: boolean;
    };
    integrations: {
        github: boolean;
        stripe: boolean;
        hosting: boolean;
    };
    access: {
        client_portal: boolean;
        public_status: boolean;
    };
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    timezone: string;
    date_format: 'US' | 'EU' | 'ISO';
    currency: Currency;
    language: string;
}

// =========================
// Analytics & Reporting Types
// =========================

export interface ProjectMetrics {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_revenue_cents: number;
    outstanding_amount_cents: number;
    avg_project_duration_days: number;
    client_satisfaction_score?: number;
}

export interface ClientMetrics {
    total_clients: number;
    active_clients: number;
    avg_project_value_cents: number;
    retention_rate: number;
    projects_per_client: number;
}

export interface InvoiceMetrics {
    total_invoices: number;
    paid_invoices: number;
    overdue_invoices: number;
    total_billed_cents: number;
    total_paid_cents: number;
    avg_payment_time_days: number;
    payment_success_rate: number;
}
