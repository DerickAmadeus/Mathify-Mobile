// src/routes/calculator.js
/**
 * @swagger
 * components:
 *   schemas:
 *     CalculationHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: History entry ID
 *         user_id:
 *           type: string
 *           description: User ID
 *         expression:
 *           type: string
 *           description: Mathematical expression
 *         result:
 *           type: number
 *           description: Calculation result
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */
const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

/**
 * @swagger
 * /api/calculator:
 *   get:
 *     summary: Get calculator API status
 *     tags: [Calculator]
 *     responses:
 *       200:
 *         description: API status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', calculatorController.getStatus);

/**
 * @swagger
 * /api/calculator/history:
 *   get:
 *     summary: Get calculation history for a user
 *     tags: [Calculator]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Calculation history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CalculationHistory'
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.get('/history', calculatorController.getHistory);

/**
 * @swagger
 * /api/calculator/history:
 *   delete:
 *     summary: Delete calculation history for a user
 *     tags: [Calculator]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: History cleared successfully
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.delete('/history', calculatorController.deleteHistory);

/**
 * @swagger
 * /api/calculator/history:
 *   post:
 *     summary: Save calculation to history
 *     tags: [Calculator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - expression
 *               - result
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID
 *               expression:
 *                 type: string
 *                 description: Mathematical expression
 *               result:
 *                 type: number
 *                 description: Calculation result
 *     responses:
 *       200:
 *         description: History saved successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/history', calculatorController.saveHistory);

module.exports = router;