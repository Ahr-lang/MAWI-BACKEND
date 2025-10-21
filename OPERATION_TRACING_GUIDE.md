# Operation Tracing Guide

This guide explains how to use the comprehensive operation tracing system for full process traceability in the MAWI Backend.

## Overview

The operation tracing system provides detailed metrics and tracing for every process in your application, enabling you to:

- Track performance bottlenecks at the operation level
- Monitor error rates by specific operations
- Understand user behavior patterns
- Debug issues with full context
- Optimize system performance

## Key Metrics Added

### Database Operations
- `db_query_duration_seconds` - Query execution times
- `db_transaction_duration_seconds` - Transaction durations
- `db_connection_pool_size/used` - Connection pool monitoring

### Business Logic
- `business_logic_duration_seconds` - Business operation times
- `auth_operation_duration_seconds` - Authentication operations
- `file_operation_duration_seconds` - File processing times

### API & External Services
- `api_endpoint_duration_seconds` - API endpoint performance
- `external_service_duration_seconds` - External API calls
- `middleware_duration_seconds` - Middleware performance

### System Health
- `operation_errors_total` - Error counts by operation
- `process_health_status` - Process health indicators
- `cache_operation_duration_seconds` - Cache performance

## Usage Patterns

### 1. Manual Operation Tracing

```typescript
import { OperationTracer } from '../telemetry/operation-tracer';

export async function processUserRegistration(userData: any, tenant: string) {
  const tracer = new OperationTracer('user_registration', {
    tenant,
    user_email: userData.email
  });

  try {
    // Record database transaction
    const dbTimer = tracer.recordDbTransaction(tenant, 'insert', userData.id);
    await saveUserToDatabase(userData);
    dbTimer.end();

    // Record external service call
    const emailTimer = tracer.recordExternalService('email', 'POST', '/welcome');
    await sendWelcomeEmail(userData.email);
    emailTimer.end(200);

    tracer.setProcessHealth('registration', true);

  } catch (error: any) {
    tracer.recordError(error.name, tenant, userData.id);
    tracer.setProcessHealth('registration', false);
    throw error;
  } finally {
    tracer.end();
  }
}
```

### 2. Wrapper Function Pattern

```typescript
import { instrumentOperation } from '../telemetry/operation-tracer';

export async function submitForm(formData: any, tenant: string, userId: string) {
  return instrumentOperation(
    'form_submission',
    { tenant, user_id: userId, form_type: formData.type },
    async (tracer) => {
      // Record file upload
      const fileTimer = tracer.recordFileOperation('pdf', 'large', userId);
      await processFiles(formData.files);
      fileTimer.end();

      // Record database save
      const dbTimer = tracer.recordDbQuery('formulario1', 'insert', tenant, userId);
      const formId = await saveForm(formData);
      dbTimer.end();

      return { formId, success: true };
    }
  );
}
```

### 3. Method Decorator Pattern

```typescript
import { instrumentMethod } from '../telemetry/operation-tracer';

export class AuthService {
  @instrumentMethod('user_login', { module: 'authentication' })
  async loginUser(email: string, password: string, tenant: string) {
    // This method is automatically instrumented
    const tracer = new OperationTracer('user_login', { tenant });

    const authTimer = tracer.recordAuthOperation('password');
    const user = await validateCredentials(email, password);
    authTimer.end(true);

    tracer.end();
    return user;
  }

  @instrumentMethod('password_reset', { module: 'security' })
  async resetPassword(email: string, tenant: string) {
    // Automatically instrumented with error handling
    await sendPasswordResetEmail(email);
    return { success: true };
  }
}
```

### 4. API Endpoint Instrumentation

```typescript
import { instrumentApiEndpoint } from '../telemetry/tracing-examples';

// In your route definition
app.get('/api/:tenant/users',
  instrumentApiEndpoint,  // Add this middleware first
  authenticateUser,
  async (req, res) => {
    const tracer = new OperationTracer('get_users_list', {
      tenant: req.tenant,
      user_id: req.user.id
    });

    const dbTimer = tracer.recordDbQuery('users', 'select', req.tenant);
    const users = await getUsers(req.tenant);
    dbTimer.end();

    tracer.end();
    res.json({ users });
  }
);
```

### 5. Middleware Instrumentation

```typescript
import { instrumentMiddleware } from '../telemetry/tracing-examples';

// Apply to specific routes
app.use('/api/:tenant/forms',
  instrumentMiddleware('form_validation'),
  validateFormMiddleware,
  processForm
);
```

## Monitoring Queries

### Performance Analysis
```promql
# Slowest operations (95th percentile)
topk(10, histogram_quantile(0.95, rate(operation_duration_seconds[5m])) by (operation))

# Operations with highest error rates
rate(operation_errors_total[5m]) / rate(operation_duration_seconds_count[5m]) > 0.05
```

### Database Bottlenecks
```promql
# Slow database queries by table
histogram_quantile(0.95, rate(db_query_duration_seconds[5m])) by (table, operation)

# Connection pool utilization
db_connection_pool_used / db_connection_pool_size > 0.8
```

### Business Logic Performance
```promql
# Slow business operations
histogram_quantile(0.95, rate(business_logic_duration_seconds[5m])) by (module, operation)

# Authentication performance
rate(auth_operation_duration_seconds{quantile="0.95"}[5m])
```

### External Dependencies
```promql
# Slow external service calls
histogram_quantile(0.95, rate(external_service_duration_seconds[5m])) by (service, endpoint)

# External service error rates
rate(external_service_duration_seconds_count{status=~"5.."}[5m]) / rate(external_service_duration_seconds_count[5m])
```

## Best Practices

### 1. Consistent Operation Naming
```typescript
// Good: descriptive and hierarchical
'user_registration'
'form_validation'
'payment_processing'

// Avoid: too generic
'process'
'handle'
'execute'
```

### 2. Include Context Labels
```typescript
// Always include tenant and user context when available
const tracer = new OperationTracer('data_export', {
  tenant: req.tenant,
  user_id: req.user.id,
  export_type: 'csv',
  record_count: data.length
});
```

### 3. Error Handling
```typescript
try {
  // operation logic
} catch (error: any) {
  tracer.recordError(error.name || 'UnknownError', tenant, userId);
  throw error;
} finally {
  tracer.end();
}
```

### 4. Resource Cleanup
```typescript
// Always call tracer.end() in finally block
const tracer = new OperationTracer('file_processing');
try {
  // ... processing logic
} finally {
  tracer.end(); // Ensures span is closed
}
```

## Integration Points

### Express Middleware
Add operation tracing to your main Express app:

```typescript
import { instrumentApiEndpoint } from './telemetry/tracing-examples';

// Global API instrumentation
app.use('/api', instrumentApiEndpoint);

// Specific route instrumentation
app.get('/api/:tenant/users',
  instrumentMiddleware('auth_check'),
  getUsersHandler
);
```

### Database Operations
Instrument database operations in your repository classes:

```typescript
export class UserRepository {
  @instrumentMethod('user_find_by_email', { module: 'user_repository' })
  async findByEmail(email: string, tenant: string) {
    const tracer = new OperationTracer('db_user_lookup', { tenant });

    const queryTimer = tracer.recordDbQuery('users', 'select', tenant);
    const user = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    queryTimer.end();

    tracer.end();
    return user;
  }
}
```

### Service Layer
Instrument business logic in service classes:

```typescript
export class FormService {
  @instrumentMethod('form_processing', { module: 'form_service' })
  async processFormSubmission(formData: any, tenant: string, userId: string) {
    // Automatic instrumentation with error handling
    await this.validateForm(formData);
    await this.saveToDatabase(formData, tenant);
    await this.sendNotifications(formData, userId);

    return { success: true };
  }
}
```

This comprehensive tracing system gives you complete visibility into your application's performance and behavior, enabling data-driven optimization and debugging.