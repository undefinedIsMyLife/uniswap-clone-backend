## 🚀 Uniswap Clone Backend

A backend simulation of Uniswap V2 built with:
- Node.js
- Express
- Prisma
- PostgreSQL

### Features
- Token creation & management
- Pair (liquidity pool) creation
- Constant product AMM swaps
- Liquidity tracking
- Swap & liquidity history
- Fully tested API (Jest + Supertest)

### Architecture
routes → controllers → services → Prisma

### AMM Formula
x * y = k

### How to Run
npm install
npx prisma migrate dev
npm run dev
npm test
