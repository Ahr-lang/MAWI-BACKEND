/**
 * @swagger
 * tags:
 *   name: Formularios
 *   description: Endpoints para gestión de formularios
 */

/**
 * @swagger
 * /api/{tenant}/forms/{formKey}/submission:
 *   post:
 *     summary: Crear nueva entrada en formulario
 *     tags: [Formularios]
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
 *         description: Identificador del tenant
 *       - in: path
 *         name: formKey
 *         required: true
 *         schema:
 *           type: string
 *           enum: [1, 2, 3, 4, 5, 6, 7, formulario1, formulario2, formulario3, formulario4, formulario5, formulario6, formulario7]
 *         description: Identificador del formulario (1-7 para biomo/robo, formulario para agromo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Datos del formulario según el schema del tenant
 *     responses:
 *       201:
 *         description: Formulario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/{tenant}/forms/{formKey}:
 *   get:
 *     summary: Obtener formularios de un tipo específico del usuario
 *     tags: [Formularios]
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
 *         description: Identificador del tenant
 *       - in: path
 *         name: formKey
 *         required: true
 *         schema:
 *           type: string
 *           enum: [1, 2, 3, 4, 5, 6, 7, formulario1, formulario2, formulario3, formulario4, formulario5, formulario6, formulario7]
 *         description: Identificador del formulario
 *     responses:
 *       200:
 *         description: Lista de formularios obtenida exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/{tenant}/forms:
 *   get:
 *     summary: Obtener todos los formularios del usuario
 *     tags: [Formularios]
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
 *         description: Identificador del tenant
 *     responses:
 *       200:
 *         description: Todos los formularios del usuario obtenidos exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/{tenant}/forms/{formKey}/{formId}:
 *   get:
 *     summary: Obtener formulario específico por ID
 *     tags: [Formularios]
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
 *         description: Identificador del tenant
 *       - in: path
 *         name: formKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del formulario
 *       - in: path
 *         name: formId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del formulario
 *     responses:
 *       200:
 *         description: Formulario obtenido exitosamente
 *       404:
 *         description: Formulario no encontrado
 *       401:
 *         description: No autorizado
 */