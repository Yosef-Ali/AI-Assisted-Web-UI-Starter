import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ClientCreateSchema } from '../../../types/project-management';
import { createClient, listClients } from '../../../services/clients';

// Enhanced query parameters schema for clients
const ClientQuerySchema = z.object({
    search: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.enum(['name', 'company', 'created_at', 'updated_at']).default('created_at'),
    order: z.enum(['asc', 'desc']).default('desc'),
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

// GET /api/clients - List clients with search and filtering
export async function GET(req: NextRequest) {
    try {
        // Parse and validate query parameters
        const searchParams = req.nextUrl.searchParams;
        const queryParams = {
            search: searchParams.get('search') || searchParams.get('q') || undefined,
            status: searchParams.get('status') || undefined,
            page: parseInt(searchParams.get('page') || '1', 10),
            limit: parseInt(searchParams.get('limit') || '10', 10),
            sort: searchParams.get('sort') || 'created_at',
            order: searchParams.get('order') || 'desc',
        };

        const validationResult = ClientQuerySchema.safeParse(queryParams);
        if (!validationResult.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid query parameters',
                400,
                validationResult.error.issues
            );
        }

        const validatedParams = validationResult.data;

        // Call service with search parameter
        const result = await listClients(validatedParams.search);

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
                search: validatedParams.search,
                status: validatedParams.status,
            },
        });

        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;

    } catch (error) {
        console.error('GET /api/clients error:', error);
        return createErrorResponse(
            'INTERNAL_ERROR',
            'An unexpected error occurred',
            500,
            process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        );
    }
}

// POST /api/clients - Create new client
export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();

        // Validate request data
        const validationResult = ClientCreateSchema.safeParse(body);
        if (!validationResult.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid client data',
                400,
                validationResult.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                }))
            );
        }

        // Create client
        const result = await createClient(validationResult.data);

        if (!result.ok) {
            // Map service errors to appropriate HTTP status codes
            const statusCode = result.error.includes('DUPLICATE') ? 409 :
                result.error.includes('FORBIDDEN') ? 403 : 500;

            return createErrorResponse(
                'SERVICE_ERROR',
                result.error,
                statusCode
            );
        }

        // Add security headers and return created client
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
        console.error('POST /api/clients error:', error);

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