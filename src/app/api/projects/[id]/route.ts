import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getProject, updateProject, archiveProject } from '../../../../services/projects';
import { ProjectUpdateSchema } from '../../../../types/project-management';

// UUID validation schema
const UUIDSchema = z.string().uuid('Invalid project ID format');

// Route params interface
interface RouteParams {
    params: Promise<{ id: string }>
}

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

// GET /api/projects/[id] - Get single project
export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const resolvedParams = await params;
        // Validate project ID
        const idValidation = UUIDSchema.safeParse(resolvedParams.id);
        if (!idValidation.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid project ID format',
                400,
                idValidation.error.issues
            );
        }

        // Get project
        const result = await getProject(idValidation.data);

        if (!result.ok) {
            const statusCode = result.error.includes('NOT_FOUND') ? 404 : 500;
            return createErrorResponse(
                'SERVICE_ERROR',
                result.error,
                statusCode
            );
        }

        // Add security headers and return project
        const response = createSuccessResponse(result.data);

        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;

    } catch (error) {
        console.error('GET /api/projects/[id] error:', error);
        return createErrorResponse(
            'INTERNAL_ERROR',
            'An unexpected error occurred',
            500,
            process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        );
    }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const resolvedParams = await params;
        // Validate project ID
        const idValidation = UUIDSchema.safeParse(resolvedParams.id);
        if (!idValidation.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid project ID format',
                400,
                idValidation.error.issues
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const bodyValidation = ProjectUpdateSchema.safeParse(body);

        if (!bodyValidation.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid project update data',
                400,
                bodyValidation.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                }))
            );
        }

        // Update project
        const result = await updateProject(idValidation.data, bodyValidation.data);

        if (!result.ok) {
            const statusCode = result.error.includes('NOT_FOUND') ? 404 :
                result.error.includes('FORBIDDEN') ? 403 :
                    result.error.includes('CONFLICT') ? 409 : 500;

            return createErrorResponse(
                'SERVICE_ERROR',
                result.error,
                statusCode
            );
        }

        // Add security headers and return updated project
        const response = createSuccessResponse(result.data, {
            updated: true,
        });

        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;

    } catch (error) {
        console.error('PATCH /api/projects/[id] error:', error);

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

// DELETE /api/projects/[id] - Archive project (soft delete)
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const resolvedParams = await params;
        // Validate project ID
        const idValidation = UUIDSchema.safeParse(resolvedParams.id);
        if (!idValidation.success) {
            return createErrorResponse(
                'VALIDATION_ERROR',
                'Invalid project ID format',
                400,
                idValidation.error.issues
            );
        }

        // Archive project
        const result = await archiveProject(idValidation.data);

        if (!result.ok) {
            const statusCode = result.error.includes('NOT_FOUND') ? 404 :
                result.error.includes('FORBIDDEN') ? 403 : 500;

            return createErrorResponse(
                'SERVICE_ERROR',
                result.error,
                statusCode
            );
        }

        // Add security headers and return archived project
        const response = createSuccessResponse(result.data, {
            archived: true,
        });

        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
            response.headers.set(key, value);
        });

        return response;

    } catch (error) {
        console.error('DELETE /api/projects/[id] error:', error);
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
            'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
            ...SECURITY_HEADERS,
        },
    });
}