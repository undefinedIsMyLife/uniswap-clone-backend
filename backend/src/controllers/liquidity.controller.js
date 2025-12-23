const liquidityService = require("../services/liquidity.service");

async function addLiquidity(req, res) {
  try {
    const { userId, pairId, amount0, amount1 } = req.body;

    // Validate input
    if (!userId || !pairId || !amount0 || !amount1) {
      return res.status(400).json({
        error: "userId, pairId, amount0, amount1 are required"
      });
    }

    if (amount0 <= 0 || amount1 <= 0) {
      return res.status(400).json({ error: "Amounts must be positive" });
    }

    // Call service
    const result = await liquidityService.addLiquidity(
      userId, 
      pairId,
      amount0,
      amount1
    );

    if (result.error === "USER_NOT_FOUND") {
      return res.status(400).json({ error: "User does not exist" });
    }
    if (result.error === "PAIR_NOT_FOUND") {
      return res.status(400).json({ error: "Pair does not exist" });
    }

    res.json(result);

  } catch (error) {
    console.error("Error adding liquidity:", error);
    res.status(500).json({ error: "Failed to add liquidity" });
  }
}

async function getLiquidity(req, res) {
  try {
    const list = await liquidityService.getLiquidity();
    res.json(list);
  } catch (error) {
    console.error("Error fetching liquidity:", error);
    res.status(500).json({ error: "Failed to fetch liquidity" });
  }
}

module.exports = { addLiquidity, getLiquidity };
