import { supabaseClient } from '../lib/supabase/client';
import { getServiceClient } from '../lib/supabase/server';
import { ClientSchema, Client, ClientCreateInput, ClientUpdateInput } from '../types/project-management';
import { ServiceResult, success, failure } from './result';

const TABLE = 'clients';
function client() { return getServiceClient() || supabaseClient; }

export async function listClients(search?: string): Promise<ServiceResult<Client[]>> {
    try {
        const c = client();
        if (!c) return success([]);
        let query = c.from(TABLE).select('*');
        if (search) query = query.ilike('name', `%${search}%`);
        const { data, error } = await query;
        if (error) return failure('LIST_CLIENTS_FAILED', error);
        const parsed = ClientSchema.array().safeParse(data);
        if (!parsed.success) return failure('INVALID_CLIENT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) { return failure('LIST_CLIENTS_EXCEPTION', e); }
}

export async function createClient(input: ClientCreateInput): Promise<ServiceResult<Client>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).insert(input).select('*').single();
        if (error) return failure('CREATE_CLIENT_FAILED', error);
        const parsed = ClientSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_CLIENT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) { return failure('CREATE_CLIENT_EXCEPTION', e); }
}

export async function updateClient(id: string, input: ClientUpdateInput): Promise<ServiceResult<Client>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).update(input).eq('id', id).select('*').single();
        if (error) return failure('UPDATE_CLIENT_FAILED', error);
        const parsed = ClientSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_CLIENT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) { return failure('UPDATE_CLIENT_EXCEPTION', e); }
}
