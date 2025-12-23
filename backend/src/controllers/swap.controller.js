const swapService = require("../services/swap.service");

async function swapTokens(req, res) {
  try {
    const { userId, pairId, amountIn, tokenIn } = req.body;

    if (
      userId === undefined ||
      pairId === undefined ||
      amountIn === undefined ||
      tokenIn === undefined
    ){
      return res.status(400).json({
        error: "userId, pairId, amountIn, tokenIn required"
      });
    }
    if (Number(amountIn) <= 0) {
      return res.status(400).json({ error: "INVALID_AMOUNT" });
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

    res.status(200).json(result);

  } catch (error) {
    console.error("Swap Error:", error);
    res.status(500).json({ error: "Swap failed" });
  }
}

module.exports = { swapTokens };
