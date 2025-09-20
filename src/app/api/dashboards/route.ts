/**
 * Dashboards API Route
 * GET /api/dashboards - List all dashboards
 * POST /api/dashboards - Create a new dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { Dashboard, CreateDashboardRequest } from '../../../types';
import { mockDashboards, addDashboard } from '../../../lib/mock-data';

// GET /api/dashboards
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search');

        let filteredDashboards = mockDashboards;

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filteredDashboards = filteredDashboards.filter(dashboard =>
                dashboard.name.toLowerCase().includes(searchLower) ||
                dashboard.description?.toLowerCase().includes(searchLower) ||
                dashboard.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDashboards = filteredDashboards.slice(startIndex, endIndex);

        return NextResponse.json(paginatedDashboards, {
            status: 200,
            headers: {
                'X-Total-Count': filteredDashboards.length.toString(),
                'X-Page': page.toString(),
                'X-Limit': limit.toString(),
            },
        });
    } catch (error) {
        console.error('Error fetching dashboards:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/dashboards
export async function POST(request: NextRequest) {
    try {
        const body: CreateDashboardRequest = await request.json();

        // Validate required fields
        if (!body.name || body.name.trim().length === 0) {
            return NextResponse.json(
                { error: 'Dashboard name is required' },
                { status: 400 }
            );
        }

        // Generate new dashboard ID
        const newId = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newDashboard: Dashboard = {
            id: newId,
            name: body.name.trim(),
            description: body.description?.trim(),
            layout: {
                columns: body.layout?.columns || 12,
                rows: body.layout?.rows || 8,
                gap: body.layout?.gap || 16,
                breakpoints: body.layout?.breakpoints || {
                    mobile: 1,
                    tablet: 2,
                    desktop: 3,
                },
            },
            charts: [],
            isPublic: body.isPublic || false,
            tags: body.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add to mock data store
        addDashboard(newDashboard);

        return NextResponse.json(newDashboard, {
            status: 201,
            headers: {
                'Location': `/api/dashboards/${newId}`,
            },
        });
    } catch (error) {
        console.error('Error creating dashboard:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle unsupported methods
export async function PUT() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}