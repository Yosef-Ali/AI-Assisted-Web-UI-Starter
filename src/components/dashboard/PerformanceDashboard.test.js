/**
 * Performance Dashboard Tests
 * Unit tests for performance monitoring components
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PerformanceDashboard } from './PerformanceDashboard';
import { usePerformanceMonitoring } from '../../lib/performance';

// Mock the performance monitoring hook
jest.mock('../../lib/performance', () => ({
  usePerformanceMonitoring: jest.fn(),
  getMemoryUsage: jest.fn(),
  analyzeBundleSize: jest.fn(),
  checkPerformanceBudget: jest.fn(),
}));

const mockUsePerformanceMonitoring = usePerformanceMonitoring;
const mockAnalyzeBundleSize = require('../../lib/performance').analyzeBundleSize;
const mockCheckPerformanceBudget = require('../../lib/performance').checkPerformanceBudget;
const mockGetMemoryUsage = require('../../lib/performance').getMemoryUsage;

describe('PerformanceDashboard', () => {
  beforeEach(() => {
    mockUsePerformanceMonitoring.mockReturnValue({
      metrics: {
        jsSize: 102400,
        cssSize: 51200,
        totalSize: 153600,
        loadTime: 1200,
        firstPaint: 800,
        largestContentfulPaint: 1800,
        cumulativeLayoutShift: 0.05,
        firstInputDelay: 50,
      },
      isSupported: true,
    });

    mockAnalyzeBundleSize.mockReturnValue({
      jsSize: 102400,
      cssSize: 51200,
      totalSize: 153600,
      resourceCount: 10,
      jsResourceCount: 5,
      cssResourceCount: 2,
    });

    mockGetMemoryUsage.mockReturnValue({
      usedJSHeapSize: 52428800, // 50MB
      totalJSHeapSize: 104857600, // 100MB
      jsHeapSizeLimit: 2147483648, // 2GB
      usedPercentage: 25.0,
    });

    mockCheckPerformanceBudget.mockReturnValue({
      passed: true,
      violations: [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders performance dashboard with metrics', async () => {
    render(<PerformanceDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Core Web Vitals')).toBeInTheDocument();
      expect(screen.getByText('Bundle Size')).toBeInTheDocument();
      expect(screen.getByText('Largest Contentful Paint')).toBeInTheDocument();
    });
  });

  it('shows performance budget violations when present', () => {
    mockCheckPerformanceBudget.mockReturnValue({
      passed: false,
      violations: ['Bundle size exceeded: 300KB > 200KB'],
    });

    render(<PerformanceDashboard />);

    expect(screen.getByText('Performance Budget Violations')).toBeInTheDocument();
  });

  it('shows unsupported message when performance API is not available', () => {
    mockUsePerformanceMonitoring.mockReturnValue({
      metrics: null,
      isSupported: false,
    });

    render(<PerformanceDashboard />);

    expect(screen.getByText('Performance monitoring is not supported in this browser')).toBeInTheDocument();
  });

  it('shows detailed metrics when showDetailedMetrics is true', () => {
    render(<PerformanceDashboard showDetailedMetrics={true} />);

    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });
});