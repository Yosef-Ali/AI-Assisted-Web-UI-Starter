/**
 * Type exports for User Dashboard with Analytics
 * Central export file for all TypeScript types and interfaces
 */

// Core API types
export * from './api';

// Dashboard-specific types
export * from './dashboard';

// Re-export commonly used types for convenience
export type {
    Dashboard,
    Chart,
    DataPoint,
    ChartType,
    DataQuality,
    ExportFormat,
    MetricType,
    MetricCategory,
    GridPosition,
    GridSize,
    ChartConfig,
    DashboardLayout,
    Metric,
    HealthStatus,
    ApiError,
    RealTimeUpdate,
    ChangeNotification,
} from './api';

export type {
    DashboardProps,
    ChartComponentProps,
    TimeRangeSelectorProps,
    DataFilterProps,
    ExportDialogProps,
    LoadingState,
    ErrorState,
    ThemeConfig,
    AriaLabels,
    PerformanceMetrics,
} from './dashboard';