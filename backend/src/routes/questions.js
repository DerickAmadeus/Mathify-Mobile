const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get questions by module ID
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: module_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID to get questions for
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   formula:
 *                     type: string
 *                   instruction:
 *                     type: string
 *                   correct_answer:
 *                     type: string
 *       400:
 *         description: module_id required
 *       500:
 *         description: Server error
 */
router.get('/', questionController.getQuestionsByModule);

module.exports = router;