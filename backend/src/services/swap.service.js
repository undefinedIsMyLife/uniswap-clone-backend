const prisma = require("./db.service");
const { Decimal } = require("@prisma/client/runtime/library");

const FEE_RATE = new Decimal("0.003"); // 0.3%

async function executeSwap(userId, pairId, amountIn, tokenIn) {
  const amountInDec = new Decimal(amountIn);

  if (amountInDec.lte(0)) {
    return { error: "INVALID_AMOUNT" };
  }

  return prisma.$transaction(async (tx) => {
    const pair = await tx.pair.findUnique({
      where: { id: pairId }
    });

    if (!pair) return { error: "PAIR_NOT_FOUND" };

    const user = await tx.user.findUnique({
      where: { id: userId }
    });

    if (!user) return { error: "USER_NOT_FOUND" };

    let reserveIn, reserveOut;
    let reserve0 = new Decimal(pair.reserve0);
    let reserve1 = new Decimal(pair.reserve1);

    if (tokenIn === 0) {
      reserveIn = reserve0;
      reserveOut = reserve1;
    } else if (tokenIn === 1) {
      reserveIn = reserve1;
      reserveOut = reserve0;
    } else {
      return { error: "INVALID_TOKEN_DIRECTION" };
    }

    // amountIn after fee
    const amountInWithFee = amountInDec.mul(
      new Decimal(1).minus(FEE_RATE)
    );

    // AMM formula
    const amountOut = reserveOut.mul(amountInWithFee)
      .div(reserveIn.add(amountInWithFee));

    if (amountOut.lte(0)) {
      return { error: "SWAP_FAILED" };
    }

    // Update reserves correctly
    if (tokenIn === 0) {
      reserve0 = reserve0.add(amountInDec);
      reserve1 = reserve1.sub(amountOut);
    } else {
      reserve1 = reserve1.add(amountInDec);
      reserve0 = reserve0.sub(amountOut);
    }

    const updatedPair = await tx.pair.update({
      where: { id: pairId },
      data: {
        reserve0,
        reserve1
      }
    });

    const swap = await tx.swap.create({
      data: {
        userId,
        pairId,
        amountIn: amountInDec,
        amountOut,
        tokenInId: tokenIn,
        tokenOutId: tokenIn === 0 ? 1 : 0
      }
    });

    return { swap, updatedPair };
  });
}

module.exports = { executeSwap };
