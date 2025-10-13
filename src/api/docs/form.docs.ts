/**
 * @swagger
 * tags:
 *   name: Forms
 *   description: Form submission endpoints
 */

/**
 * @swagger
 * /api/{tenant}/forms/{formKey}/submission:
 *   post:
 *     summary: Submit a form
 *     tags: [Forms]
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
 *         description: Tenant identifier
 *       - in: path
 *         name: formKey
 *         required: true
 *         schema:
 *           type: string
 *         description: Form identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormSubmission'
 *     responses:
 *       201:
 *         description: Form submission created successfully
 *       400:
 *         description: Invalid submission data
 *       401:
 *         description: Unauthorized
 */