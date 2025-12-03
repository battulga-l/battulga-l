/**
 * Logger Utility
 * 
 * Production-ready logging system
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Format log message
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';

    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Debug level (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Info level
   */
  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  /**
   * Warning level
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  /**
   * Error level
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: {
        name: error?.name,
        message: error?.message,
        stack: this.isDevelopment ? error?.stack : undefined,
      },
    };

    console.error(this.formatMessage('error', message, errorContext));

    // Production-д external logging service руу илгээх
    if (this.isProduction) {
      this.sendToExternalService('error', message, errorContext);
    }
  }

  /**
   * Send logs to external service (Sentry, Datadog, etc.)
   */
  private sendToExternalService(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    // TODO: Implement external logging service integration
    // Example: Sentry.captureMessage(message, { level, extra: context });
  }

  /**
   * HTTP request logger
   */
  http(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    userId?: string
  ): void {
    const message = `${method} ${path} ${statusCode} - ${duration}ms`;
    const context = { method, path, statusCode, duration, userId };

    if (statusCode >= 500) {
      this.error(message, undefined, context);
    } else if (statusCode >= 400) {
      this.warn(message, context);
    } else {
      this.info(message, context);
    }
  }

  /**
   * Database query logger
   */
  query(query: string, duration: number, params?: any): void {
    if (this.isDevelopment) {
      this.debug(`Database query (${duration}ms)`, { query, params });
    }
  }

  /**
   * Authentication logger
   */
  auth(action: string, userId?: string, success: boolean = true): void {
    const message = `Auth: ${action} - ${success ? 'Success' : 'Failed'}`;
    const context = { action, userId, success };

    if (!success) {
      this.warn(message, context);
    } else {
      this.info(message, context);
    }
  }
}

// Singleton instance
export const logger = new Logger();

/**
 * Performance monitoring decorator
 */
export function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;
      logger.debug(`${propertyKey} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`${propertyKey} failed after ${duration}ms`, error as Error);
      throw error;
    }
  };

  return descriptor;
}
