/**
 * DashboardGrid Component
 * Responsive grid layout for dashboard charts
 */

'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface GridPosition {
    x: number;
    y: number;
}

interface GridSize {
    width: number;
    height: number;
}

interface GridItem {
    id: string;
    position: GridPosition;
    size: GridSize;
    component: React.ReactNode;
}

interface DashboardGridProps {
    items: GridItem[];
    columns?: number;
    gap?: number;
    className?: string;
    minItemWidth?: number;
    maxItemWidth?: number;
    ariaLabel?: string;
}

export function DashboardGrid({
    items,
    columns = 12,
    gap = 16,
    className,
    minItemWidth = 300,
    maxItemWidth,
    ariaLabel = 'Dashboard grid layout',
}: DashboardGridProps) {
    const gridRef = React.useRef<HTMLDivElement>(null);

    // Calculate responsive columns based on container width
    const [responsiveColumns, setResponsiveColumns] = React.useState(columns);

    React.useEffect(() => {
        const updateColumns = () => {
            if (!gridRef.current) return;

            const containerWidth = gridRef.current.offsetWidth;
            const availableWidth = containerWidth - (gap * (columns - 1));
            const itemWidth = availableWidth / columns;

            if (itemWidth < minItemWidth) {
                const newColumns = Math.max(1, Math.floor(availableWidth / minItemWidth));
                setResponsiveColumns(newColumns);
            } else if (maxItemWidth && itemWidth > maxItemWidth) {
                const newColumns = Math.min(columns, Math.floor(availableWidth / maxItemWidth));
                setResponsiveColumns(newColumns);
            } else {
                setResponsiveColumns(columns);
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, [columns, gap, minItemWidth, maxItemWidth]);

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
        gap: `${gap}px`,
    };

    return (
        <div
            ref={gridRef}
            className={cn('w-full', className)}
            style={gridStyle}
            role="grid"
            aria-label={ariaLabel}
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    className="dashboard-grid-item"
                    style={{
                        gridColumn: `span ${Math.min(item.size.width, responsiveColumns)}`,
                        gridRow: `span ${item.size.height}`,
                        minHeight: '200px',
                    }}
                    role="gridcell"
                    aria-label={`Chart item ${item.id}`}
                >
                    <div className="w-full h-full p-4 bg-card rounded-lg border shadow-sm">
                        {item.component}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Hook for managing dashboard grid state
export function useDashboardGrid(initialItems: GridItem[] = []) {
    const [items, setItems] = React.useState<GridItem[]>(initialItems);

    const addItem = React.useCallback((item: GridItem) => {
        setItems(prev => [...prev, item]);
    }, []);

    const removeItem = React.useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateItem = React.useCallback((id: string, updates: Partial<GridItem>) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    }, []);

    const moveItem = React.useCallback((id: string, newPosition: GridPosition) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, position: newPosition } : item
            )
        );
    }, []);

    const resizeItem = React.useCallback((id: string, newSize: GridSize) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, size: newSize } : item
            )
        );
    }, []);

    return {
        items,
        addItem,
        removeItem,
        updateItem,
        moveItem,
        resizeItem,
        setItems,
    };
}