/**
 * Performance Monitoring Page
 * Dedicated page for monitoring dashboard performance metrics
 */

'use client';

import React from 'react';
import { PerformanceDashboard } from '../../components/dashboard/PerformanceDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { RefreshCw, Download, Settings } from 'lucide-react';

export default function PerformancePage() {
    const [showDetailed, setShowDetailed] = React.useState(false);
    const [lastUpdated, setLastUpdated] = React.useState(new Date());

    const handleRefresh = () => {
        setLastUpdated(new Date());
        // Force page reload to get fresh metrics
        window.location.reload();
    };

    const handleExport = () => {
        // Export performance data as JSON
        const performanceData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            // Add more performance data here
        };

        const blob = new Blob([JSON.stringify(performanceData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Performance Monitoring
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Monitor dashboard performance metrics and Core Web Vitals
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDetailed(!showDetailed)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            {showDetailed ? 'Hide' : 'Show'} Details
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Performance Dashboard */}
                <PerformanceDashboard
                    showDetailedMetrics={showDetailed}
                    refreshInterval={5000}
                />

                {/* Recommendations Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Recommendations</CardTitle>
                        <CardDescription>
                            Suggestions to improve dashboard performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium text-sm mb-2">Bundle Optimization</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Code splitting implemented for chart components</li>
                                    <li>• Vendor chunks separated for better caching</li>
                                    <li>• Tree shaking enabled for unused code</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium text-sm mb-2">Caching Strategy</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• API responses cached for 5 minutes</li>
                                    <li>• Static assets cached for 1 year</li>
                                    <li>• Service worker for offline support</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium text-sm mb-2">Image Optimization</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• WebP/AVIF formats supported</li>
                                    <li>• Responsive image sizes configured</li>
                                    <li>• Lazy loading for below-fold images</li>
                                </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium text-sm mb-2">Monitoring</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Core Web Vitals tracking enabled</li>
                                    <li>• Memory usage monitoring active</li>
                                    <li>• Performance budget alerts configured</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Details */}
                {showDetailed && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Details</CardTitle>
                            <CardDescription>
                                Detailed performance and technical information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-3">Browser Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">User Agent:</span>
                                            <span className="font-mono text-xs break-all">
                                                {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Viewport:</span>
                                            <span className="font-mono">
                                                {typeof window !== 'undefined'
                                                    ? `${window.innerWidth}x${window.innerHeight}`
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Device Pixel Ratio:</span>
                                            <span className="font-mono">
                                                {typeof window !== 'undefined' ? window.devicePixelRatio : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-3">Performance API Support</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Performance API:</span>
                                            <Badge variant={
                                                typeof window !== 'undefined' && 'performance' in window
                                                    ? 'default'
                                                    : 'secondary'
                                            }>
                                                {typeof window !== 'undefined' && 'performance' in window ? 'Supported' : 'Not Supported'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Memory Info:</span>
                                            <Badge variant={
                                                typeof window !== 'undefined' &&
                                                    'performance' in window &&
                                                    'memory' in (window.performance as any)
                                                    ? 'default'
                                                    : 'secondary'
                                            }>
                                                {typeof window !== 'undefined' &&
                                                    'performance' in window &&
                                                    'memory' in (window.performance as any)
                                                    ? 'Supported'
                                                    : 'Not Supported'
                                                }
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Web Vitals:</span>
                                            <Badge variant="default">Supported</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}