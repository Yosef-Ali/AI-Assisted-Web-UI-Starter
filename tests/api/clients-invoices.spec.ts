import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

test.describe('Clients API', () => {
    test.describe('GET /api/clients', () => {
        test('should return clients list with success response format', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/clients`);

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data).toHaveProperty('meta');
            expect(data.meta).toHaveProperty('timestamp');
            expect(data.meta).toHaveProperty('pagination');
            expect(Array.isArray(data.data)).toBe(true);
        });

        test('should handle search parameter', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/clients?search=test`);

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.meta.filters).toHaveProperty('search', 'test');
        });

        test('should handle status filter', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/clients?status=active`);

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.meta.filters).toHaveProperty('status', 'active');
        });

        test('should reject invalid status values', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/clients?status=invalid`);

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
        });

        test('should include security headers', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/clients`);

            expect(response.headers()['x-content-type-options']).toBe('nosniff');
            expect(response.headers()['x-frame-options']).toBe('DENY');
            expect(response.headers()['x-xss-protection']).toBe('1; mode=block');
        });
    });

    test.describe('POST /api/clients', () => {
        test('should create client with valid data', async ({ request }) => {
            const clientData = {
                name: 'Test Client API',
                email: 'test@client.com',
                company: 'Test Company Ltd',
                phone: '+1-555-0123',
                notes: 'Created by API test',
            };

            const response = await request.post(`${API_BASE_URL}/clients`, {
                data: clientData,
            });

            expect(response.status()).toBe(201);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data.data).toHaveProperty('id');
            expect(data.data.name).toBe(clientData.name);
            expect(data.data.email).toBe(clientData.email);
            expect(data.meta).toHaveProperty('created', true);
        });

        test('should create client with minimal required data', async ({ request }) => {
            const clientData = {
                name: 'Minimal Client ' + Date.now(),
            };

            const response = await request.post(`${API_BASE_URL}/clients`, {
                data: clientData,
            });

            expect(response.status()).toBe(201);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.name).toBe(clientData.name);
        });

        test('should reject invalid client data', async ({ request }) => {
            const invalidData = {
                name: '', // Invalid: empty name
                email: 'invalid-email', // Invalid: not email format
            };

            const response = await request.post(`${API_BASE_URL}/clients`, {
                data: invalidData,
            });

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
            expect(Array.isArray(data.error.details)).toBe(true);
        });

        test('should handle malformed JSON', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/clients`, {
                data: 'invalid json',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
            expect(data.error.message).toContain('Invalid JSON');
        });
    });

    test.describe('OPTIONS /api/clients', () => {
        test('should handle CORS preflight request', async ({ request }) => {
            const response = await request.fetch(`${API_BASE_URL}/clients`, {
                method: 'OPTIONS',
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type',
                },
            });

            expect(response.status()).toBe(200);
            expect(response.headers()['access-control-allow-origin']).toBeTruthy();
            expect(response.headers()['access-control-allow-methods']).toContain('POST');
            expect(response.headers()['access-control-allow-headers']).toContain('Content-Type');
        });
    });
});

test.describe('Invoices API', () => {
    const TEST_PROJECT_ID = '660e8400-e29b-41d4-a716-446655440001';

    test.describe('GET /api/invoices', () => {
        test('should return invoices list for project', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/invoices?projectId=${TEST_PROJECT_ID}`);

            if (response.status() === 404) {
                // Skip if test data not available
                test.skip();
                return;
            }

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data).toHaveProperty('meta');
            expect(data.meta.filters).toHaveProperty('projectId', TEST_PROJECT_ID);
            expect(Array.isArray(data.data)).toBe(true);
        });

        test('should require projectId parameter', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/invoices`);

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
            expect(data.error.message).toContain('Project ID is required');
        });

        test('should validate projectId as UUID', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/invoices?projectId=invalid-uuid`);

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
        });

        test('should handle status filter', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/invoices?projectId=${TEST_PROJECT_ID}&status=paid`);

            if (response.status() === 404) {
                test.skip();
                return;
            }

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data.meta.filters).toHaveProperty('status', 'paid');
        });

        test('should reject invalid status values', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/invoices?projectId=${TEST_PROJECT_ID}&status=invalid`);

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
        });
    });

    test.describe('POST /api/invoices', () => {
        test('should create invoice with valid data', async ({ request }) => {
            const invoiceData = {
                project_id: TEST_PROJECT_ID,
                code: 'INV-TEST-' + Date.now(),
                title: 'Test Invoice',
                amount_cents: 150000,
                currency: 'USD',
                due_date: '2024-12-31',
            };

            const response = await request.post(`${API_BASE_URL}/invoices`, {
                data: invoiceData,
            });

            if (response.status() === 404) {
                // Skip if project doesn't exist
                test.skip();
                return;
            }

            expect(response.status()).toBe(201);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data.data).toHaveProperty('id');
            expect(data.data.code).toBe(invoiceData.code);
            expect(data.data.amount_cents).toBe(invoiceData.amount_cents);
            expect(data.meta).toHaveProperty('created', true);
        });

        test('should create invoice with minimal required data', async ({ request }) => {
            const invoiceData = {
                project_id: TEST_PROJECT_ID,
                code: 'MIN-INV-' + Date.now(),
                amount_cents: 100000,
            };

            const response = await request.post(`${API_BASE_URL}/invoices`, {
                data: invoiceData,
            });

            if (response.status() === 404) {
                test.skip();
                return;
            }

            expect(response.status()).toBe(201);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.data.code).toBe(invoiceData.code);
            expect(data.data.currency).toBe('USD'); // Default currency
        });

        test('should reject invalid invoice data', async ({ request }) => {
            const invalidData = {
                project_id: 'invalid-uuid',
                code: '', // Invalid: empty code
                amount_cents: -100, // Invalid: negative amount
            };

            const response = await request.post(`${API_BASE_URL}/invoices`, {
                data: invalidData,
            });

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
            expect(Array.isArray(data.error.details)).toBe(true);
        });

        test('should include security headers', async ({ request }) => {
            const invoiceData = {
                project_id: TEST_PROJECT_ID,
                code: 'SEC-TEST-' + Date.now(),
                amount_cents: 50000,
            };

            const response = await request.post(`${API_BASE_URL}/invoices`, {
                data: invoiceData,
            });

            expect(response.headers()['x-content-type-options']).toBe('nosniff');
            expect(response.headers()['x-frame-options']).toBe('DENY');
        });
    });

    test.describe('OPTIONS /api/invoices', () => {
        test('should handle CORS preflight request', async ({ request }) => {
            const response = await request.fetch(`${API_BASE_URL}/invoices`, {
                method: 'OPTIONS',
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type',
                },
            });

            expect(response.status()).toBe(200);
            expect(response.headers()['access-control-allow-origin']).toBeTruthy();
            expect(response.headers()['access-control-allow-methods']).toContain('POST');
        });
    });
});