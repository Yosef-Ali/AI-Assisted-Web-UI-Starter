/**
 * TanStack Query hooks for User Dashboard with Analytics
 * Provides React hooks for all API endpoints with caching and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Dashboard,
    Chart,
    DataPoint,
    Metric,
    CreateDashboardRequest,
    UpdateDashboardRequest,
    CreateChartRequest,
    UpdateChartRequest,
    DataQueryParams,
    ExportRequest,
    MetricsQueryParams,
    MetricsResponse,
    HealthStatus,
    ChartDataResponse,
} from '../types';
import { apiClient } from './api';

// Query keys for consistent caching
export const queryKeys = {
    dashboards: ['dashboards'] as const,
    dashboard: (id: string) => ['dashboards', id] as const,
    dashboardCharts: (dashboardId: string) => ['dashboards', dashboardId, 'charts'] as const,
    dashboardChart: (dashboardId: string, chartId: string) => ['dashboards', dashboardId, 'charts', chartId] as const,
    chartData: (dashboardId: string, chartId: string, params?: DataQueryParams) => [
        'dashboards',
        dashboardId,
        'charts',
        chartId,
        'data',
        params,
    ] as const,
    metrics: (params?: MetricsQueryParams) => ['metrics', params] as const,
    metric: (id: string) => ['metrics', id] as const,
    health: (detailed?: boolean) => ['health', detailed] as const,
};

// Dashboard hooks
export function useDashboards(params?: { page?: number; limit?: number; search?: string }) {
    return useQuery({
        queryKey: [...queryKeys.dashboards, params],
        queryFn: () => apiClient.dashboard.getDashboards(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useDashboard(id: string) {
    return useQuery({
        queryKey: queryKeys.dashboard(id),
        queryFn: () => apiClient.dashboard.getDashboard(id),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!id,
    });
}

export function useCreateDashboard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDashboardRequest) => apiClient.dashboard.createDashboard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboards });
        },
    });
}

export function useUpdateDashboard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDashboardRequest }) =>
            apiClient.dashboard.updateDashboard(id, data),
        onSuccess: (updatedDashboard) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboards });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(updatedDashboard.id) });
        },
    });
}

export function useDeleteDashboard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => apiClient.dashboard.deleteDashboard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboards });
        },
    });
}

// Chart hooks
export function useCharts(dashboardId: string) {
    return useQuery({
        queryKey: queryKeys.dashboardCharts(dashboardId),
        queryFn: () => apiClient.chart.getCharts(dashboardId),
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: !!dashboardId,
    });
}

export function useChart(dashboardId: string, chartId: string) {
    return useQuery({
        queryKey: queryKeys.dashboardChart(dashboardId, chartId),
        queryFn: () => apiClient.chart.getChart(dashboardId, chartId),
        staleTime: 2 * 60 * 1000, // 2 minutes
        enabled: !!dashboardId && !!chartId,
    });
}

export function useCreateChart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ dashboardId, data }: { dashboardId: string; data: CreateChartRequest }) =>
            apiClient.chart.createChart(dashboardId, data),
        onSuccess: (newChart) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboardCharts(newChart.dashboardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(newChart.dashboardId) });
        },
    });
}

export function useUpdateChart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            dashboardId,
            chartId,
            data,
        }: {
            dashboardId: string;
            chartId: string;
            data: UpdateChartRequest;
        }) => apiClient.chart.updateChart(dashboardId, chartId, data),
        onSuccess: (updatedChart) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboardCharts(updatedChart.dashboardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboardChart(updatedChart.dashboardId, updatedChart.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(updatedChart.dashboardId) });
        },
    });
}

export function useDeleteChart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ dashboardId, chartId }: { dashboardId: string; chartId: string }) =>
            apiClient.chart.deleteChart(dashboardId, chartId),
        onSuccess: (_, { dashboardId }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboardCharts(dashboardId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(dashboardId) });
        },
    });
}

export function useChartData(dashboardId: string, chartId: string, params?: DataQueryParams, enabled = true) {
    return useQuery({
        queryKey: queryKeys.chartData(dashboardId, chartId, params),
        queryFn: () => apiClient.chart.getChartData(dashboardId, chartId, params),
        staleTime: 30 * 1000, // 30 seconds for real-time data
        refetchInterval: 30 * 1000, // Refetch every 30 seconds
        enabled: enabled && !!dashboardId && !!chartId,
    });
}

// Metrics hooks
export function useMetrics(params?: MetricsQueryParams) {
    return useQuery({
        queryKey: queryKeys.metrics(params),
        queryFn: () => apiClient.metrics.getMetrics(params),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useMetric(id: string) {
    return useQuery({
        queryKey: queryKeys.metric(id),
        queryFn: () => apiClient.metrics.getMetric(id),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!id,
    });
}

// Export hooks
export function useExportDashboard() {
    return useMutation({
        mutationFn: ({ dashboardId, config }: { dashboardId: string; config: ExportRequest }) =>
            apiClient.export.exportDashboard(dashboardId, config),
    });
}

// Health check hooks
export function useHealth(detailed?: boolean) {
    return useQuery({
        queryKey: queryKeys.health(detailed),
        queryFn: () => apiClient.health.getHealth(detailed),
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 60 * 1000, // Refetch every minute
    });
}

// Utility hooks for optimistic updates
export function useOptimisticDashboardUpdate() {
    const queryClient = useQueryClient();

    return {
        updateDashboardOptimistically: (id: string, updates: Partial<Dashboard>) => {
            queryClient.setQueryData(queryKeys.dashboard(id), (old: Dashboard | undefined) => {
                if (!old) return old;
                return { ...old, ...updates, updatedAt: new Date().toISOString() };
            });
        },
        revertDashboardUpdate: (id: string) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(id) });
        },
    };
}

export function useOptimisticChartUpdate() {
    const queryClient = useQueryClient();

    return {
        updateChartOptimistically: (dashboardId: string, chartId: string, updates: Partial<Chart>) => {
            queryClient.setQueryData(queryKeys.dashboardChart(dashboardId, chartId), (old: Chart | undefined) => {
                if (!old) return old;
                return { ...old, ...updates, updatedAt: new Date().toISOString() };
            });
        },
        revertChartUpdate: (dashboardId: string, chartId: string) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboardChart(dashboardId, chartId) });
        },
    };
}