const express = require("express");
const { createToken, getTokens } = require("../controllers/token.controller");

const router = express.Router();

/**
 * @swagger
 * /tokens:
 *   post:
 *     summary: Create a new token
 *     description: Registers a new ERC20-like token in the system.
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - address
 *               - decimals
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: USD
 *               address:
 *                 type: string
 *                 example: 0xUSD
 *               decimals:
 *                 type: number
 *                 example: 18
 *     responses:
 *       200:
 *         description: Token created successfully
 *       400:
 *         description: Invalid input
 */

// Add a token
router.post("/", createToken);

// Get all tokens

/**
 * @swagger
 * /tokens:
 *   get:
 *     summary: Get all tokens
 *     description: Returns all registered tokens in the system.
 *     tags:
 *       - Tokens
 *     responses:
 *       200:
 *         description: List of tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   symbol:
 *                     type: string
 *                   address:
 *                     type: string
 *                   decimals:
 *                     type: integer
 */

router.get("/", getTokens);


module.exports = router;