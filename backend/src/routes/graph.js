// src/routes/graph.js
/**
 * @swagger
 * components:
 *   schemas:
 *     GraphHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Graph history entry ID
 *         user_id:
 *           type: string
 *           description: User ID
 *         function_expression:
 *           type: string
 *           description: Mathematical function expression
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */
const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

/**
 * @swagger
 * /api/graph/history:
 *   get:
 *     summary: Get graph history for a user
 *     tags: [Graph]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Graph history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GraphHistory'
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.get('/history', graphController.getHistory);

/**
 * @swagger
 * /api/graph/history:
 *   post:
 *     summary: Save graph function to history
 *     tags: [Graph]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - function_expression
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID
 *               function_expression:
 *                 type: string
 *                 description: Mathematical function expression
 *     responses:
 *       200:
 *         description: Graph history saved successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/history', graphController.saveHistory);

/**
 * @swagger
 * /api/graph/history:
 *   delete:
 *     summary: Delete graph history for a user
 *     tags: [Graph]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Graph history cleared successfully
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.delete('/history', graphController.deleteHistory);

module.exports = router;