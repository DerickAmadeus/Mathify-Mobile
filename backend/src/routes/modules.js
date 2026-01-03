const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all modules
 *     description: Retrieve a list of all available practice modules
 *     tags:
 *       - Modules
 *     responses:
 *       200:
 *         description: List of modules
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
 *                   description:
 *                     type: string
 *                   total_questions:
 *                     type: integer
 *                   duration_minutes:
 *                     type: integer
 *                   difficulty:
 *                     type: string
 *                   created_at:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', moduleController.getAllModules);

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get module by ID
 *     description: Retrieve a specific module by its ID
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module found
 *       404:
 *         description: Module not found
 */
router.get('/:id', moduleController.getModuleById);

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create a new module
 *     description: Add a new practice module to the database
 *     tags:
 *       - Modules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - total_questions
 *               - duration_minutes
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               total_questions:
 *                 type: integer
 *               duration_minutes:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', moduleController.createModule);

/**
 * @swagger
 * /api/modules/{id}/progress:
 *   get:
 *     summary: Get user's progress for a module
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progress data
 */
router.get('/:id/progress', moduleController.getModuleProgress);

/**
 * @swagger
 * /api/modules/{id}/progress:
 *   post:
 *     summary: Save/update user's progress for a module
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, paused, completed]
 *               remaining_seconds:
 *                 type: integer
 *               right_answer:
 *                 type: integer
 *               wrong_answer:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progress saved
 */
router.post('/:id/progress', moduleController.saveModuleProgress);

/**
 * @swagger
 * /api/modules/{id}/reset-progress:
 *   post:
 *     summary: Reset user progress for a module while keeping history
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progress reset successfully
 */
router.post('/:id/reset-progress', moduleController.resetModuleProgress);

/**
 * @swagger
 * /api/modules/{id}/progress:
 *   delete:
 *     summary: Delete user progress for a module (restart functionality)
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Progress deleted successfully
 */
router.delete('/:id/progress', moduleController.deleteModuleProgress);

module.exports = router;