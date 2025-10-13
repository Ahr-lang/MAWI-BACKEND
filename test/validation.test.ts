// test/validation.test.ts
import { validateRequest } from '../src/api/middlewares/validation';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      path: '/api/agromo/users/register',
      method: 'POST',
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should pass validation for valid register request', () => {
    mockReq.body = {
      username: 'testuser',
      password: 'testpass123',
      user_email: 'test@example.com'
    };

    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 422 with detailed errors for missing required fields', () => {
    mockReq.body = {
      username: 'testuser'
      // missing password and user_email
    };

    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.stringContaining('password'),
        expect.stringContaining('user_email')
      ])
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 422 with detailed errors for invalid email format', () => {
    mockReq.body = {
      username: 'testuser',
      password: 'testpass123',
      user_email: 'invalid-email'
    };

    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.stringContaining('user_email')
      ])
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 422 with integridad_fallida for altered fields (extra fields)', () => {
    mockReq.body = {
      username: 'testuser',
      password: 'testpass123',
      user_email: 'test@example.com',
      extraField: 'not allowed'
    };

    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'integridad_fallida'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should pass validation for valid login request', () => {
    mockReq.path = '/api/agromo/users/login';
    mockReq.body = {
      user_email: 'test@example.com',
      password: 'testpass123'
    };

    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should skip validation for routes without schema', () => {
    mockReq.path = '/api/agromo/users/me';
    mockReq.method = 'GET';

    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});