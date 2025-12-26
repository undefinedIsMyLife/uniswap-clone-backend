const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uniswap Clone Backend API",
      version: "1.0.0",
      description:
        "Backend API for an AMM-style decentralized exchange (off-chain simulation).",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJSDoc(options);
