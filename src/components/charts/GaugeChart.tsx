/**
 * GaugeChart Component
 * Accessible gauge chart component using custom implementation
 */

'use client';

import React from 'react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { cn } from '../../lib/utils';

interface GaugeChartProps {
    value: number;
    maxValue?: number;
    title?: string;
    className?: string;
    height?: number;
    colors?: string[];
    showValue?: boolean;
    showLabels?: boolean;
    ariaLabel?: string;
}

export function GaugeChart({
    value,
    maxValue = 100,
    title,
    className,
    height = 300,
    colors = ['#10b981', '#f59e0b', '#ef4444'],
    showValue = true,
    showLabels = true,
    ariaLabel,
}: GaugeChartProps) {
    const chartId = React.useId();
    const titleId = `${chartId}-title`;

    // Calculate percentage and determine color
    const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
    const colorIndex = percentage >= 70 ? 0 : percentage >= 40 ? 1 : 2;
    const color = colors[colorIndex];

    // Create gauge data
    const gaugeData = [
        { name: 'Value', value: percentage, fill: color },
        { name: 'Remaining', value: 100 - percentage, fill: '#e5e7eb' },
    ];

    // Calculate needle position (for visual reference)
    const needleAngle = (percentage / 100) * 180 - 90; // -90 to +90 degrees

    return (
        <div
            className={cn('w-full', className)}
            role="region"
            aria-label={ariaLabel || `${title || 'Gauge chart'} visualization`}
            aria-labelledby={title ? titleId : undefined}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={maxValue}
        >
            {title && (
                <h3
                    id={titleId}
                    className="text-lg font-semibold mb-4 text-foreground"
                >
                    {title}
                </h3>
            )}

            <div className="relative">
                <ResponsiveContainer width="100%" height={height}>
                    <RechartsPieChart>
                        <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="85%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={0}
                            dataKey="value"
                            animationDuration={1000}
                        >
                            {gaugeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ResponsiveContainer>

                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 origin-bottom"
                    style={{
                        width: '2px',
                        height: '70px',
                        backgroundColor: 'hsl(var(--foreground))',
                        transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                        transformOrigin: 'bottom center',
                    }}
                    aria-hidden="true"
                />

                {/* Center point */}
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                    style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: 'hsl(var(--foreground))',
                        borderRadius: '50%',
                        transform: 'translateX(-50%) translateY(4px)',
                    }}
                    aria-hidden="true"
                />

                {/* Value display */}
                {showValue && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-2xl font-bold text-foreground">
                            {value.toLocaleString()}
                        </div>
                        {showLabels && (
                            <div className="text-sm text-muted-foreground">
                                of {maxValue.toLocaleString()}
                            </div>
                        )}
                    </div>
                )}

                {/* Labels */}
                {showLabels && (
                    <>
                        <div className="absolute bottom-16 left-4 text-sm text-muted-foreground">
                            0
                        </div>
                        <div className="absolute bottom-16 right-4 text-sm text-muted-foreground">
                            {maxValue.toLocaleString()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}