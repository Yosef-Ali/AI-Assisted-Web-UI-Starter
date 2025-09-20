/**
 * Performance Optimization Utilities
 * Bundle analysis, monitoring, and optimization helpers
 */

import { useEffect, useState } from 'react';

// Bundle size monitoring
export interface BundleMetrics {
    jsSize: number;
    cssSize: number;
    totalSize: number;
    loadTime: number;
    firstPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
    const [metrics, setMetrics] = useState<BundleMetrics | null>(null);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if Performance API is supported
        if ('performance' in window && 'getEntriesByType' in performance) {
            setIsSupported(true);

            // Monitor Core Web Vitals
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();

                entries.forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        setMetrics(prev => ({
                            ...prev,
                            largestContentfulPaint: entry.startTime,
                        } as BundleMetrics));
                    } else if (entry.entryType === 'layout-shift') {
                        setMetrics(prev => ({
                            ...prev,
                            cumulativeLayoutShift: (prev?.cumulativeLayoutShift || 0) + (entry as any).value,
                        } as BundleMetrics));
                    }
                });
            });

            observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });

            // Monitor navigation timing
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigation) {
                setMetrics(prev => ({
                    ...prev,
                    loadTime: navigation.loadEventEnd - navigation.fetchStart,
                    firstPaint: navigation.responseStart - navigation.fetchStart,
                } as BundleMetrics));
            }

            return () => observer.disconnect();
        }
    }, []);

    return { metrics, isSupported };
}

// Bundle size analyzer
export function analyzeBundleSize() {
    if (typeof window === 'undefined') return null;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));

    const jsSize = jsResources.reduce((total, r) => total + (r.transferSize || 0), 0);
    const cssSize = cssResources.reduce((total, r) => total + (r.transferSize || 0), 0);

    return {
        jsSize,
        cssSize,
        totalSize: jsSize + cssSize,
        resourceCount: resources.length,
        jsResourceCount: jsResources.length,
        cssResourceCount: cssResources.length,
    };
}

// Memory usage monitoring
export interface MemoryInfo {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    usedPercentage: number;
}

export function getMemoryUsage(): MemoryInfo | null {
    if (typeof window === 'undefined') return null;

    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
}

// Performance budget checker
export interface PerformanceBudget {
    maxBundleSize: number; // in bytes
    maxLoadTime: number; // in milliseconds
    maxFirstPaint: number; // in milliseconds
    maxLCP: number; // in milliseconds
    maxCLS: number; // cumulative layout shift score
    maxFID: number; // in milliseconds
}

const DEFAULT_BUDGET: PerformanceBudget = {
    maxBundleSize: 200 * 1024, // 200KB
    maxLoadTime: 3000, // 3 seconds
    maxFirstPaint: 1500, // 1.5 seconds
    maxLCP: 2500, // 2.5 seconds
    maxCLS: 0.1, // 0.1 CLS score
    maxFID: 100, // 100ms
};

export function checkPerformanceBudget(
    metrics: BundleMetrics,
    budget: PerformanceBudget = DEFAULT_BUDGET
): { passed: boolean; violations: string[] } {
    const violations: string[] = [];

    if (metrics.totalSize > budget.maxBundleSize) {
        violations.push(`Bundle size exceeded: ${(metrics.totalSize / 1024).toFixed(1)}KB > ${(budget.maxBundleSize / 1024).toFixed(1)}KB`);
    }

    if (metrics.loadTime > budget.maxLoadTime) {
        violations.push(`Load time exceeded: ${metrics.loadTime.toFixed(0)}ms > ${budget.maxLoadTime}ms`);
    }

    if (metrics.firstPaint > budget.maxFirstPaint) {
        violations.push(`First paint exceeded: ${metrics.firstPaint.toFixed(0)}ms > ${budget.maxFirstPaint}ms`);
    }

    if (metrics.largestContentfulPaint > budget.maxLCP) {
        violations.push(`LCP exceeded: ${metrics.largestContentfulPaint.toFixed(0)}ms > ${budget.maxLCP}ms`);
    }

    if (metrics.cumulativeLayoutShift > budget.maxCLS) {
        violations.push(`CLS exceeded: ${metrics.cumulativeLayoutShift.toFixed(3)} > ${budget.maxCLS}`);
    }

    if (metrics.firstInputDelay > budget.maxFID) {
        violations.push(`FID exceeded: ${metrics.firstInputDelay.toFixed(0)}ms > ${budget.maxFID}ms`);
    }

    return {
        passed: violations.length === 0,
        violations,
    };
}

// Web Vitals reporter
export function reportWebVitals(metric: any) {
    // Send to analytics service
    console.log('Web Vital:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
    });

    // You can send this to your analytics service
    // analytics.track('web_vitals', {
    //   name: metric.name,
    //   value: metric.value,
    //   rating: metric.rating,
    // });
}

// Resource preloader
export function preloadResource(href: string, as: string, type?: string) {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;

    if (type) {
        link.type = type;
    }

    document.head.appendChild(link);
}

// Image optimization helper
export function optimizeImage(src: string, width: number, height?: number): string {
    // This is a placeholder for image optimization
    // In a real app, you might use a service like Cloudinary or Next.js Image component
    const params = new URLSearchParams({
        w: width.toString(),
        ...(height && { h: height.toString() }),
        q: '80', // quality
        f: 'auto', // format
    });

    return `${src}?${params.toString()}`;
}

// Debounced performance logger
export function createPerformanceLogger(interval: number = 5000) {
    let timeoutId: NodeJS.Timeout;

    return function logPerformance() {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            const memory = getMemoryUsage();
            const bundleMetrics = analyzeBundleSize();

            if (memory) {
                console.log('Memory Usage:', {
                    used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
                    total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
                    limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
                    percentage: `${memory.usedPercentage.toFixed(1)}%`,
                });
            }

            if (bundleMetrics) {
                console.log('Bundle Metrics:', {
                    jsSize: `${(bundleMetrics.jsSize / 1024).toFixed(1)}KB`,
                    cssSize: `${(bundleMetrics.cssSize / 1024).toFixed(1)}KB`,
                    totalSize: `${(bundleMetrics.totalSize / 1024).toFixed(1)}KB`,
                    resourceCount: bundleMetrics.resourceCount,
                });
            }
        }, interval);
    };
}