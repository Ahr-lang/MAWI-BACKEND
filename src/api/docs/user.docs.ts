/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación multi-tenant
 */

/**
 * @swagger
 * /api/{tenant}/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     security:
 *       - Tenant API Key: []
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *         description: Identificador del tenant (base de datos)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCredentials'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       409:
 *         description: El nombre de usuario ya existe.
 */

/**
 * @swagger
 * /api/{tenant}/users/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     security:
 *       - Tenant API Key: []
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *         description: Identificador del tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
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
 * /api/{tenant}/users/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *     security:
 *       - bearerAuth: []
 *       - Tenant API Key: []
 *     responses:
 *       200:
 *         description: Información del usuario autenticado.
 *       401:
 *         description: Token inválido o ausente.
 */

/**
 * @swagger
 * /api/{tenant}/users/logout:
 *   post:
 *     summary: Cerrar sesión (stateless)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *     security:
 *       - bearerAuth: []
 *       - Tenant API Key: []
 *     responses:
 *       200:
 *         description: Mensaje de cierre de sesión 
 */

/**
 * @swagger
 * /api/{tenant}/users:
 *   get:
 *     summary: Obtener lista de todos los usuarios del tenant
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *         description: Identificador del tenant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: "enrique"
 *                 tenant:
 *                   type: string
 *                   example: "agromo"
 *                 count:
 *                   type: number
 *                   example: 5
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error del servidor
 */
