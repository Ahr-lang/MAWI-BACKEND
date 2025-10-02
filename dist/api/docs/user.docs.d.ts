/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación multi-tenant
 */
/**
 * @swagger
 * /{tenant}/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [a, b, c, d]
 *         description: Identificador del tenant (base de datos)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       409:
 *         description: El nombre de usuario ya existe.
 */
/**
 * @swagger
 * /{tenant}/users/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [a, b, c, d]
 *         description: Identificador del tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso (token devuelto)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 */
/**
 * @swagger
 * /{tenant}/users/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [a, b, c, d]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario autenticado.
 *       401:
 *         description: Token inválido o ausente.
 */
/**
 * @swagger
 * /{tenant}/users/logout:
 *   post:
 *     summary: Cerrar sesión (stateless)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [a, b, c, d]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensaje de cierre de sesión
 */
//# sourceMappingURL=user.docs.d.ts.map