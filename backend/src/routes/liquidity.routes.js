const express = require("express");
const router = express.Router();
const { addLiquidity, getLiquidity, removeLiquidity } = require("../controllers/liquidity.controller");

router.post("/", addLiquidity);
router.get("/", getLiquidity);
router.post("/remove", removeLiquidity);

module.exports = router;
