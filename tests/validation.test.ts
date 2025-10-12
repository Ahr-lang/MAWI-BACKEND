// tests/validation.test.ts
import { validateRequest } from '../src/api/middlewares/validation';
import { Request, Response, NextFunction } from 'express';

describe('Middleware de Validación', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Configurar mocks antes de cada prueba
    mockReq = {
      method: 'POST',
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('debe pasar validación para solicitud de registro válida', () => {
    // Configurar ruta y cuerpo válido
    (mockReq as any).path = '/api/agromo/users/register';
    mockReq.body = {
      username: 'testuser',
      password: 'testpass123',
      user_email: 'test@example.com'
    };

    // Ejecutar validación
    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    // Verificar que next() fue llamado (validación exitosa)
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('debe retornar 422 con errores detallados para campos requeridos faltantes', () => {
    // Configurar ruta
    (mockReq as any).path = '/api/agromo/users/register';
    mockReq.body = {
      username: 'testuser'
      // Falta password y user_email
    };

    // Ejecutar validación
    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    // Verificar respuesta de error
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

  it('debe retornar 422 con errores detallados para formato de email inválido', () => {
    // Configurar ruta y email inválido
    (mockReq as any).path = '/api/agromo/users/register';
    mockReq.body = {
      username: 'testuser',
      password: 'testpass123',
      user_email: 'email-invalido'
    };

    // Ejecutar validación
    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    // Verificar respuesta de error
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.stringContaining('user_email')
      ])
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('debe retornar 422 con integridad_fallida para campos alterados (campos extra)', () => {
    // Configurar ruta y agregar campo extra
    (mockReq as any).path = '/api/agromo/users/register';
    mockReq.body = {
      username: 'testuser',
      password: 'testpass123',
      user_email: 'test@example.com',
      campoExtra: 'no permitido'
    };

    // Ejecutar validación
    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    // Verificar respuesta de fallo de integridad
    expect(mockRes.status).toHaveBeenCalledWith(422);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'integridad_fallida'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('debe pasar validación para solicitud de login válida', () => {
    // Configurar ruta de login
    (mockReq as any).path = '/api/agromo/users/login';
    mockReq.body = {
      user_email: 'test@example.com',
      password: 'testpass123'
    };

    // Ejecutar validación
    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    // Verificar que next() fue llamado
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('debe omitir validación para rutas sin esquema', () => {
    // Configurar ruta sin esquema definido
    (mockReq as any).path = '/api/agromo/users/me';
    mockReq.method = 'GET';

    // Ejecutar validación
    validateRequest(mockReq as Request, mockRes as Response, mockNext);

    // Verificar que next() fue llamado (sin validación)
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});