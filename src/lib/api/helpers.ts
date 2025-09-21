import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Base API response schemas
export const ApiSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.any(),
    meta: z.object({
        timestamp: z.string(),
        requestId: z.string().optional(),
    }).optional(),
});

export const ApiErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.any().optional(),
        timestamp: z.string(),
        requestId: z.string().optional(),
    }),
});

export type ApiSuccessResponse<T = any> = {
    success: true;
    data: T;
    meta?: {
        timestamp: string;
        requestId?: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
};

export type ApiErrorResponse = {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
        requestId?: string;
    };
};

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error codes
export const API_ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
    CONFLICT: 'CONFLICT',
    RATE_LIMITED: 'RATE_LIMITED',
} as const;

// Helper functions for consistent API responses
export function createSuccessResponse<T>(
    data: T,
    meta?: ApiSuccessResponse<T>['meta']
): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json({
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta,
        },
    });
}

export function createErrorResponse(
    code: keyof typeof API_ERROR_CODES,
    message: string,
    status: number = 500,
    details?: any,
    requestId?: string
): NextResponse<ApiErrorResponse> {
    return NextResponse.json({
        success: false,
        error: {
            code: API_ERROR_CODES[code],
            message,
            details,
            timestamp: new Date().toISOString(),
            requestId,
        },
    }, { status });
}

// Validation helper
export function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; response: NextResponse<ApiErrorResponse> } {
    const result = schema.safeParse(data);

    if (!result.success) {
        return {
            success: false,
            response: createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid request data',
                400,
                result.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                }))
            ),
        };
    }

    return { success: true, data: result.data };
}

// Async error handler wrapper
export function withErrorHandler<T extends any[]>(
    handler: (...args: T) => Promise<NextResponse>
) {
    return async (...args: T): Promise<NextResponse> => {
        try {
            return await handler(...args);
        } catch (error) {
            console.error('API Error:', error);

            // Handle known error types
            if (error instanceof z.ZodError) {
                return createErrorResponse(
                    'VALIDATION_ERROR',
                    'Validation failed',
                    400,
                    error.issues
                );
            }

            if (error instanceof Error) {
                return createErrorResponse(
                    'INTERNAL_ERROR',
                    'An unexpected error occurred',
                    500,
                    process.env.NODE_ENV === 'development' ? error.message : undefined
                );
            }

            return createErrorResponse(
                'INTERNAL_ERROR',
                'An unexpected error occurred',
                500
            );
        }
    };
}

// Query parameter parsing helpers
export function parseQueryParams(searchParams: URLSearchParams) {
    return {
        page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
        limit: Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '10', 10))),
        sort: searchParams.get('sort') || 'created_at',
        order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
        search: searchParams.get('search') || undefined,
        filter: searchParams.get('filter') || undefined,
    };
}

// Security headers
export const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;

// Rate limiting helper (basic implementation)
const requestLog = new Map<string, number[]>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60000
): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requestLog.has(identifier)) {
        requestLog.set(identifier, []);
    }

    const requests = requestLog.get(identifier)!;
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
        return false;
    }

    recentRequests.push(now);
    requestLog.set(identifier, recentRequests);

    return true;
}

// CORS helper
export function createCorsHeaders(origin?: string) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    return {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24 hours
    };
}

// OPTIONS handler for CORS
export function handleCorsOptions(request: NextRequest): NextResponse {
    const originHeader = request.headers.get('origin') || undefined;
    return new NextResponse(null, {
        status: 200,
        headers: {
            ...createCorsHeaders(originHeader),
            ...SECURITY_HEADERS,
        },
    });
}