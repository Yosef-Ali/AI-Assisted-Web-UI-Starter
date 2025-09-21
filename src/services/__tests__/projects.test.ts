import * as projects from '../projects';
import { Project, ProjectCreateInput } from '../../types/project-management';
import { supabaseChain } from '../../__mocks__/supabaseMock';

jest.mock('../../lib/supabase/client', () => ({
    supabaseClient: {
        from: () => supabaseChain
    }
}));
jest.mock('../../lib/supabase/server', () => ({
    getServiceClient: jest.fn(() => undefined),
}));

describe('projects service', () => {
    it('listProjects returns empty array if no client', async () => {
        const result = await projects.listProjects();
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data).toEqual([]);
        }
    });

    it('getProject returns error if no client', async () => {
        const result = await projects.getProject('id');
        expect(result.ok).toBe(false);
    });

    it('createProject returns error if no client', async () => {
        const input: ProjectCreateInput = {
            client_id: 'uuid',
            name: 'Test',
            code: 'TST',
            project_type: 'website',
            status: 'planning',
            priority: 'medium',
            progress_percentage: 0,
            tech_stack: []
        };
        const result = await projects.createProject(input);
        expect(result.ok).toBe(false);
    });
});
