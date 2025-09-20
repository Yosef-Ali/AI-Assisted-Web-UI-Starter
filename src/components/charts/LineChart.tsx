/**
 * LineChart Component
 * Accessible line chart component using Recharts
 */

'use client';

import React from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
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

interface LineChartProps {
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
    strokeWidth?: number;
    dot?: boolean;
    ariaLabel?: string;
}

export function LineChart({
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
    strokeWidth = 2,
    dot = true,
    ariaLabel,
}: LineChartProps) {
    const chartId = React.useId();
    const titleId = `${chartId}-title`;

    return (
        <div
            className={cn('w-full', className)}
            role="region"
            aria-label={ariaLabel || `${title || 'Line chart'} visualization`}
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
                <RechartsLineChart
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

                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={colors[0]}
                        strokeWidth={strokeWidth}
                        dot={dot ? { fill: colors[0], strokeWidth: 2, r: 4 } : false}
                        activeDot={dot ? { r: 6, stroke: colors[0], strokeWidth: 2 } : false}
                        animationDuration={animation ? 1000 : 0}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}