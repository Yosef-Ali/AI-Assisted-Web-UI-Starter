import { ClientCreateInput, ProjectCreateInput, InvoiceCreateInput } from '../../../src/types/project-management';

export function buildClient(overrides: Partial<ClientCreateInput> = {}): ClientCreateInput {
    return {
        name: 'Test Client',
        status: 'active',
        contact_preferences: {},
        ...overrides,
    };
}

export function buildProject(overrides: Partial<ProjectCreateInput> = {}): ProjectCreateInput {
    return {
        client_id: 'client-uuid',
        name: 'Test Project',
        code: 'TEST-PROJ',
        project_type: 'website',
        status: 'planning',
        priority: 'medium',
        progress_percentage: 0,
        tech_stack: [],
        ...overrides,
    };
}

export function buildInvoice(overrides: Partial<InvoiceCreateInput> = {}): InvoiceCreateInput {
    return {
        project_id: 'project-uuid',
        code: 'INV-TEST',
        amount_cents: 1000,
        currency: 'USD',
        issue_date: '2024-01-01',
        status: 'draft',
        ...overrides,
    };
}
