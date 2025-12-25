const request = require("supertest");
const app = require("../index");
const prisma = require("../services/db.service");
const { Decimal } = require("@prisma/client/runtime/library");

describe("Remove Liquidity API", () => {

  let user;
  let tokenA;
  let tokenB;
  let pair;
  let liquidity;

  beforeEach(async () => {
    // clean DB
    await prisma.swap.deleteMany();
    await prisma.liquidity.deleteMany();
    await prisma.pair.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();

    // user
    user = await prisma.user.create({
      data: { wallet: "0xLPUSER" }
    });

    // tokens
    tokenA = await prisma.token.create({
      data: { symbol: "ETH", address: "0xETH", decimals: 18 }
    });

    tokenB = await prisma.token.create({
      data: { symbol: "USDC", address: "0xUSDC", decimals: 18 }
    });

    // pair
    pair = await prisma.pair.create({
      data: {
        token0Id: tokenA.id,
        token1Id: tokenB.id,
        reserve0: new Decimal("1000"),
        reserve1: new Decimal("1000")
      }
    });

    // liquidity
    liquidity = await prisma.liquidity.create({
      data: {
        userId: user.id,
        pairId: pair.id,
        amount0: new Decimal("100"),
        amount1: new Decimal("100")
      }
    });
  });

  afterAll(async () => {  
    await prisma.$disconnect();
  });

  it("should remove liquidity successfully", async () => {
    const res = await request(app)
      .post("/liquidity/remove")
      .send({
        userId: user.id,
        liquidityId: liquidity.id
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.withdrawn.amount0).toBeDefined();
    expect(res.body.withdrawn.amount1).toBeDefined();

    // liquidity deleted
    const liq = await prisma.liquidity.findUnique({
      where: { id: liquidity.id }
    });
    expect(liq).toBeNull();
  });
  it("should fail if liquidity does not exist", async () => {
    const res = await request(app)
      .post("/liquidity/remove")
      .send({
        userId: user.id,
        liquidityId: 99999
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("LIQUIDITY_NOT_FOUND");
  });
  it("should fail if user does not own liquidity", async () => {
    const otherUser = await prisma.user.create({
      data: { wallet: "0xHACKER" }
    });

    const res = await request(app)
      .post("/liquidity/remove")
      .send({
        userId: otherUser.id,
        liquidityId: liquidity.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("UNAUTHORIZED");
  });
});
