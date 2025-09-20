/**
 * Dashboard Controls Component
 * Combined controls for time range, filters, and export functionality
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TimeRangePicker, TimeRange } from './TimeRangePicker';
import { MetricFilter, Metric } from './MetricFilter';
import { ExportButton, ExportFormat } from './ExportButton';
import { Settings, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardControlsProps {
    // Time range
    timeRange: TimeRange;
    onTimeRangeChange: (range: TimeRange, start?: Date, end?: Date) => void;

    // Metrics
    metrics: Metric[];
    selectedMetrics: string[];
    onMetricsChange: (selectedIds: string[]) => void;

    // Export
    onExport: (format: ExportFormat) => Promise<void> | void;
    exportFormats?: ExportFormat[];

    // General
    onRefresh?: () => void;
    isRefreshing?: boolean;
    className?: string;
    compact?: boolean;
}

export function DashboardControls({
    timeRange,
    onTimeRangeChange,
    metrics,
    selectedMetrics,
    onMetricsChange,
    onExport,
    exportFormats = ['csv', 'json'],
    onRefresh,
    isRefreshing = false,
    className,
    compact = false,
}: DashboardControlsProps) {
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    if (compact) {
        return (
            <div className={cn('flex items-center gap-2 flex-wrap', className)}>
                <TimeRangePicker
                    value={timeRange}
                    onChange={onTimeRangeChange}
                    className="w-48"
                />

                <MetricFilter
                    metrics={metrics}
                    selectedMetrics={selectedMetrics}
                    onSelectionChange={onMetricsChange}
                    className="w-48"
                />

                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                        </Button>
                    )}

                    <ExportButton
                        onExport={onExport}
                        formats={exportFormats}
                        size="sm"
                    />
                </div>
            </div>
        );
    }

    return (
        <Card className={cn('w-full', className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Dashboard Controls</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        {showAdvanced ? 'Hide' : 'Show'} Advanced
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Primary Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Time Range
                        </label>
                        <TimeRangePicker
                            value={timeRange}
                            onChange={onTimeRangeChange}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Metrics ({selectedMetrics.length}/{metrics.length})
                        </label>
                        <MetricFilter
                            metrics={metrics}
                            selectedMetrics={selectedMetrics}
                            onSelectionChange={onMetricsChange}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Actions
                        </label>
                        <div className="flex gap-2">
                            {onRefresh && (
                                <Button
                                    variant="outline"
                                    onClick={onRefresh}
                                    disabled={isRefreshing}
                                    className="flex-1"
                                >
                                    <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
                                    Refresh
                                </Button>
                            )}

                            <ExportButton
                                onExport={onExport}
                                formats={exportFormats}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Controls */}
                {showAdvanced && (
                    <div className="border-t pt-4 space-y-4">
                        <h4 className="text-sm font-medium">Advanced Options</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Export Formats
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {exportFormats.map(format => (
                                        <span
                                            key={format}
                                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs uppercase"
                                        >
                                            {format}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Selected Metrics
                                </label>
                                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                    {selectedMetrics.map(metricId => {
                                        const metric = metrics.find(m => m.id === metricId);
                                        return metric ? (
                                            <span
                                                key={metricId}
                                                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                                            >
                                                {metric.name}
                                            </span>
                                        ) : null;
                                    })}
                                    {selectedMetrics.length === 0 && (
                                        <span className="text-muted-foreground text-sm">
                                            No metrics selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Compact controls bar for dashboards
interface ControlsBarProps {
    timeRange: TimeRange;
    onTimeRangeChange: (range: TimeRange, start?: Date, end?: Date) => void;
    selectedMetricsCount: number;
    totalMetricsCount: number;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    onExport: (format: ExportFormat) => Promise<void> | void;
    className?: string;
}

export function ControlsBar({
    timeRange,
    onTimeRangeChange,
    selectedMetricsCount,
    totalMetricsCount,
    onRefresh,
    isRefreshing = false,
    onExport,
    className,
}: ControlsBarProps) {
    return (
        <div className={cn('flex items-center justify-between p-4 bg-muted/50 rounded-lg', className)}>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Time Range:</span>
                    <TimeRangePicker
                        value={timeRange}
                        onChange={onTimeRangeChange}
                        className="w-40"
                    />
                </div>

                <div className="text-sm text-muted-foreground">
                    {selectedMetricsCount} of {totalMetricsCount} metrics selected
                </div>
            </div>

            <div className="flex items-center gap-2">
                {onRefresh && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                    </Button>
                )}

                <ExportButton
                    onExport={onExport}
                    formats={['csv', 'json']}
                    size="sm"
                />
            </div>
        </div>
    );
}