// src/telemetry/tracing-examples.ts
/**
 * Examples of how to use the OperationTracer for full process traceability
 *
 * This file shows different patterns for instrumenting operations with detailed metrics.
 */

import { OperationTracer, instrumentOperation, instrumentMethod } from './operation-tracer';

// Example 1: Manual operation tracing
export async function exampleManualTracing(userId: string, tenant: string) {
  const tracer = new OperationTracer('user_registration', { tenant, user_id: userId });

  try {
    // Record database transaction
    const dbTimer = tracer.recordDbTransaction(tenant, 'insert', userId);
    // ... database operations ...
    dbTimer.end();

    // Record business logic
    const logicTimer = tracer.recordBusinessLogic('user_validation', tenant, userId);
    // ... validation logic ...
    logicTimer.end();

    // Record external service call
    const serviceTimer = tracer.recordExternalService('email_service', 'POST', '/send-welcome');
    // ... API call ...
    serviceTimer.end(200); // Pass status code

    tracer.setProcessHealth('user_registration', true);

  } catch (error: any) {
    tracer.recordError(error.name, tenant, userId);
    tracer.setProcessHealth('user_registration', false);
    throw error;
  } finally {
    tracer.end();
  }
}

// Example 2: Using the wrapper function
export async function exampleWrapperFunction(formData: any, tenant: string) {
  return instrumentOperation(
    'form_submission',
    { tenant, form_type: formData.type },
    async (tracer) => {
      // Record file upload if present
      if (formData.files) {
        const fileTimer = tracer.recordFileOperation('pdf', 'large');
        // ... file processing ...
        fileTimer.end();
      }

      // Record database operations
      const dbTimer = tracer.recordDbQuery('formulario1', 'insert', tenant);
      // ... save form ...
      dbTimer.end();

      return { success: true };
    }
  );
}

// Example 3: Using decorators for class methods
export class UserService {
  @instrumentMethod('user_authentication', { module: 'auth' })
  async authenticateUser(email: string, password: string, tenant: string) {
    // This method is automatically instrumented
    const tracer = new OperationTracer('user_authentication', { tenant });

    const authTimer = tracer.recordAuthOperation('password');
    // ... authentication logic ...
    authTimer.end(true); // Success

    tracer.end();
    return { userId: '123', token: 'abc' };
  }

  @instrumentMethod('user_profile_update', { module: 'user_management' })
  async updateProfile(userId: string, profileData: any, tenant: string) {
    // This method is automatically instrumented
    const tracer = new OperationTracer('user_profile_update', { tenant, user_id: userId });

    const dbTimer = tracer.recordDbTransaction(tenant, 'update', userId);
    // ... update database ...
    dbTimer.end();

    tracer.end();
    return { success: true };
  }
}

// Example 4: API endpoint instrumentation
export function instrumentApiEndpoint(req: any, res: any, next: any) {
  const tracer = new OperationTracer(`api_${req.method}_${req.route?.path || req.path}`, {
    tenant: req.tenant,
    user_id: req.user?.id,
    method: req.method,
    endpoint: req.path
  });

  // Add response interceptor to record final status
  const originalSend = res.send;
  res.send = function(data: any) {
    const apiTimer = tracer.recordApiEndpoint(req.method, req.tenant, res.statusCode, req.user?.id?.toString());
    apiTimer.end();

    tracer.end();
    return originalSend.call(this, data);
  };

  next();
}

// Example 5: Middleware instrumentation
export function instrumentMiddleware(middlewareName: string) {
  return (req: any, res: any, next: any) => {
    const tracer = new OperationTracer(`middleware_${middlewareName}`, {
      tenant: req.tenant,
      route: req.route?.path || req.path
    });

    const timer = tracer.recordMiddleware(req.route?.path || req.path, req.tenant);

    res.on('finish', () => {
      timer.end();
      tracer.end();
    });

    next();
  };
}

// Example 6: Cache operation instrumentation
export async function getCachedData(key: string, tenant: string) {
  const tracer = new OperationTracer('cache_get', { tenant, key_pattern: key.split(':')[0] });

  const cacheTimer = tracer.recordCacheOperation('redis', key.split(':')[0]);

  try {
    // ... cache get operation ...
    const data = { /* cached data */ };

    cacheTimer.end();
    tracer.end();

    return data;
  } catch (error: any) {
    tracer.recordError('CacheError', tenant);
    throw error;
  }
}

// Example 7: Complex business process with multiple steps
export async function processFormSubmission(formData: any, tenant: string, userId: string) {
  return instrumentOperation(
    'complete_form_processing',
    { tenant, user_id: userId, form_type: formData.type },
    async (tracer) => {
      // Step 1: Validation
      const validationTimer = tracer.recordBusinessLogic('form_validation', tenant, userId);
      // ... validate form ...
      validationTimer.end();

      // Step 2: Database save
      const dbTimer = tracer.recordDbTransaction(tenant, 'insert', userId);
      // ... save to database ...
      dbTimer.end();

      // Step 3: File processing (if any)
      if (formData.attachments) {
        const fileTimer = tracer.recordFileOperation('pdf', 'medium', userId);
        // ... process files ...
        fileTimer.end();
      }

      // Step 4: Notification
      const emailTimer = tracer.recordExternalService('email_service', 'POST', '/send-notification');
      // ... send email ...
      emailTimer.end(200);

      // Step 5: Cache invalidation
      const cacheTimer = tracer.recordCacheOperation('redis', 'user_forms');
      // ... invalidate cache ...
      cacheTimer.end();

      tracer.setProcessHealth('form_processing', true);
      return { formId: '123', status: 'completed' };
    }
  );
}