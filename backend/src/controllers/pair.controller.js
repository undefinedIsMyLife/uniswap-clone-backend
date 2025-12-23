const pairService = require("../services/pair.service");

// Create a pair
async function createPair(req, res) {
  try {
    const { token0Id, token1Id } = req.body;

    if (!token0Id || !token1Id || token0Id === token1Id) {
      return res
        .status(400)
        .json({ error: "Token IDs must be valid and different." });
    }

    const result = await pairService.createPair(token0Id, token1Id);

    if (result?.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Unexpected error creating pair:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all pairs
async function getPairs(req, res) {
  try {
    const pairs = await pairService.getPairs();
    res.json(pairs);
  } catch (error) {
    console.error("Error fetching pairs:", error);
    res.status(500).json({ error: "Failed to fetch pairs" });
  }
}

module.exports = { createPair, getPairs };
