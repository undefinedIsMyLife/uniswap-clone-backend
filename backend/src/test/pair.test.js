const request = require("supertest");
const app = require("../index");
const prisma = require("../services/db.service");

let tokenA;
let tokenB;

beforeAll(async () => {
  // Clean previous test pairs
  await prisma.pair.deleteMany({});
  await prisma.token.deleteMany({
    where: { symbol: { startsWith: "TEST_" } }
  });

  // Create 2 test tokens
  tokenA = await prisma.token.create({
    data: {
      symbol: "TEST_A",
      address: "0x" + "1".repeat(40),
      decimals: 18
    }
  });

  tokenB = await prisma.token.create({
    data: {
      symbol: "TEST_B",
      address: "0x" + "2".repeat(40),
      decimals: 18
    }
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Pair API", () => {

  it("should create a new pair", async () => {
    const res = await request(app)
      .post("/pairs")
      .send({
        token0Id: tokenA.id,
        token1Id: tokenB.id
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.token0Id).toBe(tokenA.id);
    expect(res.body.token1Id).toBe(tokenB.id);
  });

  it("should NOT create duplicate pair (same order)", async () => {
    const res = await request(app)
      .post("/pairs")
      .send({
        token0Id: tokenA.id,
        token1Id: tokenB.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Pair already exists.");
  });

  it("should NOT create duplicate pair (reverse order)", async () => {
    const res = await request(app)
      .post("/pairs")
      .send({
        token0Id: tokenB.id,
        token1Id: tokenA.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Pair already exists.");
  });

  it("should NOT create pair with same token twice", async () => {
    const res = await request(app)
      .post("/pairs")
      .send({
        token0Id: tokenA.id,
        token1Id: tokenA.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Token IDs must be valid and different.");
  });

  it("should NOT create pair if token does not exist", async () => {
    const res = await request(app)
      .post("/pairs")
      .send({
        token0Id: 99999,
        token1Id: tokenA.id
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("One or both token IDs do not exist.");
  });

  it("should return list of pairs", async () => {
    const res = await request(app).get("/pairs");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1); // Only 1 valid pair created
  });

});

// Clean up test tokens after tests
/* 
afterAll(async () => {
  await prisma.token.deleteMany({
    where: { symbol: { startsWith: "TEST_" } }
  });
});

*/