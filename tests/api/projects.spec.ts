import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

test.describe('Projects API', () => {
    test.describe('GET /api/projects', () => {
        test('should return projects list with success response format', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/projects`);

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data).toHaveProperty('meta');
            expect(data.meta).toHaveProperty('timestamp');
            expect(data.meta).toHaveProperty('pagination');
            expect(Array.isArray(data.data)).toBe(true);
        });

        test('should handle query parameters validation', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/projects?page=invalid&limit=999`);

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data).toHaveProperty('success', false);
            expect(data).toHaveProperty('error');
            expect(data.error).toHaveProperty('code', 'VALIDATION_ERROR');
            expect(data.error).toHaveProperty('details');
        });

        test('should filter by clientId when provided', async ({ request }) => {
            const clientId = '550e8400-e29b-41d4-a716-446655440001';
            const response = await request.get(`${API_BASE_URL}/projects?clientId=${clientId}`);

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data.success).toBe(true);
            expect(data.meta.pagination).toBeDefined();
        });

        test('should include security headers', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/projects`);

            expect(response.headers()['x-content-type-options']).toBe('nosniff');
            expect(response.headers()['x-frame-options']).toBe('DENY');
            expect(response.headers()['x-xss-protection']).toBe('1; mode=block');
            expect(response.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
        });

        test('should handle pagination parameters', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/projects?page=2&limit=5`);

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data.meta.pagination.page).toBe(2);
            expect(data.meta.pagination.limit).toBe(5);
        });
    });

    test.describe('POST /api/projects', () => {
        test('should create project with valid data', async ({ request }) => {
            const projectData = {
                client_id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Test Project API',
                code: 'TEST-API-' + Date.now(),
                description: 'Project created by API test',
                budget_cents: 100000,
                start_date: '2024-09-01',
                end_date: '2024-12-01',
            };

            const response = await request.post(`${API_BASE_URL}/projects`, {
                data: projectData,
            });

            expect(response.status()).toBe(201);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data.data).toHaveProperty('id');
            expect(data.data.name).toBe(projectData.name);
            expect(data.data.code).toBe(projectData.code);
            expect(data.meta).toHaveProperty('created', true);
        });

        test('should reject invalid project data', async ({ request }) => {
            const invalidData = {
                name: '', // Invalid: empty name
                code: '', // Invalid: empty code
                client_id: 'invalid-uuid', // Invalid: not a UUID
            };

            const response = await request.post(`${API_BASE_URL}/projects`, {
                data: invalidData,
            });

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data).toHaveProperty('success', false);
            expect(data.error).toHaveProperty('code', 'VALIDATION_ERROR');
            expect(data.error).toHaveProperty('details');
            expect(Array.isArray(data.error.details)).toBe(true);
        });

        test('should handle malformed JSON', async ({ request }) => {
            const response = await request.post(`${API_BASE_URL}/projects`, {
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

        test('should include security headers in creation response', async ({ request }) => {
            const projectData = {
                client_id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Security Test Project',
                code: 'SEC-TEST-' + Date.now(),
            };

            const response = await request.post(`${API_BASE_URL}/projects`, {
                data: projectData,
            });

            expect(response.headers()['x-content-type-options']).toBe('nosniff');
            expect(response.headers()['x-frame-options']).toBe('DENY');
        });
    });

    test.describe('OPTIONS /api/projects', () => {
        test('should handle CORS preflight request', async ({ request }) => {
            const response = await request.fetch(`${API_BASE_URL}/projects`, {
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

test.describe('Projects API - Individual Project', () => {
    const TEST_PROJECT_ID = '660e8400-e29b-41d4-a716-446655440001';

    test.describe('GET /api/projects/[id]', () => {
        test('should return single project', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/projects/${TEST_PROJECT_ID}`);

            if (response.status() === 404) {
                // Skip if test data not available
                test.skip();
                return;
            }

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data).toHaveProperty('data');
            expect(data.data).toHaveProperty('id', TEST_PROJECT_ID);
        });

        test('should reject invalid project ID format', async ({ request }) => {
            const response = await request.get(`${API_BASE_URL}/projects/invalid-id`);

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
            expect(data.error.message).toContain('Invalid project ID format');
        });

        test('should return 404 for non-existent project', async ({ request }) => {
            const nonExistentId = '00000000-0000-0000-0000-000000000000';
            const response = await request.get(`${API_BASE_URL}/projects/${nonExistentId}`);

            expect(response.status()).toBe(404);

            const data = await response.json();
            expect(data).toHaveProperty('success', false);
        });
    });

    test.describe('PATCH /api/projects/[id]', () => {
        test('should update project with valid data', async ({ request }) => {
            const updateData = {
                name: 'Updated Project Name',
                description: 'Updated description',
                progress_percentage: 50,
            };

            const response = await request.patch(`${API_BASE_URL}/projects/${TEST_PROJECT_ID}`, {
                data: updateData,
            });

            if (response.status() === 404) {
                // Skip if test data not available
                test.skip();
                return;
            }

            expect(response.status()).toBe(200);

            const data = await response.json();
            expect(data).toHaveProperty('success', true);
            expect(data.meta).toHaveProperty('updated', true);
        });

        test('should reject invalid update data', async ({ request }) => {
            const invalidData = {
                progress_percentage: 150, // Invalid: > 100
                status: 'invalid_status', // Invalid: not in enum
            };

            const response = await request.patch(`${API_BASE_URL}/projects/${TEST_PROJECT_ID}`, {
                data: invalidData,
            });

            expect(response.status()).toBe(400);

            const data = await response.json();
            expect(data.error.code).toBe('VALIDATION_ERROR');
        });
    });

    test.describe('DELETE /api/projects/[id]', () => {
        test('should archive project (soft delete)', async ({ request }) => {
            // Create a project to delete
            const createResponse = await request.post(`${API_BASE_URL}/projects`, {
                data: {
                    client_id: '550e8400-e29b-41d4-a716-446655440001',
                    name: 'Project to Delete',
                    code: 'DELETE-TEST-' + Date.now(),
                },
            });

            if (createResponse.status() !== 201) {
                test.skip();
                return;
            }

            const createdProject = await createResponse.json();
            const projectId = createdProject.data.id;

            // Delete the project
            const deleteResponse = await request.delete(`${API_BASE_URL}/projects/${projectId}`);

            expect(deleteResponse.status()).toBe(200);

            const data = await deleteResponse.json();
            expect(data).toHaveProperty('success', true);
            expect(data.meta).toHaveProperty('archived', true);
        });
    });
});