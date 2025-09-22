import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let error = 'Bad Request';
    let message = 'An error occurred';
    let fields: Record<string, string> | undefined = undefined;

    // Handle class-validator errors
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exceptionObj = exceptionResponse as any;
      
      if (exceptionObj.error) {
        error = exceptionObj.error;
      }
      
      if (exceptionObj.message) {
        message = Array.isArray(exceptionObj.message) 
          ? exceptionObj.message[0] 
          : exceptionObj.message;
      }

      // Extract validation errors into fields object
      if (Array.isArray(exceptionObj.message) && exceptionObj.message.length > 0) {
        fields = {};
        for (const msg of exceptionObj.message) {
          const match = msg.match(/^([a-zA-Z0-9.]+) (.+)$/);
          if (match) {
            fields[match[1]] = match[2];
          }
        }
      }
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    // Build the standardized error response
    const errorResponse: any = {
      error,
      message,
      statusCode: status,
    };

    if (fields && Object.keys(fields).length > 0) {
      errorResponse.fields = fields;
    }

    response.status(status).json(errorResponse);
  }
}
