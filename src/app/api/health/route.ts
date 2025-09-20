/**
 * Health Check API Route
 * GET /api/health
 *
 * Provides health status information for the dashboard service
 */

import { NextRequest, NextResponse } from 'next/server';
import { HealthStatus } from '../../../types';

// Mock health data - in a real implementation, this would check actual service health
const getMockHealthData = (detailed: boolean = false): HealthStatus => {
    const baseHealth: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
    };

    if (!detailed) {
        return baseHealth;
    }

    // Detailed health information
    return {
        ...baseHealth,
        services: {
            database: {
                status: 'healthy',
                responseTime: 45,
                lastChecked: new Date().toISOString(),
            },
            cache: {
                status: 'healthy',
                responseTime: 12,
                lastChecked: new Date().toISOString(),
            },
            metrics: {
                status: 'healthy',
                responseTime: 23,
                lastChecked: new Date().toISOString(),
            },
        },
        system: {
            memory: {
                used: 256 * 1024 * 1024, // 256 MB
                total: 1024 * 1024 * 1024, // 1 GB
                percentage: 25,
            },
            cpu: {
                usage: 15.5,
            },
        },
        database: {
            connectionCount: 5,
            activeConnections: 2,
            responseTime: 45,
        },
        cache: {
            hitRate: 94.2,
            size: 1024 * 1024, // 1 MB
            evictions: 0,
        },
        externalServices: {
            'analytics-api': {
                status: 'healthy',
                responseTime: 120,
                lastChecked: new Date().toISOString(),
            },
            'notification-service': {
                status: 'healthy',
                responseTime: 89,
                lastChecked: new Date().toISOString(),
            },
        },
    };
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const detailed = searchParams.get('detailed') === 'true';

        const healthData = getMockHealthData(detailed);

        return NextResponse.json(healthData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Health check error:', error);

        const errorResponse: HealthStatus = {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}

// Handle unsupported methods
export async function POST() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

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