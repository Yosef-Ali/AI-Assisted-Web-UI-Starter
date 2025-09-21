import { InvoiceCreateInput } from '../../types/project-management';
import { supabaseChain } from '../../__mocks__/supabaseMock';

jest.mock('../../lib/supabase/client', () => ({
    supabaseClient: { from: () => supabaseChain }
}));
jest.mock('../../lib/supabase/server', () => ({ getServiceClient: jest.fn(() => undefined) }));

// Import after mocks applied
import * as invoices from '../invoices';

describe('invoices service', () => {
    it('listInvoicesByProject returns empty array', async () => {
        const result = await invoices.listInvoicesByProject('pid');
        expect(result.ok).toBe(true);
        if (result.ok) expect(result.data).toEqual([]);
    });

    it('createInvoice returns error if no client', async () => {
        const input: InvoiceCreateInput = { project_id: 'pid', code: 'INV', amount_cents: 100, currency: 'USD', issue_date: '2024-01-01', status: 'draft' };
        const result = await invoices.createInvoice(input);
        expect(result.ok).toBe(false);
    });

    it('updateInvoice returns error if no client', async () => {
        const result = await invoices.updateInvoice('id', { code: 'NEW' });
        expect(result.ok).toBe(false);
    });
});
