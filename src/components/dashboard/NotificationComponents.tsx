/**
 * Notification Components
 * Components for displaying real-time change notifications
 */

'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, X, AlertTriangle, Info } from 'lucide-react';

interface ChangeNotification {
    metricId: string;
    previousValue: number;
    currentValue: number;
    changePercent: number;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
}

interface NotificationToastProps {
    notification: ChangeNotification;
    onDismiss: (metricId: string) => void;
    className?: string;
}

export function NotificationToast({
    notification,
    onDismiss,
    className,
}: NotificationToastProps) {
    const isPositive = notification.changePercent > 0;
    const isNegative = notification.changePercent < 0;

    const getSeverityColor = () => {
        switch (notification.severity) {
            case 'high':
                return isPositive
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
                    : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
            case 'medium':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200';
            case 'low':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200';
        }
    };

    const getSeverityIcon = () => {
        switch (notification.severity) {
            case 'high':
                return isPositive ? TrendingUp : TrendingDown;
            case 'medium':
                return AlertTriangle;
            case 'low':
            default:
                return Info;
        }
    };

    const Icon = getSeverityIcon();

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-sm max-w-md',
                getSeverityColor(),
                className
            )}
            role="alert"
            aria-live="polite"
        >
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                        Metric {notification.metricId}
                    </p>
                    <button
                        onClick={() => onDismiss(notification.metricId)}
                        className="ml-2 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                        aria-label="Dismiss notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <p className="text-sm mt-1">
                    Changed by {Math.abs(notification.changePercent)}%
                    ({notification.previousValue.toLocaleString()} → {notification.currentValue.toLocaleString()})
                </p>

                <p className="text-xs mt-2 opacity-75">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}

interface NotificationCenterProps {
    notifications: ChangeNotification[];
    onDismiss: (metricId: string) => void;
    onClearAll: () => void;
    className?: string;
}

export function NotificationCenter({
    notifications,
    onDismiss,
    onClearAll,
    className,
}: NotificationCenterProps) {
    if (notifications.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed top-4 right-4 z-50 space-y-2 max-w-sm',
                className
            )}
            role="region"
            aria-label="Change notifications"
        >
            {notifications.length > 1 && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onClearAll}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
                    >
                        Clear all ({notifications.length})
                    </button>
                </div>
            )}

            {notifications.map((notification) => (
                <NotificationToast
                    key={`${notification.metricId}-${notification.timestamp}`}
                    notification={notification}
                    onDismiss={onDismiss}
                />
            ))}
        </div>
    );
}

// Inline notification component for dashboard
interface InlineNotificationProps {
    notification: ChangeNotification;
    className?: string;
}

export function InlineNotification({
    notification,
    className,
}: InlineNotificationProps) {
    const isPositive = notification.changePercent > 0;
    const isNegative = notification.changePercent < 0;

    const getSeverityColor = () => {
        switch (notification.severity) {
            case 'high':
                return isPositive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low':
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                getSeverityColor(),
                className
            )}
            role="status"
            aria-live="polite"
        >
            {isPositive ? (
                <TrendingUp className="h-3 w-3" />
            ) : isNegative ? (
                <TrendingDown className="h-3 w-3" />
            ) : null}
            <span>
                {isPositive ? '+' : ''}{notification.changePercent}%
            </span>
        </div>
    );
}