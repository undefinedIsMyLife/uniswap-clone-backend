//require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const app = require("../index"); 
const prisma = require("../services/db.service");
const { Prisma } = require("@prisma/client");

describe("Swap API", () => {
  let tokenA;
  let tokenB;
  let pair;
  let user;

  beforeAll(async () => {
    // Clean DB
    await prisma.swap.deleteMany();
    await prisma.liquidity.deleteMany();
    await prisma.pair.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();

    // Create user
    user = await prisma.user.create({
    data: {
        wallet: "0xTEST_USER_1"
    }
    });


    // Create tokens
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


    // Create pair
    pair = await prisma.pair.create({
    data: {
            token0Id: tokenA.id,
            token1Id: tokenB.id,
            reserve0: new Prisma.Decimal("1000"),
            reserve1: new Prisma.Decimal("1000")
    }
    });

    }); 
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should perform a successful swap (token0 → token1)", async () => {
    const res = await request(app)
      .post("/swap")
      .send({
        userId: user.id,
        pairId: pair.id,
        amountIn: 100,
        tokenIn: 0
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.swap).toHaveProperty("id");
    expect(Number(res.body.swap.amountOut)).toBeGreaterThan(0);

  });

  it("should fail for invalid amount", async () => {
    const res = await request(app)
      .post("/swap")
      .send({
        userId: user.id,
        pairId: pair.id,
        amountIn: 0,
        tokenIn: 0
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("INVALID_AMOUNT");
  });

  it("should fail for invalid token direction", async () => {
    const res = await request(app)
      .post("/swap")
      .send({
        userId: user.id,
        pairId: pair.id,
        amountIn: 10,
        tokenIn: 2
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("INVALID_TOKEN_DIRECTION");
  });

  it("should fail if pair does not exist", async () => {
    const res = await request(app)
      .post("/swap")
      .send({
        userId: user.id,
        pairId: 99999,
        amountIn: 10,
        tokenIn: 0
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("PAIR_NOT_FOUND");
  });
});
