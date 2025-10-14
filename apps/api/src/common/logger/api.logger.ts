import { LoggerService } from '@nestjs/common';

export class ApiLogger implements LoggerService {
  private getFormattedMessage(message: any, context?: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${context ? `[${context}] ` : ''}${message}`;
  }

  private formatError(error: Error): string {
    return `${error.message}\n${error.stack}`;
  }

  log(message: any, context?: string): void {
    console.log(this.getFormattedMessage(message, context));
  }

  error(message: any, trace?: string, context?: string): void {
    console.error(this.getFormattedMessage(message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string): void {
    console.warn(this.getFormattedMessage(message, context));
  }

  debug(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.getFormattedMessage(message, context));
    }
  }

  verbose(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.getFormattedMessage(message, context));
    }
  }
}
