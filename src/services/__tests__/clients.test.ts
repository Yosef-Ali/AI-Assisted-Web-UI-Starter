import * as clients from '../clients';
import { ClientCreateInput } from '../../types/project-management';
import { supabaseChain } from '../../__mocks__/supabaseMock';

jest.mock('../../lib/supabase/client', () => ({
    supabaseClient: {
        from: () => supabaseChain,
    },
}));
jest.mock('../../lib/supabase/server', () => ({
    getServiceClient: jest.fn(() => undefined),
}));

describe('clients service', () => {
    it('listClients returns empty array if no client', async () => {
        const result = await clients.listClients();
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data).toEqual([]);
        }
    });

    it('createClient returns error if no client', async () => {
        const input: ClientCreateInput = { name: 'Test', status: 'active', contact_preferences: {} };
        const result = await clients.createClient(input);
        expect(result.ok).toBe(false);
    });

    it('updateClient returns error if no client', async () => {
        const result = await clients.updateClient('id', { name: 'New' });
        expect(result.ok).toBe(false);
    });
});
