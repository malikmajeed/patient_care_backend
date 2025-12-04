const express = require("express");
const router = express.Router();

const nurseSkillController = require("../controllers/nurse_skill.controller");

/**
 * @swagger
 * tags:
 *   name: Nurse Skill
 *   description: Nurse skill management
 */

/**
 * @swagger
 * /nurse-skill:
 *   post:
 *     summary: Create a new nurse skill
 *     tags: [Nurse Skill]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nurse_ID
 *               - category_ID
 *             properties:
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               category_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       201:
 *         description: Nurse skill created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", nurseSkillController.create);

/**
 * @swagger
 * /nurse-skill:
 *   get:
 *     summary: Get all nurse skills
 *     tags: [Nurse Skill]
 *     responses:
 *       200:
 *         description: List of all nurse skills
 *       500:
 *         description: Server error
 */
router.get("/", nurseSkillController.getAll);

/**
 * @swagger
 * /nurse-skill/{nurseId}/{categoryId}:
 *   get:
 *     summary: Get nurse skill by composite ID
 *     tags: [Nurse Skill]
 *     parameters:
 *       - in: path
 *         name: nurseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Nurse skill details
 *       404:
 *         description: Nurse skill not found
 *       500:
 *         description: Server error
 */
router.get("/:nurseId/:categoryId", nurseSkillController.getById);

/**
 * @swagger
 * /nurse-skill/{nurseId}/{categoryId}:
 *   patch:
 *     summary: Update nurse skill details
 *     tags: [Nurse Skill]
 *     parameters:
 *       - in: path
 *         name: nurseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               category_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Nurse skill updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Nurse skill not found
 *       500:
 *         description: Server error
 */
router.patch("/:nurseId/:categoryId", nurseSkillController.update);

/**
 * @swagger
 * /nurse-skill/{nurseId}/{categoryId}:
 *   delete:
 *     summary: Delete nurse skill
 *     tags: [Nurse Skill]
 *     parameters:
 *       - in: path
 *         name: nurseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Nurse skill deleted successfully
 *       404:
 *         description: Nurse skill not found
 *       500:
 *         description: Server error
 */
router.delete("/:nurseId/:categoryId", nurseSkillController.remove);

module.exports = router;


