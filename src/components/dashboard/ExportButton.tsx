/**
 * Export Functionality Component
 * Allows users to export dashboard data in various formats
 */

'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Download, FileText, FileSpreadsheet, Image, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ExportFormat = 'csv' | 'json' | 'pdf' | 'png' | 'svg';

interface ExportOption {
    format: ExportFormat;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    mimeType: string;
    extension: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
    {
        format: 'csv',
        label: 'CSV',
        icon: FileSpreadsheet,
        description: 'Comma-separated values for spreadsheet applications',
        mimeType: 'text/csv',
        extension: 'csv',
    },
    {
        format: 'json',
        label: 'JSON',
        icon: FileText,
        description: 'JavaScript Object Notation for data interchange',
        mimeType: 'application/json',
        extension: 'json',
    },
    {
        format: 'pdf',
        label: 'PDF',
        icon: FileText,
        description: 'Portable Document Format for printing and sharing',
        mimeType: 'application/pdf',
        extension: 'pdf',
    },
    {
        format: 'png',
        label: 'PNG Image',
        icon: Image,
        description: 'High-quality image format for presentations',
        mimeType: 'image/png',
        extension: 'png',
    },
    {
        format: 'svg',
        label: 'SVG Vector',
        icon: Image,
        description: 'Scalable vector graphics for web and design',
        mimeType: 'image/svg+xml',
        extension: 'svg',
    },
];

interface ExportButtonProps {
    onExport: (format: ExportFormat) => Promise<void> | void;
    formats?: ExportFormat[];
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: 'sm' | 'default' | 'lg';
}

export function ExportButton({
    onExport,
    formats = ['csv', 'json', 'pdf'],
    className,
    disabled = false,
    loading = false,
    size = 'default',
}: ExportButtonProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [exportingFormat, setExportingFormat] = React.useState<ExportFormat | null>(null);

    const availableOptions = EXPORT_OPTIONS.filter(option =>
        formats.includes(option.format)
    );

    const handleExport = async (format: ExportFormat) => {
        setExportingFormat(format);
        setIsOpen(false);

        try {
            await onExport(format);
        } finally {
            setExportingFormat(null);
        }
    };

    if (availableOptions.length === 1) {
        // Single format - show direct button
        const option = availableOptions[0];
        const Icon = option.icon;

        return (
            <Button
                onClick={() => handleExport(option.format)}
                disabled={disabled || loading}
                size={size}
                className={className}
            >
                <Icon className="h-4 w-4 mr-2" />
                {loading && exportingFormat === option.format ? 'Exporting...' : `Export ${option.label}`}
            </Button>
        );
    }

    return (
        <div className={cn('relative', className)}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || loading}
                size={size}
                className="justify-between"
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    <span>
                        {loading && exportingFormat
                            ? `Exporting ${EXPORT_OPTIONS.find(o => o.format === exportingFormat)?.label}...`
                            : 'Export'
                        }
                    </span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
            </Button>

            {isOpen && (
                <Card className="absolute top-full mt-1 right-0 w-64 z-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Export Format</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {availableOptions.map((option) => {
                            const Icon = option.icon;
                            const isExporting = loading && exportingFormat === option.format;

                            return (
                                <button
                                    key={option.format}
                                    onClick={() => handleExport(option.format)}
                                    disabled={isExporting}
                                    className="w-full px-3 py-3 text-left hover:bg-muted transition-colors disabled:opacity-50"
                                >
                                    <div className="flex items-start gap-3">
                                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">
                                                {option.label}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {option.description}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Export utilities
export const exportUtils = {
    // Convert data to CSV
    dataToCSV: (data: any[], headers?: string[]): string => {
        if (!data.length) return '';

        const csvHeaders = headers || Object.keys(data[0]);
        const csvRows = data.map(row =>
            csvHeaders.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        );

        return [csvHeaders.join(','), ...csvRows].join('\n');
    },

    // Download file
    downloadFile: (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Generate filename with timestamp
    generateFilename: (baseName: string, extension: string): string => {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        return `${baseName}_${timestamp}.${extension}`;
    },

    // Export dashboard data
    exportDashboardData: async (
        data: any[],
        format: ExportFormat,
        filename?: string
    ): Promise<void> => {
        const baseName = filename || 'dashboard_data';
        const option = EXPORT_OPTIONS.find(o => o.format === format);

        if (!option) {
            throw new Error(`Unsupported export format: ${format}`);
        }

        let content: string;
        let finalFilename: string;

        switch (format) {
            case 'csv':
                content = exportUtils.dataToCSV(data);
                finalFilename = exportUtils.generateFilename(baseName, 'csv');
                break;

            case 'json':
                content = JSON.stringify(data, null, 2);
                finalFilename = exportUtils.generateFilename(baseName, 'json');
                break;

            case 'pdf':
                // PDF export would require a library like jsPDF
                throw new Error('PDF export not implemented. Install jsPDF for PDF support.');

            case 'png':
            case 'svg':
                // Image export would require html2canvas or similar
                throw new Error('Image export not implemented. Install html2canvas for image support.');

            default:
                throw new Error(`Unsupported export format: ${format}`);
        }

        exportUtils.downloadFile(content, finalFilename, option.mimeType);
    },
};