/**
 * API Error Handler Middleware
 * 
 * Production-ready error handling
 */

import { NextResponse } from 'next/server';
import { AppError, ERROR_MESSAGES } from '@edu-sphere/config';

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
  path?: string;
}

/**
 * Handle API errors
 */
export function handleApiError(
  error: Error | AppError,
  path?: string
): NextResponse<ErrorResponse> {
  // Log error server-side
  console.error('[API Error]', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path,
    timestamp: new Date().toISOString(),
  });

  // AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        timestamp: new Date().toISOString(),
        path,
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: ERROR_MESSAGES.INTERNAL_ERROR,
          details:
            process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        timestamp: new Date().toISOString(),
        path,
      },
      { status: 500 }
    );
  }

  // Zod validation errors
  if (error.name === 'ZodError') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: ERROR_MESSAGES.VALIDATION_ERROR,
          details: (error as any).errors,
        },
        timestamp: new Date().toISOString(),
        path,
      },
      { status: 400 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: ERROR_MESSAGES.INTERNAL_ERROR,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      timestamp: new Date().toISOString(),
      path,
    },
    { status: 500 }
  );
}

/**
 * Try-catch wrapper for API routes
 */
export function withErrorHandler<T>(
  handler: (...args: any[]) => Promise<T>
) {
  return async (...args: any[]): Promise<T | NextResponse<ErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(
        error as Error,
        args[0]?.nextUrl?.pathname
      );
    }
  };
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}
