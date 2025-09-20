/**
 * ScatterChart Component
 * Accessible scatter plot component using Recharts
 */

'use client';

import React from 'react';
import {
    ScatterChart as RechartsScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ZAxis,
} from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
    [key: string]: string | number;
}

interface ScatterChartProps {
    data: DataPoint[];
    xDataKey: string;
    yDataKey: string;
    title?: string;
    className?: string;
    height?: number;
    colors?: string[];
    showGrid?: boolean;
    showLegend?: boolean;
    showTooltip?: boolean;
    animation?: boolean;
    pointSize?: number;
    ariaLabel?: string;
}

export function ScatterChart({
    data,
    xDataKey,
    yDataKey,
    title,
    className,
    height = 300,
    colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    animation = true,
    pointSize = 100,
    ariaLabel,
}: ScatterChartProps) {
    const chartId = React.useId();
    const titleId = `${chartId}-title`;

    return (
        <div
            className={cn('w-full', className)}
            role="region"
            aria-label={ariaLabel || `${title || 'Scatter plot'} visualization`}
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
                <RechartsScatterChart
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
                        type="number"
                        dataKey={xDataKey}
                        name={xDataKey}
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                    />

                    <YAxis
                        type="number"
                        dataKey={yDataKey}
                        name={yDataKey}
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                    />

                    <ZAxis
                        type="number"
                        dataKey="size"
                        range={[pointSize * 0.5, pointSize]}
                        name="Size"
                    />

                    {showTooltip && (
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                                color: 'hsl(var(--foreground))',
                            }}
                            cursor={{ strokeDasharray: '3 3' }}
                        />
                    )}

                    {showLegend && (
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                        />
                    )}

                    <Scatter
                        name="Data Points"
                        data={data}
                        fill={colors[0]}
                        animationDuration={animation ? 1000 : 0}
                    />
                </RechartsScatterChart>
            </ResponsiveContainer>
        </div>
    );
}