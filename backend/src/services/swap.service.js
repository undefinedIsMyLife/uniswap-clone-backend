const prisma = require("./db.service");

// AMM Swap Logic (x * y = k)
async function executeSwap(userId, pairId, amountIn, tokenIn) {

  const pair = await prisma.pair.findUnique({
    where: { id: pairId }
  });

  if (!pair) return { error: "PAIR_NOT_FOUND" };

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return { error: "USER_NOT_FOUND" };

  let reserveIn, reserveOut, tokenOut;

  // tokenIn = 0 → swap token0 → token1
  if (tokenIn === 0) {
    reserveIn = pair.reserve0;
    reserveOut = pair.reserve1;
    tokenOut = 1;
  }
  // tokenIn = 1 → swap token1 → token0
  else if (tokenIn === 1) {
    reserveIn = pair.reserve1;
    reserveOut = pair.reserve0;
    tokenOut = 0;
  } else {
    return { error: "INVALID_TOKEN_DIRECTION" };
  }

  if (amountIn <= 0) return { error: "INVALID_AMOUNT" };

  // AMM formula: amountOut = (reserveOut * amountIn) / (reserveIn + amountIn)
  const amountOut = (reserveOut * amountIn) / (reserveIn + amountIn);

  if (amountOut <= 0) return { error: "SWAP_FAILED" };

  // Update reserves
  const updatedPair = await prisma.pair.update({
    where: { id: pairId },
    data: {
      reserve0:
        tokenIn === 0
          ? reserveIn + amountIn
          : reserveOut - amountOut,
      reserve1:
        tokenIn === 1
          ? reserveIn + amountIn
          : reserveOut - amountOut
    }
  });

  // Save swap history
  const swap = await prisma.swap.create({
    data: {
      userId,
      pairId,
      amountIn,
      amountOut,
      tokenIn,
      tokenOut
    }
  });

  return { swap, updatedPair };
}

module.exports = { executeSwap };
