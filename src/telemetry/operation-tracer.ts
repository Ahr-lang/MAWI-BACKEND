// src/telemetry/operation-tracer.ts
import { trace, Span, SpanStatusCode, Tracer } from '@opentelemetry/api';
import {
  dbQueryDuration,
  dbTransactionDuration,
  businessLogicDuration,
  authOperationDuration,
  fileOperationDuration,
  apiEndpointDuration,
  cacheOperationDuration,
  middlewareDuration,
  externalServiceDuration,
  operationErrors,
  processHealth
} from './metrics';

const tracer = trace.getTracer('mawi-backend-operations', '1.0.0');

/**
 * Instrumented operation wrapper for full traceability
 */
export class OperationTracer {
  private span: Span;
  private startTime: number;
  private operation: string;
  private labels: Record<string, string | number> = {};

  constructor(operation: string, initialLabels: Record<string, string | number> = {}) {
    this.operation = operation;
    this.labels = { ...initialLabels };
    this.startTime = Date.now();

    this.span = tracer.startSpan(`operation.${operation}`, {
      attributes: {
        'operation.name': operation,
        'operation.start_time': this.startTime,
        ...this.labels
      }
    });
  }

  /**
   * Add labels to the operation
   */
  addLabels(labels: Record<string, string | number>) {
    this.labels = { ...this.labels, ...labels };
    Object.entries(labels).forEach(([key, value]) => {
      this.span.setAttribute(`operation.${key}`, value);
    });
  }

  /**
   * Record a database query operation
   */
  recordDbQuery(table: string, queryType: string, tenant: string, userId?: string) {
    const labels = {
      operation: this.operation,
      table,
      tenant,
      query_type: queryType,
      ...(userId && { user_id: userId })
    };

    return this.createTimer((duration) => {
      dbQueryDuration.observe(labels, duration);
    });
  }

  /**
   * Record a database transaction
   */
  recordDbTransaction(tenant: string, transactionType: string, userId?: string) {
    const labels = {
      tenant,
      operation: this.operation,
      transaction_type: transactionType,
      ...(userId && { user_id: userId })
    };

    return this.createTimer((duration) => {
      dbTransactionDuration.observe(labels, duration);
    });
  }

  /**
   * Record business logic operation
   */
  recordBusinessLogic(module: string, tenant: string, userId?: string) {
    const labels = {
      operation: this.operation,
      module,
      tenant,
      ...(userId && { user_id: userId })
    };

    return this.createTimer((duration) => {
      businessLogicDuration.observe(labels, duration);
    });
  }

  /**
   * Record authentication operation
   */
  recordAuthOperation(method: string) {
    const labels = {
      operation: this.operation,
      method
    };

    return this.createTimer((duration, success = true) => {
      authOperationDuration.observe({ ...labels, success }, duration);
    });
  }

  /**
   * Record file operation
   */
  recordFileOperation(fileType: string, sizeRange: string, userId?: string) {
    const labels = {
      operation: this.operation,
      file_type: fileType,
      size_range: sizeRange,
      ...(userId && { user_id: userId })
    };

    return this.createTimer((duration) => {
      fileOperationDuration.observe(labels, duration);
    });
  }

  /**
   * Record API endpoint operation
   */
  recordApiEndpoint(method: string, tenant: string, statusCode: number, userId?: string) {
    const labels = {
      endpoint: this.operation,
      method,
      tenant,
      status_code: statusCode,
      ...(userId && { user_id: userId })
    };

    return this.createTimer((duration) => {
      apiEndpointDuration.observe(labels, duration);
    });
  }

  /**
   * Record cache operation
   */
  recordCacheOperation(cacheType: string, keyPattern: string) {
    const labels = {
      operation: this.operation,
      cache_type: cacheType,
      key_pattern: keyPattern
    };

    return this.createTimer((duration) => {
      cacheOperationDuration.observe(labels, duration);
    });
  }

  /**
   * Record middleware operation
   */
  recordMiddleware(route: string, tenant: string) {
    const labels = {
      middleware: this.operation,
      route,
      tenant
    };

    return this.createTimer((duration) => {
      middlewareDuration.observe(labels, duration);
    });
  }

  /**
   * Record external service call
   */
  recordExternalService(service: string, method: string, endpoint: string) {
    const labels = {
      service,
      method,
      operation: this.operation,
      endpoint
    };

    return this.createTimer((duration, status = 200) => {
      externalServiceDuration.observe({ ...labels, status }, duration);
    });
  }

  /**
   * Record an error for this operation
   */
  recordError(errorType: string, tenant: string, userId?: string) {
    operationErrors.inc({
      operation: this.operation,
      error_type: errorType,
      tenant,
      ...(userId && { user_id: userId })
    });

    this.span.recordException(new Error(`${errorType} in ${this.operation}`));
    this.span.setStatus({ code: SpanStatusCode.ERROR, message: errorType });
  }

  /**
   * Set process health status
   */
  setProcessHealth(component: string, healthy: boolean) {
    processHealth.set({
      process: this.operation,
      component
    }, healthy ? 1 : 0);
  }

  /**
   * End the operation and span
   */
  end() {
    const duration = (Date.now() - this.startTime) / 1000;
    this.span.setAttribute('operation.duration_seconds', duration);
    this.span.end();
  }

  /**
   * Create a timer function for recording durations
   */
  private createTimer(callback: (duration: number, ...args: any[]) => void) {
    const start = process.hrtime.bigint();

    return {
      end: (...args: any[]) => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1e9; // Convert to seconds
        callback(duration, ...args);
      }
    };
  }
}

/**
 * Quick operation wrapper for simple instrumentation
 */
export function instrumentOperation<T>(
  operation: string,
  labels: Record<string, string | number>,
  fn: (tracer: OperationTracer) => Promise<T>
): Promise<T> {
  const tracer = new OperationTracer(operation, labels);

  return fn(tracer)
    .finally(() => {
      tracer.end();
    });
}

/**
 * Decorator for instrumenting class methods
 */
export function instrumentMethod(
  operation: string,
  additionalLabels: Record<string, string | number> = {}
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const tracer = new OperationTracer(operation, {
        class: target.constructor.name,
        method: propertyKey,
        ...additionalLabels
      });

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error: any) {
        tracer.recordError(error?.name || 'UnknownError', additionalLabels.tenant as string || 'unknown');
        throw error;
      } finally {
        tracer.end();
      }
    };

    return descriptor;
  };
}