# 🦄 Uniswap-Style AMM Backend

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)
![Testing](https://img.shields.io/badge/Testing-Jest-success)
![Architecture](https://img.shields.io/badge/Architecture-Clean%20Backend-brightgreen)

A **production-quality backend implementation** of a **Uniswap-style Automated Market Maker (AMM)**.

This project demonstrates **protocol-level reasoning, financial correctness, and backend system design** using **Node.js, Express, Prisma, and PostgreSQL**.

> **Goal:** Isolate and rigorously validate AMM mechanics **without** smart contracts or frontend complexity.

---

## 🔑 Key Capabilities

- Deterministic AMM behavior using the **constant product invariant** (`x · y = k`)
- Liquidity pool creation and reserve management
- Liquidity provision with **ratio enforcement**
- Liquidity removal with **strict proportional settlement**
- Token swaps with **price impact & fee accumulation**
- **Atomic, ACID-safe state transitions** using Prisma `$transaction`
- **High-precision decimal arithmetic** to prevent rounding errors
- **Comprehensive Jest test suite** covering all protocol flows

---

## 🧠 Protocol & Backend Concepts

- Automated Market Makers (AMMs)
- Liquidity pools & invariant preservation
- Liquidity Provider (LP) mechanics
- Swap price impact & fee distribution
- Financial precision in backend systems
- Transactional consistency & failure safety

---

## 🛠 Technology Stack

- **Node.js** - runtime
- **Express** - HTTP layer
- **PostgreSQL** - relational data integrity
- **Prisma ORM** - typed data access & transactions
- **Decimal.js** - deterministic financial math
- **Jest** - unit & integration testing

---

## 🧱 System Architecture

![AMM Swap Flow](docs/amm-flow.png)

**All financial state transitions are validated in the service layer and committed atomically within a single database transaction.**

src/

├── controllers/ # Transport layer (HTTP concerns only)

├── services/ # Domain logic (AMM protocol lives here)

├── routes/ # API routing

├── test/ # Protocol-level Jest tests

├── index.js # Application bootstrap

├── app.js # Express configuration

└── prisma/

└── schema.prisma # Relational schema & constraints


**Design Principle:**  
All financial logic is **isolated, deterministic, and fully testable** inside the `services` layer.

---

## 🧪 Local Development
> All commands below assume you are inside the `backend/` directory.

```bash
cd backend
```
### Install dependencies

```bash
npm install
```
### Environment configuration

Create .env:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/amm_db"
PORT=3000
```
Create .env.test:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/amm_test_db"
```
### Database setup
```bash
npx prisma migrate dev
npx prisma generate
```
### Database Seeding (Demo Data)

This project includes a seed script to populate the database with:
- Sample users
- Tokens
- A liquidity pair with initial reserves

Run the seed script:

```bash
npm run seed
```
### Start the server
```bash
npm run dev
```
Server available at:
```arduino
http://localhost:3000
```
### Run tests
```bash
npm test
```
All core AMM invariants are validated via automated tests.

## 📖 API Documentation (Swagger)

This project includes **OpenAPI (Swagger) documentation** for all endpoints.

After starting the server locally, access the interactive API docs at:

http://localhost:3000/api-docs

The Swagger UI provides:
- Request/response schemas
- Parameter validation
- Example payloads
- One-click API testing


## 📡 API Examples (Representative)

### Add Liquidity
```http
POST /liquidity/add
```
```json
{
  "userId": 1,
  "pairId": 1,
  "amount0": "100",
  "amount1": "100"
}
```
### Remove Liquidity
```http
POST /liquidity/remove
```
```json
{
  "userId": 1,
  "liquidityId": 5
}
```
### Swap Tokens
```http
POST /swap
```
```json
{
  "userId": 1,
  "pairId": 1,
  "amountIn": "10",
  "tokenIn": 0
}
```

## ❓ Architectural Rationale (No Smart Contracts)

This repository intentionally focuses on **off-chain protocol correctness.**

Smart contracts, LP token issuance, and on-chain execution introduce additional constraints and are planned for a **separate on-chain AMM project.**

This mirrors real-world DeFi system separation:

- Protocol logic
  
- Execution layer
  
- Indexing & analytics
  
- Frontend

## ✅ Project Status

**Complete, Stable, Tested AMM Backend**

## 🧑‍💻 Author Notes

Built as a **protocol-focused backend engineering project** emphasizing:

- Financial correctness

- Deterministic behavior

- Test-driven development

- Clean, modular architecture

### 🎯 Reviewer Notes (For Engineers)

- Business logic is fully isolated from transport concerns

- Database state transitions are atomic and reversible

- Tests encode protocol invariants and expected behavior

- System is designed for extension into on-chain execution

## 🔗 Ethereum Migration Path (Design Notes)
This project intentionally implements an **off-chain simulation** of an AMM to focus on backend architecture, financial correctness, and protocol logic.

A natural next step is migrating the core AMM logic on-chain while reusing this backend as an **indexing and analytics layer**.

### What Moves On-Chain
In an Ethereum-based version:
- AMM logic (swaps, liquidity, reserve updates) would live in a Solidity smart contract
- The contract would emit events such as:
  - `Swap`
  - `LiquidityAdded`
  - `LiquidityRemoved`

### What This Backend Becomes
After migration, this backend would:
- Listen to blockchain events (via ethers.js / viem / The Graph)
- Index swaps, liquidity changes, and reserve snapshots into a database
- Serve read-only APIs for:
  - trade history
  - price data
  - analytics
  - charts

### What Stays the Same
Much of the current system remains reusable:
- Database schema (swaps, liquidity, snapshots)
- Pricing and slippage calculations
- API layer (read endpoints)
- Swagger documentation
- Testing approach

### Separation of Concerns
This repository deliberately avoids smart contracts to:
- keep scope focused
- avoid mixing protocol logic with indexing logic

A full on-chain AMM + indexer is planned as a **separate project**.

This separation mirrors real-world DeFi architectures, where execution occurs on-chain and data aggregation, analytics, and read APIs live off-chain.
