/**
 * Time Range Picker Component
 * Allows users to select time ranges for dashboard data
 */

'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export type TimeRange =
    | '1h' | '6h' | '12h' | '24h' | '7d' | '30d' | '90d' | 'custom';

interface TimeRangeOption {
    value: TimeRange;
    label: string;
    hours: number;
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
    { value: '1h', label: 'Last Hour', hours: 1 },
    { value: '6h', label: 'Last 6 Hours', hours: 6 },
    { value: '12h', label: 'Last 12 Hours', hours: 12 },
    { value: '24h', label: 'Last 24 Hours', hours: 24 },
    { value: '7d', label: 'Last 7 Days', hours: 168 },
    { value: '30d', label: 'Last 30 Days', hours: 720 },
    { value: '90d', label: 'Last 90 Days', hours: 2160 },
    { value: 'custom', label: 'Custom Range', hours: 0 },
];

interface TimeRangePickerProps {
    value: TimeRange;
    onChange: (range: TimeRange, start?: Date, end?: Date) => void;
    className?: string;
    showCustomPicker?: boolean;
}

export function TimeRangePicker({
    value,
    onChange,
    className,
    showCustomPicker = true,
}: TimeRangePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [customStart, setCustomStart] = React.useState<Date>();
    const [customEnd, setCustomEnd] = React.useState<Date>();

    const selectedOption = TIME_RANGE_OPTIONS.find(option => option.value === value);

    const handleRangeSelect = (range: TimeRange) => {
        if (range === 'custom') {
            if (showCustomPicker) {
                setIsOpen(true);
            }
        } else {
            onChange(range);
            setIsOpen(false);
        }
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            onChange('custom', customStart, customEnd);
            setIsOpen(false);
        }
    };

    const getTimeRangeLabel = () => {
        if (value === 'custom' && customStart && customEnd) {
            return `${customStart.toLocaleDateString()} - ${customEnd.toLocaleDateString()}`;
        }
        return selectedOption?.label || 'Select Range';
    };

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
                    <Clock className="h-4 w-4" />
                    <span>{getTimeRangeLabel()}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </Button>

            {isOpen && (
                <Card className="absolute top-full mt-1 w-full z-50">
                    <CardContent className="p-0">
                        <div className="max-h-64 overflow-y-auto">
                            {TIME_RANGE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleRangeSelect(option.value)}
                                    className={cn(
                                        'w-full px-3 py-2 text-left hover:bg-muted transition-colors',
                                        value === option.value && 'bg-muted font-medium'
                                    )}
                                    role="option"
                                    aria-selected={value === option.value}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {value === 'custom' && showCustomPicker && (
                            <div className="border-t p-3 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={customStart?.toISOString().split('T')[0] || ''}
                                            onChange={(e) => setCustomStart(new Date(e.target.value))}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={customEnd?.toISOString().split('T')[0] || ''}
                                            onChange={(e) => setCustomEnd(new Date(e.target.value))}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleCustomApply}
                                    disabled={!customStart || !customEnd}
                                    size="sm"
                                    className="w-full"
                                >
                                    Apply Custom Range
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Quick time range buttons component
interface QuickTimeRangeProps {
    onChange: (range: TimeRange) => void;
    className?: string;
}

export function QuickTimeRange({
    onChange,
    className,
}: QuickTimeRangeProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {TIME_RANGE_OPTIONS.slice(0, -1).map((option) => (
                <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => onChange(option.value)}
                    className="text-xs"
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
}