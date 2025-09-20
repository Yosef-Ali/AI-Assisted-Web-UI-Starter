/**
 * Performance Utilities Tests
 * Unit tests for performance monitoring utilities
 */

const {
  checkPerformanceBudget,
  getMemoryUsage,
  analyzeBundleSize,
  createPerformanceLogger,
} = require('./performance');

// Mock window.performance
const mockPerformance = {
  getEntriesByType: jest.fn(),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024, // 100MB
    jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
  },
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformance.getEntriesByType.mockReturnValue([
      { name: 'app.js', transferSize: 100 * 1024 },
      { name: 'vendor.js', transferSize: 200 * 1024 },
      { name: 'styles.css', transferSize: 50 * 1024 },
      { name: 'image.png', transferSize: 25 * 1024 },
    ]);
  });

  describe('checkPerformanceBudget', () => {
    const defaultBudget = {
      maxBundleSize: 200 * 1024, // 200KB
      maxLoadTime: 3000, // 3 seconds
      maxFirstPaint: 1500, // 1.5 seconds
      maxLCP: 2500, // 2.5 seconds
      maxCLS: 0.1, // 0.1 CLS score
      maxFID: 100, // 100ms
    };

    it('returns passed when all metrics are within budget', () => {
      const metrics = {
        jsSize: 100 * 1024,
        cssSize: 50 * 1024,
        totalSize: 150 * 1024,
        loadTime: 2000,
        firstPaint: 1000,
        largestContentfulPaint: 2000,
        cumulativeLayoutShift: 0.05,
        firstInputDelay: 50,
      };

      const result = checkPerformanceBudget(metrics, defaultBudget);

      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('returns violations when metrics exceed budget', () => {
      const metrics = {
        jsSize: 250 * 1024, // Over budget
        cssSize: 50 * 1024,
        totalSize: 300 * 1024, // Over budget
        loadTime: 4000, // Over budget
        firstPaint: 1000,
        largestContentfulPaint: 2000,
        cumulativeLayoutShift: 0.05,
        firstInputDelay: 50,
      };

      const result = checkPerformanceBudget(metrics, defaultBudget);

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });
  });

  describe('getMemoryUsage', () => {
    it('returns memory information when available', () => {
      const result = getMemoryUsage();

      expect(result).toEqual({
        usedJSHeapSize: 50 * 1024 * 1024,
        totalJSHeapSize: 100 * 1024 * 1024,
        jsHeapSizeLimit: 200 * 1024 * 1024,
        usedPercentage: 25, // 50MB / 200MB * 100
      });
    });

    it('returns null when performance API is not available', () => {
      // Temporarily remove performance.memory
      const originalMemory = mockPerformance.memory;
      mockPerformance.memory = undefined;

      const result = getMemoryUsage();

      expect(result).toBeNull();

      // Restore memory
      mockPerformance.memory = originalMemory;
    });
  });

  describe('analyzeBundleSize', () => {
    it('analyzes bundle size from performance entries', () => {
      mockPerformance.getEntriesByType.mockReturnValue([
        { name: 'app.js', transferSize: 100 * 1024 },
        { name: 'vendor.js', transferSize: 200 * 1024 },
        { name: 'styles.css', transferSize: 50 * 1024 },
        { name: 'image.png', transferSize: 25 * 1024 },
      ]);

      const result = analyzeBundleSize();

      expect(result).toEqual({
        jsSize: 300 * 1024, // 100KB + 200KB
        cssSize: 50 * 1024, // 50KB
        totalSize: 350 * 1024, // 300KB + 50KB
        resourceCount: 4,
        jsResourceCount: 2,
        cssResourceCount: 1,
      });
    });

    it('returns null when window is not available', () => {
      const originalWindow = global.window;

      // Mock window as undefined
      delete global.window;

      const result = analyzeBundleSize();

      expect(result).toBeNull();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('createPerformanceLogger', () => {
    let originalPerformance;

    beforeEach(() => {
      jest.useFakeTimers();
      originalPerformance = global.performance;

      // Mock global performance API
      global.performance = {
        getEntriesByType: jest.fn(() => []),
        memory: {
          usedJSHeapSize: 50 * 1024 * 1024, // 50MB
          totalJSHeapSize: 100 * 1024 * 1024, // 100MB
          jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
        },
      };
    });

    afterEach(() => {
      jest.useRealTimers();
      global.performance = originalPerformance;
    });

    it('logs performance metrics after delay', () => {
      const logger = createPerformanceLogger(1000);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logger();

      jest.advanceTimersByTime(1000);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Memory Usage:',
        expect.objectContaining({
          used: expect.stringContaining('MB'),
          total: expect.stringContaining('MB'),
          limit: expect.stringContaining('MB'),
          percentage: expect.stringContaining('%'),
        })
      );

      consoleSpy.mockRestore();
    });
  });
});