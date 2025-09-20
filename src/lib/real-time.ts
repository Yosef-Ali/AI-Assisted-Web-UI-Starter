/**
 * Real-time Data Updates Hook
 * Manages real-time data updates with polling and change notifications
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

interface DataPoint {
    id: string;
    metricId: string;
    value: number;
    timestamp: string;
    quality: 'good' | 'warning' | 'error';
}

interface ChangeNotification {
    metricId: string;
    previousValue: number;
    currentValue: number;
    changePercent: number;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
}

interface RealTimeConfig {
    enabled?: boolean;
    pollingInterval?: number;
    backgroundPollingInterval?: number;
    changeThreshold?: number; // percentage change that triggers notification
    maxRetries?: number;
    retryDelay?: number;
}

interface UseRealTimeDataOptions extends RealTimeConfig {
    queryKey: string[];
    queryFn: () => Promise<DataPoint[]>;
    onChange?: (notification: ChangeNotification) => void;
    onError?: (error: Error) => void;
}

export function useRealTimeData({
    queryKey,
    queryFn,
    enabled = true,
    pollingInterval = 30000, // 30 seconds
    backgroundPollingInterval = 120000, // 2 minutes
    changeThreshold = 20, // 20% change
    maxRetries = 3,
    retryDelay = 1000,
    onChange,
    onError,
}: UseRealTimeDataOptions) {
    const queryClient = useQueryClient();
    const previousDataRef = useRef<DataPoint[] | null>(null);
    const retryCountRef = useRef(0);
    const isVisibleRef = useRef(true);

    // Handle visibility change for background polling
    useEffect(() => {
        const handleVisibilityChange = () => {
            isVisibleRef.current = !document.hidden;
            // Invalidate and refetch when becoming visible
            if (isVisibleRef.current) {
                queryClient.invalidateQueries({ queryKey });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [queryClient, queryKey]);

    const query = useQuery({
        queryKey,
        queryFn,
        enabled,
        refetchInterval: isVisibleRef.current ? pollingInterval : backgroundPollingInterval,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
            if (failureCount >= maxRetries) return false;

            retryCountRef.current = failureCount;
            onError?.(error as Error);

            return true;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Detect changes and trigger notifications
    useEffect(() => {
        if (!query.data || !previousDataRef.current || !onChange) return;

        const currentData = query.data;
        const previousData = previousDataRef.current;

        // Create a map of previous values for quick lookup
        const previousValues = new Map(
            previousData.map(point => [point.metricId, point.value])
        );

        // Check for significant changes
        currentData.forEach(currentPoint => {
            const previousValue = previousValues.get(currentPoint.metricId);

            if (previousValue !== undefined && previousValue !== 0) {
                const changePercent = Math.abs(
                    ((currentPoint.value - previousValue) / previousValue) * 100
                );

                if (changePercent >= changeThreshold) {
                    const notification: ChangeNotification = {
                        metricId: currentPoint.metricId,
                        previousValue,
                        currentValue: currentPoint.value,
                        changePercent: Math.round(changePercent * 100) / 100,
                        timestamp: new Date().toISOString(),
                        severity: changePercent >= 50 ? 'high' : changePercent >= 25 ? 'medium' : 'low',
                    };

                    onChange(notification);
                }
            }
        });

        // Update previous data reference
        previousDataRef.current = currentData;
    }, [query.data, changeThreshold, onChange]);

    // Update previous data when data first loads
    useEffect(() => {
        if (query.data && !previousDataRef.current) {
            previousDataRef.current = query.data;
        }
    }, [query.data]);

    // Manual refresh function
    const refresh = useCallback(() => {
        queryClient.invalidateQueries({ queryKey });
    }, [queryClient, queryKey]);

    // Force refresh mutation
    const forceRefreshMutation = useMutation({
        mutationFn: queryFn,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data);
            previousDataRef.current = data;
        },
        onError,
    });

    return {
        ...query,
        refresh,
        forceRefresh: forceRefreshMutation.mutate,
        isRefreshing: forceRefreshMutation.isPending,
        retryCount: retryCountRef.current,
        isVisible: isVisibleRef.current,
    };
}

// Hook for managing multiple real-time metrics
export function useRealTimeMetrics(
    metrics: Array<{
        id: string;
        queryKey: string[];
        queryFn: () => Promise<DataPoint[]>;
        config?: RealTimeConfig;
    }>,
    options: {
        onChange?: (metricId: string, notification: ChangeNotification) => void;
        onError?: (metricId: string, error: Error) => void;
    } = {}
) {
    const queryClient = useQueryClient();

    const metricsData = metrics.map(metric => {
        const config = metric.config || {};

        return {
            id: metric.id,
            ...useRealTimeData({
                queryKey: metric.queryKey,
                queryFn: metric.queryFn,
                ...config,
                onChange: options.onChange ? (notification) => options.onChange!(metric.id, notification) : undefined,
                onError: options.onError ? (error) => options.onError!(metric.id, error) : undefined,
            }),
        };
    });

    const refreshAll = useCallback(() => {
        metrics.forEach(metric => {
            queryClient.invalidateQueries({ queryKey: metric.queryKey });
        });
    }, [queryClient, metrics]);

    const isAnyLoading = metricsData.some(metric => metric.isLoading);
    const isAnyError = metricsData.some(metric => metric.error);
    const isAnyRefreshing = metricsData.some(metric => metric.isRefreshing);

    return {
        metrics: metricsData,
        refreshAll,
        isAnyLoading,
        isAnyError,
        isAnyRefreshing,
    };
}

// Notification system hook
export function useChangeNotifications() {
    const [notifications, setNotifications] = React.useState<ChangeNotification[]>([]);

    const addNotification = useCallback((notification: ChangeNotification) => {
        setNotifications(prev => {
            // Remove old notifications for the same metric
            const filtered = prev.filter(n => n.metricId !== notification.metricId);
            return [...filtered, notification].slice(-10); // Keep only last 10 notifications
        });
    }, []);

    const removeNotification = useCallback((metricId: string) => {
        setNotifications(prev => prev.filter(n => n.metricId !== metricId));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Auto-remove notifications after 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications(prev =>
                prev.filter(notification => {
                    const age = Date.now() - new Date(notification.timestamp).getTime();
                    return age < 30000; // 30 seconds
                })
            );
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
    };
}