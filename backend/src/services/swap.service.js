const prisma = require("./db.service");
const { Decimal } = require("@prisma/client/runtime/library");

const FEE_RATE = new Decimal("0.003"); // 0.3%

async function executeSwap(userId, pairId, amountIn, tokenInId) {
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

    if (tokenInId === pair.token0Id) {
      reserveIn = reserve0;
      reserveOut = reserve1;
    } else if (tokenInId === pair.token1Id) {
      reserveIn = reserve1;
      reserveOut = reserve0;
    } else {
      return { error: "INVALID_TOKEN_DIRECTION" };
    }

    const priceBefore = reserveIn.div(reserveOut);

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
    //Execution fees
    const executionPrice = amountInDec.div(amountOut);

    // Update reserves 
    let newReserveIn, newReserveOut;

    if (tokenInId === pair.token0Id) {
      newReserveIn = reserve0.add(amountInDec);
      newReserveOut = reserve1.sub(amountOut);
    } else {
      newReserveIn = reserve1.add(amountInDec);
      newReserveOut = reserve0.sub(amountOut);
    }

    const priceAfter = newReserveIn.div(newReserveOut);
    
    //Calculate slippage
    const slippage = executionPrice
    .minus(priceBefore)
    .div(priceBefore)
    .mul(100);

    const updatedPair = await tx.pair.update({
      where: { id: pairId },
      data: {
        reserve0,
        reserve1
      }
    });

    const tokenOutId =
      tokenInId === pair.token0Id
        ? pair.token1Id
        : pair.token0Id;

    const swap = await tx.swap.create({
      data: {
        userId,
        pairId,
        amountIn: amountInDec,
        amountOut,
        tokenInId,
        tokenOutId
      }
    });


    return {
      swap,
      updatedPair,
      pricing: {
      priceBefore: priceBefore.toString(),          // BTC per USD
      priceBeforeInverted: priceBefore.pow(-1).toString(), // USD per BTC
      executionPrice: executionPrice.toString(),
      priceAfter: priceAfter.toString(),
      slippagePercent: slippage.toFixed(4)
    }
   };

  });
}

module.exports = { executeSwap };
