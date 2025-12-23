const express = require("express");
const router = express.Router();
const { addLiquidity, getLiquidity } = require("../controllers/liquidity.controller");

router.post("/", addLiquidity);
router.get("/", getLiquidity);

module.exports = router;
