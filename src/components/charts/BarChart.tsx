/**
 * BarChart Component
 * Accessible bar chart component using Recharts
 */

'use client';

import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
    [key: string]: string | number;
}

interface BarChartProps {
    data: DataPoint[];
    dataKey: string;
    xAxisKey?: string;
    title?: string;
    className?: string;
    height?: number;
    colors?: string[];
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    animation?: boolean;
    ariaLabel?: string;
}

export function BarChart({
    data,
    dataKey,
    xAxisKey = 'name',
    title,
    className,
    height = 300,
    colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    animation = true,
    ariaLabel,
}: BarChartProps) {
    const chartId = React.useId();
    const titleId = `${chartId}-title`;

    return (
        <div
            className={cn('w-full', className)}
            role="region"
            aria-label={ariaLabel || `${title || 'Bar chart'} visualization`}
            aria-labelledby={title ? titleId : undefined}
        >
            {title && (
                <h3
                    id={titleId}
                    className="text-lg font-semibold mb-4 text-foreground"
                >
                    {title}
                </h3>
            )}

            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    accessibilityLayer
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                        />
                    )}

                    <XAxis
                        dataKey={xAxisKey}
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                    />

                    <YAxis
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                    />

                    {showTooltip && (
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                                color: 'hsl(var(--foreground))',
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                    )}

                    {showLegend && (
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                    )}

                    <Bar
                        dataKey={dataKey}
                        fill={colors[0]}
                        radius={[4, 4, 0, 0]}
                        animationDuration={animation ? 1000 : 0}
                    />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}