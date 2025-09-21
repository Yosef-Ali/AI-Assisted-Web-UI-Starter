import { supabaseClient } from '../lib/supabase/client';
import { getServiceClient } from '../lib/supabase/server';
import { ProjectCreateInput, ProjectUpdateInput, ProjectSchema, Project } from '../types/project-management';
import { ServiceResult, success, failure } from './result';

const TABLE = 'projects';

function client() {
    return getServiceClient() || supabaseClient;
}

export async function listProjects(opts: { clientId?: string } = {}): Promise<ServiceResult<Project[]>> {
    try {
        const c = client();
        if (!c) return success([]); // silent no-op if not configured yet
        let query = c.from(TABLE).select('*');
        if (opts.clientId) query = query.eq('client_id', opts.clientId);
        const { data, error } = await query;
        if (error) return failure('LIST_PROJECTS_FAILED', error);
        const parsed = ProjectSchema.array().safeParse(data);
        if (!parsed.success) return failure('INVALID_PROJECT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) {
        return failure('LIST_PROJECTS_EXCEPTION', e);
    }
}

export async function getProject(id: string): Promise<ServiceResult<Project>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).select('*').eq('id', id).single();
        if (error) return failure('GET_PROJECT_FAILED', error);
        const parsed = ProjectSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_PROJECT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) {
        return failure('GET_PROJECT_EXCEPTION', e);
    }
}

export async function createProject(input: ProjectCreateInput): Promise<ServiceResult<Project>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).insert(input).select('*').single();
        if (error) return failure('CREATE_PROJECT_FAILED', error);
        const parsed = ProjectSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_PROJECT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) {
        return failure('CREATE_PROJECT_EXCEPTION', e);
    }
}

export async function updateProject(id: string, input: ProjectUpdateInput): Promise<ServiceResult<Project>> {
    try {
        const c = client();
        if (!c) return failure('NO_CLIENT');
        const { data, error } = await c.from(TABLE).update(input).eq('id', id).select('*').single();
        if (error) return failure('UPDATE_PROJECT_FAILED', error);
        const parsed = ProjectSchema.safeParse(data);
        if (!parsed.success) return failure('INVALID_PROJECT_DATA', parsed.error);
        return success(parsed.data);
    } catch (e) {
        return failure('UPDATE_PROJECT_EXCEPTION', e);
    }
}

export async function archiveProject(id: string): Promise<ServiceResult<Project>> {
    return updateProject(id, { status: 'archived' } as ProjectUpdateInput);
}
