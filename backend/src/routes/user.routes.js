const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/user.controller");

router.post("/", createUser);  // create user


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users (wallet identities) in the system.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 */

router.get("/", getUsers);     // list users

module.exports = router;
