/**
 * Core API Types for User Dashboard with Analytics
 * Based on OpenAPI specification and contract tests
 */

// Base types
export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'gauge';

export type DataQuality = 'good' | 'warning' | 'error';

export type ExportFormat = 'csv' | 'json' | 'pdf';

export type MetricType = 'numeric' | 'percentage' | 'currency' | 'count';

export type MetricCategory = 'financial' | 'operational' | 'user' | 'technical' | 'marketing';

// Position and size interfaces for dashboard layout
export interface GridPosition {
    x: number;
    y: number;
}

export interface GridSize {
    width: number;
    height: number;
}

// Chart configuration interfaces
export interface ChartConfig {
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    animation?: boolean;
    interactive?: boolean;
    [key: string]: any; // Allow additional chart-specific config
}

// Data point interface
export interface DataPoint {
    id: string;
    metricId: string;
    value: number;
    timestamp: string; // ISO 8601 date string
    quality: DataQuality;
    metadata?: Record<string, any>;
}

// Chart interface
export interface Chart {
    id: string;
    dashboardId: string;
    type: ChartType;
    title: string;
    metric: string;
    config: ChartConfig;
    position: GridPosition;
    size: GridSize;
    refreshInterval: number; // in seconds
    lastUpdated?: string; // ISO 8601 date string
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
}

// Dashboard layout interface
export interface DashboardLayout {
    columns: number;
    rows: number;
    gap: number;
    breakpoints?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}

// Dashboard interface
export interface Dashboard {
    id: string;
    name: string;
    description?: string;
    layout: DashboardLayout;
    charts: Chart[];
    isPublic: boolean;
    tags?: string[];
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
    lastViewedAt?: string; // ISO 8601 date string
}

// Metric definition interface
export interface Metric {
    id: string;
    name: string;
    description: string;
    type: MetricType;
    unit: string;
    category: MetricCategory;
    minValue?: number;
    maxValue?: number;
    precision?: number;
    isActive: boolean;
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
}

// API request/response interfaces

// Dashboard CRUD
export interface CreateDashboardRequest {
    name: string;
    description?: string;
    layout?: Partial<DashboardLayout>;
    isPublic?: boolean;
    tags?: string[];
}

export interface UpdateDashboardRequest {
    name?: string;
    description?: string;
    layout?: Partial<DashboardLayout>;
    isPublic?: boolean;
    tags?: string[];
}

// Chart CRUD
export interface CreateChartRequest {
    type: ChartType;
    title: string;
    metric: string;
    config?: ChartConfig;
    position: GridPosition;
    size: GridSize;
    refreshInterval?: number;
}

export interface UpdateChartRequest {
    type?: ChartType;
    title?: string;
    metric?: string;
    config?: Partial<ChartConfig>;
    position?: GridPosition;
    size?: GridSize;
    refreshInterval?: number;
}

// Data queries
export interface DataQueryParams {
    startDate?: string; // ISO 8601 date string
    endDate?: string; // ISO 8601 date string
    aggregation?: 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    limit?: number;
    offset?: number;
}

export interface ChartDataResponse {
    chartId: string;
    data: DataPoint[];
    total: number;
    hasMore: boolean;
}

// Export interfaces
export interface ExportRequest {
    format: ExportFormat;
    dateRange: {
        start: string; // ISO 8601 date string
        end: string; // ISO 8601 date string
    };
    charts?: string[]; // Chart IDs to include
    includeMetadata?: boolean;
    aggregation?: 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

// Metrics interfaces
export interface MetricsQueryParams {
    category?: MetricCategory;
    search?: string;
    page?: number;
    limit?: number;
}

export interface MetricsResponse {
    data: Metric[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// Health check interface
export interface HealthStatus {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string; // ISO 8601 date string
    version: string;
    uptime: number; // in seconds
    services?: {
        database?: ServiceHealth;
        cache?: ServiceHealth;
        metrics?: ServiceHealth;
        [key: string]: ServiceHealth | undefined;
    };
    system?: {
        memory?: {
            used: number;
            total: number;
            percentage: number;
        };
        cpu?: {
            usage: number;
        };
    };
    database?: {
        connectionCount: number;
        activeConnections: number;
        responseTime: number;
    };
    cache?: {
        hitRate: number;
        size: number;
        evictions: number;
    };
    externalServices?: {
        [serviceName: string]: ServiceHealth;
    };
}

export interface ServiceHealth {
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime?: number;
    error?: string;
    lastChecked: string; // ISO 8601 date string
}

// Error interfaces
export interface ApiError {
    code: string;
    message: string;
    details?: any;
    timestamp: string; // ISO 8601 date string
}

export interface ValidationError extends ApiError {
    field: string;
    value: any;
}

// Pagination interface
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// Real-time update interfaces
export interface RealTimeUpdate {
    type: 'data' | 'chart' | 'dashboard';
    action: 'create' | 'update' | 'delete';
    id: string;
    data: any;
    timestamp: string; // ISO 8601 date string
}

export interface ChangeNotification {
    type: 'significant_change' | 'threshold_exceeded' | 'anomaly_detected';
    metricId: string;
    previousValue: number;
    currentValue: number;
    changePercent: number;
    threshold: number;
    timestamp: string; // ISO 8601 date string
}

// Authentication interfaces (for future use)
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'viewer';
    permissions: string[];
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
}