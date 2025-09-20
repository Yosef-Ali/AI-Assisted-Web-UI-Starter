/**
 * Performance Dashboard Component
 * Displays performance metrics and monitoring information
 */

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
    usePerformanceMonitoring,
    checkPerformanceBudget,
    getMemoryUsage,
    analyzeBundleSize,
    type BundleMetrics,
    type MemoryInfo
} from '../../lib/performance';

interface PerformanceDashboardProps {
    className?: string;
    showDetailedMetrics?: boolean;
    refreshInterval?: number;
}

export function PerformanceDashboard({
    className,
    showDetailedMetrics = false,
    refreshInterval = 5000,
}: PerformanceDashboardProps) {
    const { metrics, isSupported } = usePerformanceMonitoring();
    const [memoryInfo, setMemoryInfo] = React.useState<MemoryInfo | null>(null);
    const [bundleMetrics, setBundleMetrics] = React.useState<any>(null);

    // Update memory and bundle metrics periodically
    React.useEffect(() => {
        const updateMetrics = () => {
            setMemoryInfo(getMemoryUsage());
            setBundleMetrics(analyzeBundleSize());
        };

        updateMetrics();
        const interval = setInterval(updateMetrics, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    if (!isSupported) {
        return (
            <Card className={cn('w-full', className)}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Performance Monitoring
                    </CardTitle>
                    <CardDescription>
                        Performance monitoring is not supported in this browser
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const budgetCheck = metrics ? checkPerformanceBudget(metrics) : null;

    return (
        <div className={cn('w-full space-y-4', className)}>
            {/* Core Web Vitals */}
            {metrics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Core Web Vitals
                        </CardTitle>
                        <CardDescription>
                            Key performance metrics for user experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                title="Largest Contentful Paint"
                                value={`${metrics.largestContentfulPaint.toFixed(0)}ms`}
                                target="≤ 2500ms"
                                status={metrics.largestContentfulPaint <= 2500 ? 'good' : 'poor'}
                                description="Time to load largest content element"
                            />
                            <MetricCard
                                title="Cumulative Layout Shift"
                                value={metrics.cumulativeLayoutShift.toFixed(3)}
                                target="≤ 0.1"
                                status={metrics.cumulativeLayoutShift <= 0.1 ? 'good' : 'poor'}
                                description="Visual stability of page layout"
                            />
                            <MetricCard
                                title="First Input Delay"
                                value={`${metrics.firstInputDelay.toFixed(0)}ms`}
                                target="≤ 100ms"
                                status={metrics.firstInputDelay <= 100 ? 'good' : 'poor'}
                                description="Responsiveness to user input"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Bundle Size */}
            {bundleMetrics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Bundle Size
                        </CardTitle>
                        <CardDescription>
                            JavaScript and CSS bundle sizes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <BundleMetricCard
                                title="JavaScript"
                                size={bundleMetrics.jsSize}
                                count={bundleMetrics.jsResourceCount}
                            />
                            <BundleMetricCard
                                title="CSS"
                                size={bundleMetrics.cssSize}
                                count={bundleMetrics.cssResourceCount}
                            />
                            <BundleMetricCard
                                title="Total"
                                size={bundleMetrics.totalSize}
                                count={bundleMetrics.resourceCount}
                                isTotal
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Memory Usage */}
            {memoryInfo && showDetailedMetrics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Memory Usage
                        </CardTitle>
                        <CardDescription>
                            JavaScript heap memory consumption
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Used Heap</span>
                                <span>{(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(memoryInfo.usedPercentage, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0 MB</span>
                                <span>{(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(0)} MB</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Total Heap:</span>
                                <span className="ml-2 font-mono">
                                    {(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Usage:</span>
                                <span className="ml-2 font-mono">
                                    {memoryInfo.usedPercentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Performance Budget Status */}
            {budgetCheck && !budgetCheck.passed && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-800">
                            <AlertTriangle className="h-5 w-5" />
                            Performance Budget Violations
                        </CardTitle>
                        <CardDescription className="text-yellow-700">
                            The following performance targets were not met
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {budgetCheck.violations.map((violation, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-yellow-800">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {violation}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Metric Card Component
interface MetricCardProps {
    title: string;
    value: string;
    target: string;
    status: 'good' | 'needs-improvement' | 'poor';
    description: string;
}

function MetricCard({ title, value, target, status, description }: MetricCardProps) {
    const statusColors = {
        good: 'bg-green-100 text-green-800 border-green-200',
        'needs-improvement': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        poor: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <div className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{title}</h3>
                <Badge variant="outline" className={statusColors[status]}>
                    {status}
                </Badge>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">
                Target: {target}
            </div>
            <div className="text-xs text-muted-foreground">
                {description}
            </div>
        </div>
    );
}

// Bundle Metric Card Component
interface BundleMetricCardProps {
    title: string;
    size: number;
    count: number;
    isTotal?: boolean;
}

function BundleMetricCard({ title, size, count, isTotal }: BundleMetricCardProps) {
    const sizeInKB = (size / 1024).toFixed(1);
    const isOverBudget = isTotal && size > 200 * 1024; // 200KB budget

    return (
        <div className={cn(
            'p-4 border rounded-lg space-y-2',
            isOverBudget && 'border-red-200 bg-red-50'
        )}>
            <h3 className="font-medium text-sm">{title}</h3>
            <div className="text-2xl font-bold">{sizeInKB} KB</div>
            <div className="text-xs text-muted-foreground">
                {count} resource{count !== 1 ? 's' : ''}
            </div>
            {isTotal && (
                <div className="text-xs text-muted-foreground">
                    Budget: ≤ 200 KB
                </div>
            )}
        </div>
    );
}