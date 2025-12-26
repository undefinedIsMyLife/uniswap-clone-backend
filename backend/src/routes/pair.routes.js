const express = require("express");
const {createPair , getPairs }= require("../controllers/pair.controller");


const router = express.Router();

/**
 * @swagger
 * /pairs:
 *   post:
 *     summary: Create a new token pair
 *     description: Creates a trading pair between two tokens. Token order is enforced to prevent duplicates.
 *     tags:
 *       - Pairs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token0Id
 *               - token1Id
 *             properties:
 *               token0Id:
 *                 type: integer
 *                 example: 1
 *               token1Id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Pair created successfully
 *       400:
 *         description: Invalid input or pair already exists
 */

//Add a pair
router.post("/", createPair);


//Get all pairs

/**
 * @swagger
 * /pairs:
 *   get:
 *     summary: Get all trading pairs
 *     description: Returns all token pairs with current reserves.
 *     tags:
 *       - Pairs
 *     responses:
 *       200:
 *         description: List of pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   token0Id:
 *                     type: integer
 *                   token1Id:
 *                     type: integer
 *                   reserve0:
 *                     type: string
 *                   reserve1:
 *                     type: string
 */

router.get("/", getPairs);

module.exports = router;