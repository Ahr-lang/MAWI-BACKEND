/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Endpoints para consultar métricas del sistema desde Prometheus
 */

/**
 * @swagger
 * /api/{tenant}/admin/metrics/online-users:
 *   get:
 *     summary: Obtener usuarios en línea por tenant
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *       - Tenant API Key: []
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *         description: Tenant del usuario (debe ser 'back' para acceso administrativo)
 *     responses:
 *       200:
 *         description: Lista de usuarios en línea por tenant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tenant:
 *                         type: string
 *                         example: "agromo"
 *                       onlineUsers:
 *                         type: number
 *                         example: 5
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-19T18:20:31.111Z"
 *       401:
 *         description: No autorizado - token JWT requerido
 *       403:
 *         description: Acceso denegado - solo usuarios del tenant backend
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/{tenant}/admin/metrics/online-users/total:
 *   get:
 *     summary: Obtener total de usuarios en línea en todos los tenants
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *       - Tenant API Key: []
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *         description: Tenant del usuario (debe ser 'back' para acceso administrativo)
 *     responses:
 *       200:
 *         description: Total de usuarios en línea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOnlineUsers:
 *                       type: number
 *                       example: 15
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-19T18:20:31.111Z"
 *       401:
 *         description: No autorizado - token JWT requerido
 *       403:
 *         description: Acceso denegado - solo usuarios del tenant backend
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/{tenant}/admin/metrics/forms:
 *   get:
 *     summary: Obtener conteo de formularios por tenant y tipo de formulario
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *       - Tenant API Key: []
 *     parameters:
 *       - in: path
 *         name: tenant
 *         required: true
 *         schema:
 *           type: string
 *           enum: [agromo, biomo, robo, back]
 *         description: Tenant del usuario (debe ser 'back' para acceso administrativo)
 *     responses:
 *       200:
 *         description: Conteo de formularios por tenant y tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tenant:
 *                         type: string
 *                         example: "agromo"
 *                       form_type:
 *                         type: string
 *                         example: "form_1"
 *                       count:
 *                         type: number
 *                         example: 25
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-10-19T18:20:31.111Z"
 *       401:
 *         description: No autorizado - token JWT requerido
 *       403:
 *         description: Acceso denegado - solo usuarios del tenant backend
 *       500:
 *         description: Error interno del servidor
 */