const request = require("supertest");
const app = require("../index");
const prisma = require("../services/db.service");
const { Prisma } = require("@prisma/client");

describe("Liquidity API", () => {
  let user;
  let tokenA;
  let tokenB;
  let pair;

  beforeAll(async () => {
    // Clean ONLY test DB
    await prisma.swap.deleteMany();
    await prisma.liquidity.deleteMany();
    await prisma.pair.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();

    // User
    user = await prisma.user.create({
      data: { wallet: "0xLIQ_TEST_USER" }
    });

    // Tokens
    tokenA = await prisma.token.create({
      data: {
        symbol: "TKA",
        address: "0xTOKEN_A",
        decimals: 18
      }
    });

    tokenB = await prisma.token.create({
      data: {
        symbol: "TKB",
        address: "0xTOKEN_B",
        decimals: 18
      }
    });

    // Pair
    pair = await prisma.pair.create({
      data: {
        token0Id: tokenA.id,
        token1Id: tokenB.id,
        reserve0: new Prisma.Decimal("0"),
        reserve1: new Prisma.Decimal("0")
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should add liquidity to empty pool", async () => {
    const res = await request(app)
      .post("/liquidity")
      .send({
        userId: user.id,
        pairId: pair.id,
        amount0: "100",
        amount1: "100"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.liquidity).toHaveProperty("id");
    expect(res.body.pair.reserve0).toBe("100");
    expect(res.body.pair.reserve1).toBe("100");
  });

  it("should allow adding liquidity with correct ratio", async () => {
    const res = await request(app)
      .post("/liquidity")
      .send({
        userId: user.id,
        pairId: pair.id,
        amount0: "50",
        amount1: "50"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.pair.reserve0).toBe("150");
    expect(res.body.pair.reserve1).toBe("150");
  });

  it("should reject incorrect liquidity ratio", async () => {
    const res = await request(app)
      .post("/liquidity")
      .send({
        userId: user.id,
        pairId: pair.id,
        amount0: "50",
        amount1: "10"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("INVALID_LIQUIDITY_RATIO");
  });

  it("should fail if pair does not exist", async () => {
    const res = await request(app)
      .post("/liquidity")
      .send({
        userId: user.id,
        pairId: 9999,
        amount0: "10",
        amount1: "10"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Pair does not exist");
  });
});
