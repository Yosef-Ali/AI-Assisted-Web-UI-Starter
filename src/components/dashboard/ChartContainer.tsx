/**
 * ChartContainer Component
 * Wrapper component for charts with loading, error, and refresh functionality
 */

'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChartContainerProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    showChangeIndicator?: boolean;
    changeValue?: number;
    changeLabel?: string;
    className?: string;
    ariaLabel?: string;
}

export function ChartContainer({
    title,
    subtitle,
    children,
    isLoading = false,
    error = null,
    onRefresh,
    isRefreshing = false,
    showChangeIndicator = false,
    changeValue,
    changeLabel,
    className,
    ariaLabel,
}: ChartContainerProps) {
    const containerId = React.useId();
    const titleId = `${containerId}-title`;

    // Determine change indicator
    const isPositive = changeValue !== undefined && changeValue > 0;
    const isNegative = changeValue !== undefined && changeValue < 0;
    const ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : null;

    if (error) {
        return (
            <Card className={cn('w-full', className)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    {title && (
                        <CardTitle id={titleId} className="text-sm font-medium">
                            {title}
                        </CardTitle>
                    )}
                    {onRefresh && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            aria-label="Refresh chart data"
                        >
                            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div
                        className="flex flex-col items-center justify-center h-64 text-center"
                        role="alert"
                        aria-live="polite"
                    >
                        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">
                            {error}
                        </p>
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
                                Try Again
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn('w-full', className)}>
            {(title || onRefresh) && (
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex-1">
                        {title && (
                            <CardTitle id={titleId} className="text-sm font-medium">
                                {title}
                            </CardTitle>
                        )}
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {showChangeIndicator && changeValue !== undefined && ChangeIcon && (
                            <div
                                className={cn(
                                    'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
                                    isPositive && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                                    isNegative && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                )}
                                aria-label={`Change: ${changeValue > 0 ? '+' : ''}${changeValue}% ${changeLabel || ''}`}
                            >
                                <ChangeIcon className="h-3 w-3" />
                                <span>
                                    {changeValue > 0 ? '+' : ''}{changeValue}%
                                    {changeLabel && ` ${changeLabel}`}
                                </span>
                            </div>
                        )}

                        {onRefresh && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                                aria-label="Refresh chart data"
                            >
                                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                            </Button>
                        )}
                    </div>
                </CardHeader>
            )}

            <CardContent className="pt-0">
                {isLoading ? (
                    <div
                        className="flex items-center justify-center h-64"
                        role="status"
                        aria-label="Loading chart data"
                    >
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <div
                        role="region"
                        aria-label={ariaLabel || `${title || 'Chart'} visualization`}
                        aria-labelledby={title ? titleId : undefined}
                    >
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Loading skeleton component
export function ChartSkeleton({ className }: { className?: string }) {
    return (
        <Card className={cn('w-full', className)}>
            <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </CardHeader>
            <CardContent>
                <div className="h-64 bg-muted rounded animate-pulse"></div>
            </CardContent>
        </Card>
    );
}