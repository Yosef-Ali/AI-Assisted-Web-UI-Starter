import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DataPoint, ChartType, MetricType, DataQuality } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date and time utilities
export const dateUtils = {
  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  },

  formatDateTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString();
  },

  formatTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString();
  },

  isValidDate: (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  },

  parseISO: (dateString: string): Date => {
    return new Date(dateString);
  },

  toISOString: (date: Date): string => {
    return date.toISOString();
  },

  getTimeRange: (start: Date, end: Date): { start: string; end: string } => {
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  },

  getRelativeTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return dateUtils.formatDate(d);
  },
};

// Number and data formatting utilities
export const formatUtils = {
  formatNumber: (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },

  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${formatUtils.formatNumber(value * 100, decimals)}%`;
  },

  formatBytes: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${formatUtils.formatNumber(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
  },

  formatDuration: (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },
};

// Data processing utilities
export const dataUtils = {
  aggregateData: (
    data: DataPoint[],
    interval: 'hour' | 'day' | 'week' | 'month'
  ): DataPoint[] => {
    const grouped: { [key: string]: DataPoint[] } = {};

    data.forEach(point => {
      const date = new Date(point.timestamp);
      let key: string;

      switch (interval) {
        case 'hour':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
          break;
        case 'day':
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth()}`;
          break;
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(point);
    });

    return Object.entries(grouped).map(([key, points]) => {
      const avgValue = points.reduce((sum, p) => sum + p.value, 0) / points.length;
      const timestamp = new Date(points[0].timestamp);

      return {
        id: `${key}-aggregated`,
        metricId: points[0].metricId,
        value: avgValue,
        timestamp: timestamp.toISOString(),
        quality: points.every(p => p.quality === 'good') ? 'good' : 'warning',
      } as DataPoint;
    });
  },

  filterDataByQuality: (data: DataPoint[], qualities: DataQuality[]): DataPoint[] => {
    return data.filter(point => qualities.includes(point.quality));
  },

  filterDataByDateRange: (data: DataPoint[], start: Date, end: Date): DataPoint[] => {
    return data.filter(point => {
      const pointDate = new Date(point.timestamp);
      return pointDate >= start && pointDate <= end;
    });
  },

  calculateChange: (current: number, previous: number): { value: number; percentage: number } => {
    const change = current - previous;
    const percentage = previous !== 0 ? (change / previous) * 100 : 0;
    return { value: change, percentage };
  },

  findOutliers: (data: DataPoint[], threshold: number = 2): DataPoint[] => {
    const values = data.map(p => p.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    );

    return data.filter(point => Math.abs(point.value - mean) > threshold * stdDev);
  },

  normalizeData: (data: DataPoint[]): DataPoint[] => {
    const values = data.map(p => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0) return data;

    return data.map(point => ({
      ...point,
      value: (point.value - min) / range,
    }));
  },
};

// Chart utilities
export const chartUtils = {
  getChartTypeLabel: (type: ChartType): string => {
    const labels: Record<ChartType, string> = {
      line: 'Line Chart',
      bar: 'Bar Chart',
      area: 'Area Chart',
      pie: 'Pie Chart',
      scatter: 'Scatter Plot',
      gauge: 'Gauge Chart',
    };
    return labels[type] || 'Unknown Chart';
  },

  getDefaultChartConfig: (type: ChartType) => {
    const configs = {
      line: {
        colors: ['#3b82f6'],
        showLegend: true,
        showGrid: true,
        animation: true,
        interactive: true,
      },
      bar: {
        colors: ['#10b981'],
        showLegend: false,
        showGrid: true,
        animation: true,
        interactive: true,
      },
      area: {
        colors: ['#f59e0b'],
        showLegend: true,
        showGrid: true,
        animation: true,
        interactive: true,
      },
      pie: {
        colors: ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
        showLegend: true,
        showGrid: false,
        animation: true,
        interactive: true,
      },
      scatter: {
        colors: ['#3b82f6'],
        showLegend: false,
        showGrid: true,
        animation: true,
        interactive: true,
      },
      gauge: {
        colors: ['#10b981', '#f59e0b', '#ef4444'],
        showLegend: false,
        showGrid: false,
        animation: true,
        interactive: true,
      },
    };

    return configs[type] || configs.line;
  },

  validateChartData: (data: DataPoint[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { isValid: false, errors };
    }

    if (data.length === 0) {
      errors.push('Data array cannot be empty');
      return { isValid: false, errors };
    }

    data.forEach((point, index) => {
      if (typeof point.value !== 'number' || isNaN(point.value)) {
        errors.push(`Data point ${index} has invalid value: ${point.value}`);
      }

      if (!point.timestamp || !dateUtils.isValidDate(new Date(point.timestamp))) {
        errors.push(`Data point ${index} has invalid timestamp: ${point.timestamp}`);
      }

      if (!point.metricId) {
        errors.push(`Data point ${index} is missing metricId`);
      }
    });

    return { isValid: errors.length === 0, errors };
  },
};

// Metric utilities
export const metricUtils = {
  getMetricTypeLabel: (type: MetricType): string => {
    const labels: Record<MetricType, string> = {
      numeric: 'Numeric',
      percentage: 'Percentage',
      currency: 'Currency',
      count: 'Count',
    };
    return labels[type] || 'Unknown';
  },

  formatMetricValue: (value: number, type: MetricType, unit?: string): string => {
    switch (type) {
      case 'currency':
        return formatUtils.formatCurrency(value);
      case 'percentage':
        return formatUtils.formatPercentage(value / 100);
      case 'numeric':
        return unit ? `${formatUtils.formatNumber(value)} ${unit}` : formatUtils.formatNumber(value);
      case 'count':
        return formatUtils.formatNumber(value, 0);
      default:
        return formatUtils.formatNumber(value);
    }
  },

  validateMetricValue: (value: number, type: MetricType, min?: number, max?: number): boolean => {
    if (typeof value !== 'number' || isNaN(value)) return false;

    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;

    if (type === 'percentage' && (value < 0 || value > 100)) return false;

    return true;
  },
};

// Validation utilities
export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidUUID: (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },

  sanitizeString: (str: string): string => {
    return str.replace(/[<>]/g, '').trim();
  },

  isNonEmptyString: (str: any): str is string => {
    return typeof str === 'string' && str.trim().length > 0;
  },
};

// Local storage utilities
export const storageUtils = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue || null);
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch {
      // Ignore storage errors
    }
  },
};

// Debounce utility for search and input handling
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance-critical operations
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
