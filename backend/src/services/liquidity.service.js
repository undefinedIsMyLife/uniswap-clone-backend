const prisma = require("./db.service");

// Add liquidity
async function addLiquidity(userId, pairId, amount0, amount1) {

  // Validate pair
  const pair = await prisma.pair.findUnique({ where: { id: pairId } });
  if (!pair) return { error: "PAIR_NOT_FOUND" };

  // Validate user
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "USER_NOT_FOUND" };

  // Update pair reserves
  const updatedPair = await prisma.pair.update({
    where: { id: pairId },
    data: {
      reserve0: pair.reserve0 + amount0,
      reserve1: pair.reserve1 + amount1
    }
  });

  // Create liquidity record
  const liquidity = await prisma.liquidity.create({
    data: {
      userId,
      pairId,
      amount0,
      amount1
    }
  });

  return { pair: updatedPair, liquidity };
}

// Get all liquidity entries
async function getLiquidity() {
  return prisma.liquidity.findMany({
    include: {
      user: true,
      pair: true
    }
  });
}

module.exports = { addLiquidity, getLiquidity };
