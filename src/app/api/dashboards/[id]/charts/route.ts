/**
 *import { NextRequest, NextResponse } from 'next/server';
import { Chart, CreateChartRequest } from '../../../../types';
import { findDashboardById } from '../../../../lib/mock-data';shboard Charts API Route
 * GET /api/dashboards/[id]/charts - List all charts in a dashboard
 * POST /api/dashboards/[id]/charts - Create a new chart in a dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { Chart, CreateChartRequest, Dashboard } from '../../../../../types';
import { findDashboardById } from '../../../../../lib/mock-data';

// GET /api/dashboards/[id]/charts
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

        return NextResponse.json(dashboard.charts, { status: 200 });
    } catch (error) {
        console.error('Error fetching dashboard charts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/dashboards/[id]/charts
export async function POST(
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

        const body: CreateChartRequest = await request.json();

        // Validate required fields
        if (!body.type || !body.title || !body.metric) {
            return NextResponse.json(
                { error: 'Chart type, title, and metric are required' },
                { status: 400 }
            );
        }

        // Validate chart type
        const validTypes = ['line', 'bar', 'area', 'pie', 'scatter', 'gauge'];
        if (!validTypes.includes(body.type)) {
            return NextResponse.json(
                { error: 'Invalid chart type' },
                { status: 400 }
            );
        }

        // Generate new chart ID
        const newId = `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newChart: Chart = {
            id: newId,
            dashboardId: id,
            type: body.type,
            title: body.title.trim(),
            metric: body.metric,
            config: body.config || {
                colors: ['#3b82f6'],
                showLegend: true,
                showGrid: true,
                animation: true,
                interactive: true,
            },
            position: body.position || { x: 0, y: 0 },
            size: body.size || { width: 6, height: 4 },
            refreshInterval: body.refreshInterval || 300,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add chart to dashboard
        dashboard.charts.push(newChart);

        return NextResponse.json(newChart, {
            status: 201,
            headers: {
                'Location': `/api/dashboards/${id}/charts/${newId}`,
            },
        });
    } catch (error) {
        console.error('Error creating chart:', error);

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