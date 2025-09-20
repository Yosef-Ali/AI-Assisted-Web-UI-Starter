/**
 * Dashboard-specific TypeScript types and interfaces
 * Extends core API types with dashboard-specific functionality
 */

import { Chart, Dashboard, DataPoint, GridPosition, GridSize } from './api';

// Dashboard component props
export interface DashboardProps {
    dashboardId?: string;
    className?: string;
    onDashboardChange?: (dashboard: Dashboard) => void;
    onChartUpdate?: (chartId: string, updates: Partial<Chart>) => void;
    onChartDelete?: (chartId: string) => void;
    isEditable?: boolean;
    showControls?: boolean;
}

// Chart component props
export interface ChartComponentProps {
    chart: Chart;
    data: DataPoint[];
    isLoading?: boolean;
    error?: string;
    className?: string;
    onUpdate?: (updates: Partial<Chart>) => void;
    onDelete?: () => void;
    isEditable?: boolean;
    width?: number;
    height?: number;
}

// Chart container props
export interface ChartContainerProps {
    chart: Chart;
    children: React.ReactNode;
    className?: string;
    onPositionChange?: (position: GridPosition) => void;
    onSizeChange?: (size: GridSize) => void;
    isDragging?: boolean;
    isResizing?: boolean;
}

// Dashboard grid props
export interface DashboardGridProps {
    dashboard: Dashboard;
    className?: string;
    onLayoutChange?: (charts: Chart[]) => void;
    onChartAdd?: (chart: Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>) => void;
    isEditable?: boolean;
    columns?: number;
    gap?: number;
}

// Time range selector props
export interface TimeRangeSelectorProps {
    value: {
        start: Date;
        end: Date;
    };
    onChange: (range: { start: Date; end: Date }) => void;
    className?: string;
    presets?: TimeRangePreset[];
    showCustom?: boolean;
}

export interface TimeRangePreset {
    label: string;
    value: {
        start: Date;
        end: Date;
    };
}

// Data filter props
export interface DataFilterProps {
    filters: DataFilters;
    onChange: (filters: DataFilters) => void;
    availableMetrics: string[];
    className?: string;
}

export interface DataFilters {
    metrics?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    aggregation?: 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    quality?: ('good' | 'warning' | 'error')[];
}

// Export dialog props
export interface ExportDialogProps {
    dashboard: Dashboard;
    isOpen: boolean;
    onClose: () => void;
    onExport: (config: ExportConfig) => void;
    className?: string;
}

export interface ExportConfig {
    format: 'csv' | 'json' | 'pdf';
    dateRange: {
        start: Date;
        end: Date;
    };
    charts?: string[];
    includeMetadata?: boolean;
    aggregation?: 'raw' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

// Loading states
export interface LoadingState {
    isLoading: boolean;
    message?: string;
    progress?: number;
}

export interface ErrorState {
    error: string;
    onRetry?: () => void;
    className?: string;
}

// Real-time update props
export interface RealTimeIndicatorProps {
    isConnected: boolean;
    lastUpdate?: Date;
    className?: string;
    onToggleConnection?: (connected: boolean) => void;
}

// Chart configuration dialog props
export interface ChartConfigDialogProps {
    chart: Chart;
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: Partial<Chart>) => void;
    availableMetrics: string[];
    className?: string;
}

// Dashboard settings props
export interface DashboardSettingsProps {
    dashboard: Dashboard;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updates: Partial<Dashboard>) => void;
    className?: string;
}

// Metric selector props
export interface MetricSelectorProps {
    selectedMetrics: string[];
    onChange: (metrics: string[]) => void;
    availableMetrics: Array<{
        id: string;
        name: string;
        category: string;
        type: string;
    }>;
    className?: string;
    multiple?: boolean;
    placeholder?: string;
}

// Chart type selector props
export interface ChartTypeSelectorProps {
    value: string;
    onChange: (type: string) => void;
    availableTypes: Array<{
        value: string;
        label: string;
        icon?: React.ComponentType;
        description?: string;
    }>;
    className?: string;
}

// Notification props
export interface NotificationProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    onClose?: () => void;
    autoClose?: boolean;
    duration?: number;
    className?: string;
}

// Theme and styling types
export interface ThemeConfig {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        warning: string;
        success: string;
        info: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
}

// Accessibility types
export interface AriaLabels {
    dashboard: string;
    chart: string;
    controls: string;
    export: string;
    settings: string;
    timeRange: string;
    filters: string;
    loading: string;
    error: string;
}

export interface KeyboardShortcuts {
    save: string;
    export: string;
    refresh: string;
    settings: string;
    help: string;
}

// Performance monitoring types
export interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    dataFetchTime: number;
    chartRenderTime: number;
    memoryUsage: number;
    timestamp: Date;
}

// Cache types
export interface CacheEntry<T> {
    data: T;
    timestamp: Date;
    ttl: number;
    version: string;
}

export interface CacheConfig {
    defaultTtl: number;
    maxSize: number;
    strategy: 'lru' | 'lfu' | 'fifo';
}

// Animation types
export interface AnimationConfig {
    duration: number;
    easing: string;
    delay?: number;
    stagger?: number;
}

export interface TransitionConfig {
    enter: AnimationConfig;
    exit: AnimationConfig;
    update: AnimationConfig;
}