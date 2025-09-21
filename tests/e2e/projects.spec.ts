import { test, expect } from '@playwright/test';

// These tests hit the running Next.js dev server's API routes directly.
// Supabase env vars are intentionally absent; route should degrade gracefully.

test.describe('/api/projects', () => {
    test('GET returns list or service error shape', async ({ request, baseURL }) => {
        const res = await request.get(`${baseURL}/api/projects`);
        const status = res.status();
        const body = await res.json();
        if (status === 200) {
            expect(body.success).toBe(true);
            expect(Array.isArray(body.data)).toBe(true);
        } else {
            expect(status).toBe(500); // current behavior without Supabase env
            expect(body.success).toBe(false);
            expect(body.error).toHaveProperty('code');
        }
    });

    test('POST invalid payload returns 400', async ({ request, baseURL }) => {
        const res = await request.post(`${baseURL}/api/projects`, { data: { invalid: true } });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body).toHaveProperty('error');
    });
});
