import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { InvoiceCreateSchema } from '../../../types/project-management';
import { createInvoice, listInvoicesByProject } from '../../../services/invoices';

// Enhanced query parameters schema for invoices
const InvoiceQuerySchema = z.object({
    projectId: z.string().uuid().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void', 'refunded']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.enum(['code', 'amount_cents', 'issue_date', 'due_date', 'created_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
});

// Enhanced response helpers
function createSuccessResponse<T>(data: T, meta?: any) {
    return NextResponse.json({
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta,
        },
    });
}

function createErrorResponse(code: string, message: string, status: number, details?: any) {
    return NextResponse.json({
        success: false,
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
        },
    }, { status });
}

// Security headers
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// GET /api/invoices - List invoices with filtering
export async function GET(req: NextRequest) {
    try {
        // Parse and validate query parameters
        const searchParams = req.nextUrl.searchParams;
        const queryParams = {
            projectId: searchParams.get('projectId') || undefined,
            status: searchParams.get('status') || undefined,
            page: parseInt(searchParams.get('page') || '1', 10),
            limit: parseInt(searchParams.get('limit') || '10', 10),
            sort: searchParams.get('sort') || 'created_at',
            order: searchParams.get('order') || 'desc',
            fromDate: searchParams.get('fromDate') || undefined,
            toDate: searchParams.get('toDate') || undefined,
        };

        const validationResult = InvoiceQuerySchema.safeParse(queryParams);
        if (!validationResult.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid query parameters',
                400,
                validationResult.error.issues
            );
        }

        const validatedParams = validationResult.data;

        // Require projectId for now (could be expanded later for global invoice listing)
        if (!validatedParams.projectId) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Project ID is required',
                400
            );
        }

        // Call service with validated parameters
        const result = await listInvoicesByProject(validatedParams.projectId);

        if (!result.ok) {
            return createErrorResponse(
                'SERVICE_ERROR',
                result.error,
                500
            );
        }

        // Add security headers and return response
        const response = createSuccessResponse(result.data, {
            pagination: {
                page: validatedParams.page,
                limit: validatedParams.limit,
                total: result.data.length,
            },
            filters: {
                projectId: validatedParams.projectId,
                status: validatedParams.status,
                dateRange: validatedParams.fromDate || validatedParams.toDate ? {
                    from: validatedParams.fromDate,
                    to: validatedParams.toDate,
                } : undefined,
            },
        });

        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;

    } catch (error) {
        console.error('GET /api/invoices error:', error);
        return createErrorResponse(
            'INTERNAL_ERROR',
            'An unexpected error occurred',
            500,
            process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        );
    }
}

// POST /api/invoices - Create new invoice
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();

        // Validate request data
        const validationResult = InvoiceCreateSchema.safeParse(body);
        if (!validationResult.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid invoice data',
                400,
                validationResult.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                }))
            );
        }

        // Create invoice
        const result = await createInvoice(validationResult.data);

        if (!result.ok) {
            // Map service errors to appropriate HTTP status codes
            const statusCode = result.error.includes('DUPLICATE') ? 409 :
                result.error.includes('NOT_FOUND') ? 404 :
                    result.error.includes('FORBIDDEN') ? 403 : 500;

            return createErrorResponse(
                'SERVICE_ERROR',
                result.error,
                statusCode
            );
        }

        // Add security headers and return created invoice
        const response = createSuccessResponse(result.data, {
            created: true,
        });

        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return new NextResponse(response.body, {
            status: 201,
            headers: response.headers,
        });

    } catch (error) {
        console.error('POST /api/invoices error:', error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid JSON in request body',
                400
            );
        }

        return createErrorResponse(
            'INTERNAL_ERROR',
            'An unexpected error occurred',
            500,
            process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        );
    }
}

// OPTIONS handler for CORS
export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
            ...SECURITY_HEADERS,
        },
    });
}
