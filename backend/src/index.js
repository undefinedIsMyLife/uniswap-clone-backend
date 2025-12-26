const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Uniswap Clone Backend Running");
});

// Import and use token routes
const tokenRoutes = require("./routes/token.routes");
app.use("/tokens", tokenRoutes)
//Import and use pair routes
const pairRoutes = require("./routes/pair.routes");
app.use("/pairs", pairRoutes);
//Import and use liquidity routes
const liquidityRoutes = require("./routes/liquidity.routes");
app.use("/liquidity", liquidityRoutes);
// Import and use user routes
const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);
// Import and use swap routes
const swapRoutes = require("./routes/swap.routes");
app.use("/swap", swapRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
}

module.exports = app;  // Export app for testing