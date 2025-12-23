const swapService = require("../services/swap.service");

async function swapTokens(req, res) {
  try {
    const { userId, pairId, tokenIn } = req.body;
    const amountIn = Number(req.body.amountIn);

    if (!userId || !pairId || !amountIn || tokenIn === undefined) {
      return res.status(400).json({
        error: "userId, pairId, amountIn, tokenIn required"
      });
    }

    const result = await swapService.executeSwap(
      userId,
      pairId,
      amountIn,
      tokenIn
    );

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);

  } catch (error) {
    console.error("Swap Error:", error);
    res.status(500).json({ error: "Swap failed" });
  }
}

module.exports = { swapTokens };
