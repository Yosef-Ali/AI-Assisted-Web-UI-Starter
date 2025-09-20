/**
 * Dashboard Component
 * Main dashboard component that orchestrates charts and layout
 */

'use client';

import React from 'react';
import { DashboardGrid, useDashboardGrid, ChartContainer } from './index';
import { DynamicChart, preloadChart } from '../charts/LazyCharts';
import { cn } from '../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { a11yUtils, useA11yAnnouncer } from '../../lib/accessibility';
import { usePerformanceMonitoring, checkPerformanceBudget } from '../../lib/performance';

interface ChartConfig {
    id: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'gauge';
    title: string;
    metric: string;
    data?: any[];
    position: { x: number; y: number };
    size: { width: number; height: number };
    config?: {
        colors?: string[];
        showGrid?: boolean;
        showLegend?: boolean;
        showTooltip?: boolean;
        animation?: boolean;
        [key: string]: any;
    };
}

interface DashboardProps {
    id?: string;
    title?: string;
    charts: ChartConfig[];
    className?: string;
    refreshInterval?: number;
    onChartUpdate?: (chartId: string, updates: Partial<ChartConfig>) => void;
    ariaLabel?: string;
}

export function Dashboard({
    id,
    title,
    charts,
    className,
    refreshInterval = 30000, // 30 seconds
    onChartUpdate,
    ariaLabel = 'Analytics dashboard',
}: DashboardProps) {
    const dashboardId = React.useId();
    const titleId = `${dashboardId}-title`;
    const mainId = `${dashboardId}-main`;
    const { announce } = useA11yAnnouncer();
    const { metrics, isSupported } = usePerformanceMonitoring();

    // Performance monitoring
    React.useEffect(() => {
        if (metrics && isSupported) {
            const budgetCheck = checkPerformanceBudget(metrics);
            if (!budgetCheck.passed) {
                console.warn('Performance budget violations:', budgetCheck.violations);
                // In production, you might want to send this to monitoring service
            }
        }
    }, [metrics, isSupported]);

    // Announce dashboard load
    React.useEffect(() => {
        if (title) {
            announce(`${title} dashboard loaded with ${charts.length} charts`, 'polite');
        }
    }, [title, charts.length, announce]);

    // Query for dashboard data (placeholder - would be replaced with real API)
    const { data: dashboardData, isLoading, error, refetch } = useQuery({
        queryKey: ['dashboard', id],
        queryFn: async () => {
            // Placeholder - replace with actual API call
            return { id, title, charts };
        },
        refetchInterval: refreshInterval,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Convert chart configs to grid items
    const gridItems = React.useMemo(() => {
        return charts.map((chart) => ({
            id: chart.id,
            position: chart.position,
            size: chart.size,
            component: (
                <ChartRenderer
                    chart={chart}
                    onUpdate={onChartUpdate}
                    refreshInterval={refreshInterval}
                />
            ),
        }));
    }, [charts, onChartUpdate, refreshInterval]);

    if (isLoading) {
        return (
            <div className={cn('w-full space-y-4', className)}>
                <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-muted rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={cn('w-full flex items-center justify-center h-64', className)}
                role="alert"
                aria-live="polite"
            >
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-destructive mb-2">
                        Failed to load dashboard
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {error instanceof Error ? error.message : 'An error occurred'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn('w-full space-y-6', className)}
            role="main"
            aria-label={ariaLabel}
            aria-labelledby={title ? titleId : undefined}
        >
            {title && (
                <div className="flex items-center justify-between">
                    <h1 id={titleId} className="text-2xl font-bold">
                        {title}
                    </h1>
                    <button
                        onClick={() => refetch()}
                        className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                        aria-label="Refresh dashboard data"
                    >
                        Refresh
                    </button>
                </div>
            )}

            <main id={mainId} className="space-y-6">
                <DashboardGrid
                    items={gridItems}
                    columns={12}
                    gap={16}
                    ariaLabel={`${title || 'Dashboard'} grid layout`}
                />
            </main>
        </div>
    );
}

// Chart renderer component
function ChartRenderer({
    chart,
    onUpdate,
    refreshInterval,
}: {
    chart: ChartConfig;
    onUpdate?: (chartId: string, updates: Partial<ChartConfig>) => void;
    refreshInterval: number;
}) {
    // Query for chart data (placeholder - would be replaced with real API)
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['chart', chart.id, chart.metric],
        queryFn: async () => {
            // Placeholder - replace with actual API call
            // This would fetch data based on chart.metric
            return generateMockData(chart.type);
        },
        refetchInterval: refreshInterval,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const handleRefresh = React.useCallback(() => {
        refetch();
    }, [refetch]);

    const renderChart = () => {
        if (!data) return null;

        const commonProps = {
            title: chart.title,
            className: 'w-full h-full',
            ...chart.config,
        };

        // Preload chart component for better performance
        React.useEffect(() => {
            preloadChart(chart.type);
        }, [chart.type]);

        return (
            <DynamicChart
                type={chart.type}
                {...commonProps}
                data={data}
                dataKey="value"
                xAxisKey="name"
                nameKey="name"
                xDataKey="x"
                yDataKey="y"
                maxValue={100}
            />
        );
    };

    return (
        <ChartContainer
            title={chart.title}
            isLoading={isLoading}
            error={error?.message || null}
            onRefresh={handleRefresh}
            ariaLabel={`${chart.title} chart`}
        >
            {renderChart()}
        </ChartContainer>
    );
}

// Mock data generator for development
function generateMockData(type: string) {
    const baseData = [
        { name: 'Jan', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Feb', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Mar', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Apr', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'May', value: Math.floor(Math.random() * 100) + 50 },
        { name: 'Jun', value: Math.floor(Math.random() * 100) + 50 },
    ];

    switch (type) {
        case 'scatter':
            return baseData.map(item => ({
                x: Math.floor(Math.random() * 100),
                y: item.value,
                size: Math.floor(Math.random() * 50) + 10,
            }));

        case 'gauge':
            return [{ value: Math.floor(Math.random() * 100) }];

        default:
            return baseData;
    }
}