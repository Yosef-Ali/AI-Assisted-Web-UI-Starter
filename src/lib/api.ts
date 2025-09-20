/**
 * API Client for User Dashboard with Analytics
 * Provides typed API calls for all dashboard endpoints
 */

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
    ApiError,
    ChartDataResponse,
} from '../types';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const API_VERSION = 'api';

// Helper function to build API URLs
function buildUrl(endpoint: string): string {
    return `${API_BASE_URL}/${API_VERSION}${endpoint}`;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
            code: `HTTP_${response.status}`,
            message: `HTTP ${response.status}: ${response.statusText}`,
            timestamp: new Date().toISOString(),
        }));
        throw error;
    }

    return response.json();
}

// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, v.toString()));
            } else {
                searchParams.append(key, value.toString());
            }
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

// Dashboard API endpoints
export const dashboardApi = {
    // GET /dashboards
    async getDashboards(params?: { page?: number; limit?: number; search?: string }): Promise<Dashboard[]> {
        const queryString = buildQueryString(params || {});
        const response = await fetch(buildUrl(`/dashboards${queryString}`));
        return handleResponse<Dashboard[]>(response);
    },

    // GET /dashboards/{id}
    async getDashboard(id: string): Promise<Dashboard> {
        const response = await fetch(buildUrl(`/dashboards/${id}`));
        return handleResponse<Dashboard>(response);
    },

    // POST /dashboards
    async createDashboard(data: CreateDashboardRequest): Promise<Dashboard> {
        const response = await fetch(buildUrl('/dashboards'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Dashboard>(response);
    },

    // PUT /dashboards/{id}
    async updateDashboard(id: string, data: UpdateDashboardRequest): Promise<Dashboard> {
        const response = await fetch(buildUrl(`/dashboards/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Dashboard>(response);
    },

    // DELETE /dashboards/{id}
    async deleteDashboard(id: string): Promise<void> {
        const response = await fetch(buildUrl(`/dashboards/${id}`), {
            method: 'DELETE',
        });
        await handleResponse<void>(response);
    },
};

// Chart API endpoints
export const chartApi = {
    // GET /dashboards/{id}/charts
    async getCharts(dashboardId: string): Promise<Chart[]> {
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/charts`));
        return handleResponse<Chart[]>(response);
    },

    // GET /dashboards/{id}/charts/{chartId}
    async getChart(dashboardId: string, chartId: string): Promise<Chart> {
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/charts/${chartId}`));
        return handleResponse<Chart>(response);
    },

    // POST /dashboards/{id}/charts
    async createChart(dashboardId: string, data: CreateChartRequest): Promise<Chart> {
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/charts`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Chart>(response);
    },

    // PUT /dashboards/{id}/charts/{chartId}
    async updateChart(dashboardId: string, chartId: string, data: UpdateChartRequest): Promise<Chart> {
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/charts/${chartId}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<Chart>(response);
    },

    // DELETE /dashboards/{id}/charts/{chartId}
    async deleteChart(dashboardId: string, chartId: string): Promise<void> {
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/charts/${chartId}`), {
            method: 'DELETE',
        });
        await handleResponse<void>(response);
    },

    // GET /dashboards/{id}/charts/{chartId}/data
    async getChartData(
        dashboardId: string,
        chartId: string,
        params?: DataQueryParams
    ): Promise<ChartDataResponse> {
        const queryString = buildQueryString(params || {});
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/charts/${chartId}/data${queryString}`));
        return handleResponse<ChartDataResponse>(response);
    },
};

// Metrics API endpoints
export const metricsApi = {
    // GET /metrics
    async getMetrics(params?: MetricsQueryParams): Promise<MetricsResponse> {
        const queryString = buildQueryString(params || {});
        const response = await fetch(buildUrl(`/metrics${queryString}`));
        return handleResponse<MetricsResponse>(response);
    },

    // GET /metrics/{id}
    async getMetric(id: string): Promise<Metric> {
        const response = await fetch(buildUrl(`/metrics/${id}`));
        return handleResponse<Metric>(response);
    },
};

// Export API endpoints
export const exportApi = {
    // POST /dashboards/{id}/export
    async exportDashboard(dashboardId: string, config: ExportRequest): Promise<Blob> {
        const response = await fetch(buildUrl(`/dashboards/${dashboardId}/export`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            const error: ApiError = await response.json().catch(() => ({
                code: `HTTP_${response.status}`,
                message: `HTTP ${response.status}: ${response.statusText}`,
                timestamp: new Date().toISOString(),
            }));
            throw error;
        }

        return response.blob();
    },
};

// Health check API endpoints
export const healthApi = {
    // GET /health
    async getHealth(detailed?: boolean): Promise<HealthStatus> {
        const queryString = detailed ? '?detailed=true' : '';
        const response = await fetch(buildUrl(`/health${queryString}`));
        return handleResponse<HealthStatus>(response);
    },
};

// Main API client object
export const apiClient = {
    dashboard: dashboardApi,
    chart: chartApi,
    metrics: metricsApi,
    export: exportApi,
    health: healthApi,
};