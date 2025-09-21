import { supabaseClient } from '../lib/supabase/client';
import { getServiceClient } from '../lib/supabase/server';
import { InvoiceSchema, Invoice, InvoiceCreateInput, InvoiceUpdateInput } from '../types/project-management';
import { ServiceResult, success, failure } from './result';

const TABLE = 'invoices';
function client() { return getServiceClient() || supabaseClient; }

export async function listInvoicesByProject(projectId: string): Promise<ServiceResult<Invoice[]>> {
    try {
        const c = client();
        if (!c) return success([]);
        const { data, error } = await c.from(TABLE).select('*').eq('project_id', projectId);
        if (error) return failure('LIST_INVOICES_FAILED', error);
        const parsed = InvoiceSchema.array().safeParse(data);
        if (!parsed.success) return failure('INVALID_INVOICE_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) { return failure('LIST_INVOICES_EXCEPTION', e); }
}

export async function createInvoice(input: InvoiceCreateInput): Promise<ServiceResult<Invoice>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).insert(input).select('*').single();
        if (error) return failure('CREATE_INVOICE_FAILED', error);
        const parsed = InvoiceSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_INVOICE_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) { return failure('CREATE_INVOICE_EXCEPTION', e); }
}

export async function updateInvoice(id: string, input: InvoiceUpdateInput): Promise<ServiceResult<Invoice>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).update(input).eq('id', id).select('*').single();
        if (error) return failure('UPDATE_INVOICE_FAILED', error);
        const parsed = InvoiceSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_INVOICE_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) { return failure('UPDATE_INVOICE_EXCEPTION', e); }
}
