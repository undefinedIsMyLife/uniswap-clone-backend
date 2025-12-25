const prisma = require("./db.service");
const { Decimal } = require("@prisma/client/runtime/library");

// Add liquidity (AMM-correct)
async function addLiquidity(userId, pairId, amount0, amount1) {
  const pair = await prisma.pair.findUnique({ where: { id: pairId } });
  if (!pair) return { error: "PAIR_NOT_FOUND" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "USER_NOT_FOUND" };

  const reserve0 = new Decimal(pair.reserve0);
  const reserve1 = new Decimal(pair.reserve1);

  const amount0Dec = new Decimal(amount0);
  const amount1Dec = new Decimal(amount1);

  // 🔒 RATIO CHECK (only if pool already has liquidity)
  if (reserve0.gt(0) && reserve1.gt(0)) {
    const currentRatio = reserve0.div(reserve1);
    const incomingRatio = amount0Dec.div(amount1Dec);

    if (!currentRatio.eq(incomingRatio)) {
      return { error: "INVALID_LIQUIDITY_RATIO" };
    }
  }

  const updatedPair = await prisma.pair.update({
    where: { id: pairId },
    data: {
      reserve0: reserve0.add(amount0Dec),
      reserve1: reserve1.add(amount1Dec)
    }
  });

  const liquidity = await prisma.liquidity.create({
    data: {
      userId,
      pairId,
      amount0: amount0Dec,
      amount1: amount1Dec
    }
  });

  return { pair: updatedPair, liquidity };
}


// Get all liquidity
async function getLiquidity() {
  return prisma.liquidity.findMany({
    include: {
      user: true,
      pair: true
    }
  });
}

// Remove liquidity
async function removeLiquidity(userId, liquidityId) {
  return prisma.$transaction(async (tx) => {

    //Fetch Liquidity
    const liquidity = await tx.liquidity.findUnique({
      where: { id: liquidityId }
    });
    if (!liquidity) {
      return { error: "LIQUIDITY_NOT_FOUND" };
    }
    if (liquidity.userId !== userId) {
      return { error: "UNAUTHORIZED" };
    }
    //Fetch Pair
    const pair = await tx.pair.findUnique({
      where: { id: liquidity.pairId }
    }); 
    if (!pair) {
      return { error: "PAIR_NOT_FOUND" };
    }

    const reserve0 = new Decimal(pair.reserve0);
    const reserve1 = new Decimal(pair.reserve1);
    const amount0 = new Decimal(liquidity.amount0);
    const amount1 = new Decimal(liquidity.amount1);

    //calculate Share 
    const share = amount0.div(reserve0); 

    //Withdrawal amounts
    const withdraw0 = reserve0.mul(share);
    const withdraw1 = reserve1.mul(share);

    //Update Pair reserves
    await tx.pair.update({
      where: { id: pair.id },
      data: { 
        reserve0: reserve0.sub(withdraw0),
        reserve1: reserve1.sub(withdraw1)
      }
    });

    //Delete Liquidity record
    await tx.liquidity.delete({ 
      where: { id: liquidityId }  
    });
    return { 
      withdrawn: { 
        amount0: withdraw0, 
        amount1: withdraw1 
      } 
    };
  })

}

module.exports = { addLiquidity, getLiquidity, removeLiquidity };
