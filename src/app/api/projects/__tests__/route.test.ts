import { GET, POST } from '../route';
import * as projects from '../../../../services/projects';

jest.mock('../../../../services/projects');

describe('/api/projects route', () => {
    beforeEach(() => jest.clearAllMocks());

    it('GET returns projects list', async () => {
        (projects.listProjects as jest.Mock).mockResolvedValue({ ok: true, data: [{ id: '1', name: 'Test', client_id: 'c', code: 'T', status: 'active', created_at: '', updated_at: '' }] });
        const req = { nextUrl: { searchParams: new Map() } } as any;
        const res = await GET(req);
        expect(res.status).toBe(200);
    });

    it('POST returns 400 on invalid input', async () => {
        const req = { json: async () => ({}) } as any;
        const res = await POST(req);
        expect(res.status).toBe(400);
    });
});
