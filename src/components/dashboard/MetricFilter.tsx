/**
 * Metric Filter Component
 * Allows users to filter dashboard metrics
 */

'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Filter, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Metric {
    id: string;
    name: string;
    category?: string;
    type: 'numeric' | 'percentage' | 'currency' | 'count';
    unit?: string;
}

interface MetricFilterProps {
    metrics: Metric[];
    selectedMetrics: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    className?: string;
    showCategories?: boolean;
    allowMultiple?: boolean;
}

export function MetricFilter({
    metrics,
    selectedMetrics,
    onSelectionChange,
    className,
    showCategories = true,
    allowMultiple = true,
}: MetricFilterProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

    // Group metrics by category
    const categories = React.useMemo(() => {
        const cats = new Set(metrics.map(m => m.category || 'General'));
        return Array.from(cats).sort();
    }, [metrics]);

    // Filter metrics based on search and categories
    const filteredMetrics = React.useMemo(() => {
        return metrics.filter(metric => {
            const matchesSearch = metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                metric.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.includes(metric.category || 'General');
            return matchesSearch && matchesCategory;
        });
    }, [metrics, searchTerm, selectedCategories]);

    const handleMetricToggle = (metricId: string) => {
        if (allowMultiple) {
            const newSelection = selectedMetrics.includes(metricId)
                ? selectedMetrics.filter(id => id !== metricId)
                : [...selectedMetrics, metricId];
            onSelectionChange(newSelection);
        } else {
            onSelectionChange([metricId]);
            setIsOpen(false);
        }
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
    };

    const selectedCount = selectedMetrics.length;
    const totalCount = metrics.length;

    return (
        <div className={cn('relative', className)}>
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full justify-between"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>
                        {selectedCount === 0
                            ? 'All Metrics'
                            : `${selectedCount} of ${totalCount} selected`
                        }
                    </span>
                </div>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                    {selectedCount}
                </span>
            </Button>

            {isOpen && (
                <Card className="absolute top-full mt-1 w-full z-50 max-h-96 overflow-hidden">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Filter Metrics</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="h-6 px-2 text-xs"
                            >
                                Clear
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search metrics..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        {/* Categories */}
                        {showCategories && categories.length > 1 && (
                            <div>
                                <div className="text-sm font-medium mb-2">Categories</div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <Badge
                                            key={category}
                                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleCategoryToggle(category)}
                                        >
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metrics List */}
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {filteredMetrics.map(metric => (
                                <div
                                    key={metric.id}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                                    onClick={() => handleMetricToggle(metric.id)}
                                >
                                    <Checkbox
                                        checked={selectedMetrics.includes(metric.id)}
                                        onChange={() => handleMetricToggle(metric.id)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">
                                            {metric.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {metric.type}
                                            {metric.unit && ` • ${metric.unit}`}
                                        </div>
                                    </div>
                                    {metric.category && showCategories && (
                                        <Badge variant="secondary" className="text-xs">
                                            {metric.category}
                                        </Badge>
                                    )}
                                </div>
                            ))}

                            {filteredMetrics.length === 0 && (
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                    No metrics found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Selected metrics display */}
            {selectedCount > 0 && !isOpen && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {selectedMetrics.slice(0, 3).map(metricId => {
                        const metric = metrics.find(m => m.id === metricId);
                        return metric ? (
                            <Badge
                                key={metricId}
                                variant="secondary"
                                className="text-xs"
                            >
                                {metric.name}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMetricToggle(metricId);
                                    }}
                                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ) : null;
                    })}
                    {selectedCount > 3 && (
                        <Badge variant="secondary" className="text-xs">
                            +{selectedCount - 3} more
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}

// Compact metric selector for inline use
interface CompactMetricSelectorProps {
    metrics: Metric[];
    selectedMetrics: string[];
    onSelectionChange: (selectedIds: string[]) => void;
    className?: string;
}

export function CompactMetricSelector({
    metrics,
    selectedMetrics,
    onSelectionChange,
    className,
}: CompactMetricSelectorProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {metrics.map(metric => (
                <Button
                    key={metric.id}
                    variant={selectedMetrics.includes(metric.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                        const newSelection = selectedMetrics.includes(metric.id)
                            ? selectedMetrics.filter(id => id !== metric.id)
                            : [...selectedMetrics, metric.id];
                        onSelectionChange(newSelection);
                    }}
                    className="text-xs"
                >
                    {metric.name}
                </Button>
            ))}
        </div>
    );
}