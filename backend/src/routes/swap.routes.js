const express = require("express");
const router = express.Router();
const { swapTokens } = require("../controllers/swap.controller");

/**
 * @swagger
 * /swap:
 *   post:
 *     summary: Swap tokens in a pair
 *     description: |
 *       Executes a token swap using the constant product AMM formula.
 *       Price impact and reserves are updated atomically.
 *     tags:
 *       - Swap
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - pairId
 *               - tokenInId
 *               - amountIn
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               pairId:
 *                 type: integer
 *                 example: 1
 *               tokenInId:
 *                 type: integer
 *                 example: 1
 *               amountIn:
 *                 type: string
 *                 example: "10"
 *     responses:
 *       200:
 *         description: Swap executed successfully
 *       400:
 *         description: Invalid input, insufficient liquidity, or invalid token direction
 */
router.post("/", swapTokens);

module.exports = router;
