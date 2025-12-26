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

## 📂 Architecture Overview
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

## 📡 API Examples
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

