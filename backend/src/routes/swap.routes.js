const express = require("express");
const router = express.Router();
const { swapTokens } = require("../controllers/swap.controller");

router.post("/", swapTokens);

module.exports = router;
