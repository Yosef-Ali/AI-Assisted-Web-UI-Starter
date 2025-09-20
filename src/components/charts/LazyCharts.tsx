/**
 * Lazy-loaded Chart Components
 * Performance-optimized chart components with code splitting
 */

import React, { lazy, Suspense } from 'react';
import { ChartSkeleton } from '../dashboard/ChartContainer';

// Lazy load chart components
const LazyBarChart = lazy(() => import('./BarChart').then(module => ({ default: module.BarChart })));
const LazyLineChart = lazy(() => import('./LineChart').then(module => ({ default: module.LineChart })));
const LazyPieChart = lazy(() => import('./PieChart').then(module => ({ default: module.PieChart })));
const LazyAreaChart = lazy(() => import('./AreaChart').then(module => ({ default: module.AreaChart })));
const LazyScatterChart = lazy(() => import('./ScatterChart').then(module => ({ default: module.ScatterChart })));
const LazyGaugeChart = lazy(() => import('./GaugeChart').then(module => ({ default: module.GaugeChart })));

// Chart loader component with error boundary
class ChartErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Chart component error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    Failed to load chart component
                </div>
            );
        }

        return this.props.children;
    }
}

// Optimized chart components with lazy loading
export const OptimizedBarChart = React.memo(function OptimizedBarChart(props: any) {
    return (
        <ChartErrorBoundary>
            <Suspense fallback={<ChartSkeleton />}>
                <LazyBarChart {...props} />
            </Suspense>
        </ChartErrorBoundary>
    );
});

export const OptimizedLineChart = React.memo(function OptimizedLineChart(props: any) {
    return (
        <ChartErrorBoundary>
            <Suspense fallback={<ChartSkeleton />}>
                <LazyLineChart {...props} />
            </Suspense>
        </ChartErrorBoundary>
    );
});

export const OptimizedPieChart = React.memo(function OptimizedPieChart(props: any) {
    return (
        <ChartErrorBoundary>
            <Suspense fallback={<ChartSkeleton />}>
                <LazyPieChart {...props} />
            </Suspense>
        </ChartErrorBoundary>
    );
});

export const OptimizedAreaChart = React.memo(function OptimizedAreaChart(props: any) {
    return (
        <ChartErrorBoundary>
            <Suspense fallback={<ChartSkeleton />}>
                <LazyAreaChart {...props} />
            </Suspense>
        </ChartErrorBoundary>
    );
});

export const OptimizedScatterChart = React.memo(function OptimizedScatterChart(props: any) {
    return (
        <ChartErrorBoundary>
            <Suspense fallback={<ChartSkeleton />}>
                <LazyScatterChart {...props} />
            </Suspense>
        </ChartErrorBoundary>
    );
});

export const OptimizedGaugeChart = React.memo(function OptimizedGaugeChart(props: any) {
    return (
        <ChartErrorBoundary>
            <Suspense fallback={<ChartSkeleton />}>
                <LazyGaugeChart {...props} />
            </Suspense>
        </ChartErrorBoundary>
    );
});

// Chart registry for dynamic loading
export const chartRegistry = {
    bar: OptimizedBarChart,
    line: OptimizedLineChart,
    pie: OptimizedPieChart,
    area: OptimizedAreaChart,
    scatter: OptimizedScatterChart,
    gauge: OptimizedGaugeChart,
};

// Dynamic chart loader
interface DynamicChartProps {
    type: keyof typeof chartRegistry;
    [key: string]: any;
}

export function DynamicChart({ type, ...props }: DynamicChartProps) {
    const ChartComponent = chartRegistry[type];

    if (!ChartComponent) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                Unsupported chart type: {type}
            </div>
        );
    }

    return <ChartComponent {...props} />;
}

// Preload chart components
export const preloadChart = (type: keyof typeof chartRegistry) => {
    switch (type) {
        case 'bar':
            import('./BarChart');
            break;
        case 'line':
            import('./LineChart');
            break;
        case 'pie':
            import('./PieChart');
            break;
        case 'area':
            import('./AreaChart');
            break;
        case 'scatter':
            import('./ScatterChart');
            break;
        case 'gauge':
            import('./GaugeChart');
            break;
    }
};

// Preload all charts (call this on app init for better performance)
export const preloadAllCharts = () => {
    Object.keys(chartRegistry).forEach(type => {
        preloadChart(type as keyof typeof chartRegistry);
    });
};