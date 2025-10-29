import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApiLogger } from '../logger/api.logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new ApiLogger();

  private handlePrismaError(error: PrismaClientKnownRequestError): {
    status: number;
    message: string;
    code: string;
  } {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return {
          status: HttpStatus.CONFLICT,
          message: 'A record with this value already exists',
          code: 'UNIQUE_VIOLATION',
        };
      case 'P2025': // Record not found
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          code: 'RECORD_NOT_FOUND',
        };
      case 'P2014': // Invalid ID
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID provided',
          code: 'INVALID_ID',
        };
      case 'P2003': // Foreign key constraint violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Related record not found',
          code: 'FOREIGN_KEY_VIOLATION',
        };
      case 'P2021': // Table does not exist
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database schema error',
          code: 'SCHEMA_ERROR',
        };
      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Database operation failed',
          code: 'DATABASE_ERROR',
        };
    }
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details = undefined;

    // Handle known HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as any;
      
      // Handle class-validator errors
      if (Array.isArray(errorResponse.message)) {
        message = 'Validation failed';
        code = 'VALIDATION_ERROR';
        details = errorResponse.message;
      } else {
        message = errorResponse.message || exception.message;
        code = errorResponse.code || errorResponse.error || exception.name;
      }
    }
    // Handle Prisma errors
    else if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      message = prismaError.message;
      code = prismaError.code;
      details = {
        code: exception.code,
        meta: exception.meta,
      };
    }
    // Handle unknown errors
    else if (exception instanceof Error) {
      message = exception.message;
      details = process.env.NODE_ENV !== 'production' ? exception.stack : undefined;
    }

    // Log the error with context
    const errorLog = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      code,
      message,
      details,
      body: request.body,
      params: request.params,
      query: request.query,
    };

    if (status >= 500) {
      this.logger.error('Server error occurred', JSON.stringify(errorLog, null, 2));
    } else {
      this.logger.warn('Client error occurred', JSON.stringify(errorLog, null, 2));
    }

    // Return standardized error response
    const errorResponse = {
      statusCode: status,
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(details && process.env.NODE_ENV !== 'production' && { details }),
    };

    response.status(status).json(errorResponse);
  }
}