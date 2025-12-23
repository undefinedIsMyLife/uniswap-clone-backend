const prisma = require("../services/db.service")


//Add a token.
async function createToken(req, res) {
  try {
    const { symbol, address, decimals } = req.body;
    const token = await prisma.token.create({
      data: { symbol, address, decimals }
    });
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* 
These are not LP Tokens, just regular tokens. These are ERC-20 tokens like DAI, USDC, etc. which we will use to create pairs and liquidity pools.
This is like token directory for my exchange. In real life, this would be done via a governance process or some other mechanism to ensure only legitimate tokens are added. For simplicity, we are allowing anyone to add any token here.
*/

//Get all tokens from DB
async function getTokens(req, res) {
  try {
    const tokens = await prisma.token.findMany();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createToken, getTokens };