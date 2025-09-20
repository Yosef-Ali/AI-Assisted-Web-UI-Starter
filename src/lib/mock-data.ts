/**
 * Mock Data Store
 * Shared mock data for API routes
 */

import { Dashboard } from '../types';

// Mock data store - in a real implementation, this would be a database
export const mockDashboards: Dashboard[] = [
    {
        id: 'dashboard-1',
        name: 'Sales Analytics',
        description: 'Real-time sales performance metrics',
        layout: {
            columns: 12,
            rows: 8,
            gap: 16,
            breakpoints: {
                mobile: 1,
                tablet: 2,
                desktop: 3,
            },
        },
        charts: [
            {
                id: 'chart-1',
                dashboardId: 'dashboard-1',
                type: 'line',
                title: 'Revenue Over Time',
                metric: 'revenue',
                config: {
                    colors: ['#3b82f6'],
                    showLegend: true,
                    showGrid: true,
                    animation: true,
                    interactive: true,
                },
                position: { x: 0, y: 0 },
                size: { width: 6, height: 4 },
                refreshInterval: 300,
                lastUpdated: '2024-01-01T12:00:00Z',
                createdAt: '2024-01-01T10:00:00Z',
                updatedAt: '2024-01-01T12:00:00Z',
            },
        ],
        isPublic: false,
        tags: ['sales', 'analytics'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        id: 'dashboard-2',
        name: 'User Engagement',
        description: 'User behavior and engagement metrics',
        layout: {
            columns: 12,
            rows: 6,
            gap: 16,
            breakpoints: {
                mobile: 1,
                tablet: 2,
                desktop: 3,
            },
        },
        charts: [],
        isPublic: true,
        tags: ['users', 'engagement'],
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
    },
];

// Helper function to find dashboard by ID
export function findDashboardById(id: string): Dashboard | null {
    return mockDashboards.find(dashboard => dashboard.id === id) || null;
}

// Helper function to add dashboard
export function addDashboard(dashboard: Dashboard): void {
    mockDashboards.push(dashboard);
}

// Helper function to update dashboard
export function updateDashboard(id: string, updatedDashboard: Dashboard): void {
    const index = mockDashboards.findIndex(d => d.id === id);
    if (index !== -1) {
        mockDashboards[index] = updatedDashboard;
    }
}

// Helper function to delete dashboard
export function deleteDashboard(id: string): boolean {
    const index = mockDashboards.findIndex(dashboard => dashboard.id === id);
    if (index !== -1) {
        mockDashboards.splice(index, 1);
        return true;
    }
    return false;
}