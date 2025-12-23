const prisma = require("./db.service");

// create a pair
async function createPair(token0Id, token1Id) {
  // 1. Tokens must exist
  const token0 = await prisma.token.findUnique({ where: { id: token0Id } });
  const token1 = await prisma.token.findUnique({ where: { id: token1Id } });

  if (!token0 || !token1) {
    return { error: "One or both token IDs do not exist." };
  }

  // 2. Check duplicate (order independent)
  const existing = await prisma.pair.findFirst({
    where: {
      OR: [
        { token0Id, token1Id },
        { token0Id: token1Id, token1Id: token0Id }
      ]
    }
  });

  if (existing) {
    return { error: "Pair already exists." };
  }

  // 3. Create pair
  const pair = await prisma.pair.create({
    data: {
      token0Id,
      token1Id
    },
    include: {
      token0: true,
      token1: true
    }
  });

  return pair;
}

// get all pairs
async function getPairs() {
  return prisma.pair.findMany({
    include: {
      token0: true,
      token1: true
    }
  });
}

module.exports = { createPair, getPairs };
