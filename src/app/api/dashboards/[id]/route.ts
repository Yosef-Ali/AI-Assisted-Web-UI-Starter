/**
 * Individual Dashboard API Route
 * GET /api/dashboards/[id] - Get a specific dashboard
 * PUT /api/dashboards/[id] - Update a specific dashboard
 * DELETE /api/dashboards/[id] - Delete a specific dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { Dashboard, UpdateDashboardRequest } from '../../../../types';
import { findDashboardById, updateDashboard, deleteDashboard } from '../../../../lib/mock-data';

// GET /api/dashboards/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dashboard = findDashboardById(id); if (!dashboard) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(dashboard, { status: 200 });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/dashboards/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dashboard = findDashboardById(id); if (!dashboard) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        const body: UpdateDashboardRequest = await request.json();

        // Validate request body
        if (Object.keys(body).length === 0) {
            return NextResponse.json(
                { error: 'Request body cannot be empty' },
                { status: 400 }
            );
        }

        // Update dashboard
        const updatedDashboard: Dashboard = {
            ...dashboard,
            ...body,
            layout: body.layout ? {
                columns: body.layout.columns || dashboard.layout.columns,
                rows: body.layout.rows || dashboard.layout.rows,
                gap: body.layout.gap || dashboard.layout.gap,
                breakpoints: body.layout.breakpoints || dashboard.layout.breakpoints,
            } : dashboard.layout,
            updatedAt: new Date().toISOString(),
        };

        // Update in mock data store
        updateDashboard(id, updatedDashboard);

        return NextResponse.json(updatedDashboard, { status: 200 });
    } catch (error) {
        console.error('Error updating dashboard:', error);

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

// DELETE /api/dashboards/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dashboard = findDashboardById(id);
        if (!dashboard) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        // Remove from mock data store
        const deleted = deleteDashboard(id);
        if (!deleted) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting dashboard:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle unsupported methods
export async function POST() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}