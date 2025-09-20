/**
 * PieChart Component
 * Accessible pie chart component using Recharts
 */

'use client';

import React from 'react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

interface DataPoint {
    [key: string]: string | number;
}

interface PieChartProps {
    data: DataPoint[];
    dataKey: string;
    nameKey?: string;
    title?: string;
    className?: string;
    height?: number;
    colors?: string[];
    showLegend?: boolean;
    showTooltip?: boolean;
    animation?: boolean;
    innerRadius?: number;
    outerRadius?: number;
    ariaLabel?: string;
}

export function PieChart({
    data,
    dataKey,
    nameKey = 'name',
    title,
    className,
    height = 300,
    colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'],
    showLegend = true,
    showTooltip = true,
    animation = true,
    innerRadius = 0,
    outerRadius = 80,
    ariaLabel,
}: PieChartProps) {
    const chartId = React.useId();
    const titleId = `${chartId}-title`;

    return (
        <div
            className={cn('w-full', className)}
            role="region"
            aria-label={ariaLabel || `${title || 'Pie chart'} visualization`}
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
                <RechartsPieChart accessibilityLayer>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={outerRadius}
                        innerRadius={innerRadius}
                        fill="#8884d8"
                        dataKey={dataKey}
                        animationDuration={animation ? 1000 : 0}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>

                    {showTooltip && (
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                                color: 'hsl(var(--foreground))',
                            }}
                            formatter={(value: number) => [value.toLocaleString(), 'Value']}
                        />
                    )}

                    {showLegend && (
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
                        />
                    )}
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
}