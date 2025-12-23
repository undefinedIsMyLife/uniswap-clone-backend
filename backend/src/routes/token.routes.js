const express = require("express");
const { createToken, getTokens } = require("../controllers/token.controller");

const router = express.Router();


// Add a token
router.post("/", createToken);

// Get all tokens
router.get("/", getTokens);


module.exports = router;