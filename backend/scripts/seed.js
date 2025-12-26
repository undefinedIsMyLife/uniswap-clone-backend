const prisma = require("../src/services/db.service");
const { Decimal } = require("@prisma/client/runtime/library");

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Clean existing data (order matters)
  await prisma.swap.deleteMany();
  await prisma.liquidity.deleteMany();
  await prisma.pair.deleteMany();
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create users
  const alice = await prisma.user.create({
    data: {
      wallet: "0xALICE"
    }
  });

  const bob = await prisma.user.create({
    data: {
      wallet: "0xBOB"
    }
  });


  // 3. Create tokens
  const usd = await prisma.token.create({
    data: {
      symbol: "USD",
      address: "0xUSDC",
      decimals: 2
    }
  });

  const btc = await prisma.token.create({
    data: {
      symbol: "BTC",
      address: "0xBTC",
      decimals: 8
    }
  });

  // 4. Create pair
  const pair = await prisma.pair.create({
    data: {
      token0Id: usd.id,
      token1Id: btc.id,
      reserve0: new Decimal(0),
      reserve1: new Decimal(0)
    }
  });

  // 5. Add initial liquidity (Alice)
  const initialUSD = new Decimal(100_000);
  const initialBTC = new Decimal(2);

  await prisma.pair.update({
    where: { id: pair.id },
    data: {
      reserve0: initialUSD,
      reserve1: initialBTC
    }
  });

  await prisma.liquidity.create({
    data: {
      userId: alice.id,
      pairId: pair.id,
      amount0: initialUSD,
      amount1: initialBTC
    }
  });

  console.log("✅ Seed completed successfully");
  console.log({
    users: { alice: alice.id, bob: bob.id },
    tokens: { USD: usd.id, BTC: btc.id },
    pair: pair.id
  });
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
