const express = require("express");
const router = express.Router();
const { addLiquidity, getLiquidity, removeLiquidity } = require("../controllers/liquidity.controller");


/**
 * @swagger
 * /liquidity:
 *   post:
 *     summary: Add liquidity to a pair
 *     description: |
 *       Adds liquidity to an AMM pair.
 *       If the pool already has liquidity, the token ratio must match the existing reserves.
 *     tags:
 *       - Liquidity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - pairId
 *               - amount0
 *               - amount1
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               pairId:
 *                 type: integer
 *                 example: 11
 *               amount0:
 *                 type: string
 *                 example: "100"
 *               amount1:
 *                 type: string
 *                 example: "100"
 *     responses:
 *       200:
 *         description: Liquidity added successfully
 *       400:
 *         description: Invalid input, user/pair not found, or invalid liquidity ratio
 */

router.post("/", addLiquidity);
router.get("/", getLiquidity);

/**
 * @swagger
 * /liquidity/remove:
 *   post:
 *     summary: Remove liquidity from a pair
 *     description: |
 *       Removes liquidity previously added by a user.
 *       The user receives their proportional share of the pool reserves.
 *     tags:
 *       - Liquidity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - liquidityId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               liquidityId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Liquidity removed successfully
 *       400:
 *         description: Liquidity not found, unauthorized, or pair not found
 */

router.post("/remove", removeLiquidity);

module.exports = router;
