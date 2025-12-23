const prisma = require("../services/db.service");
const request = require("supertest");
const app = require("../index"); // we’ll need to export app in index.js

describe("Token API", () => {
  it("should create a new token", async () => {
    const res = await request(app)
      .post("/tokens")
      .send({
        symbol: "TEST_" + Date.now(),
        address: "0x" + Date.now().toString().padStart(40, "0"),
        decimals: 18
    })
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");     // ✅ check the object has id
    expect(res.body.symbol).toMatch(/^TEST_/); // ✅ check symbol looks like TEST_..
  });

  it("should return list of tokens", async () => {
    const res = await request(app).get("/tokens");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Clean up test tokens after tests
/* 
afterAll(async () => {
  await prisma.token.deleteMany({
    where: { symbol: { startsWith: "TEST_" } }
  });
});

*/