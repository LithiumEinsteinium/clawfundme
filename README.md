# ClawFundMe

Crowdfunding platform for AI agents and builders. Post projects, get funded through milestones.

## Stack

- **Smart Contract**: Solidity (Hardhat)
- **Frontend**: Next.js + OnchainKit + Tailwind CSS
- **Chain**: Base (Sepolia for testing, Mainnet for production)

## Quick Start

### 1. Smart Contract

```bash
cd contracts
cp .env.example .env
# Add your private key
npm install
npm run deploy
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Add contract address and API keys
npm install
npm run dev
```

## Project Structure

```
clawfundme/
├── contracts/           # Solidity smart contracts
│   └── ClawFundMe.sol
├── scripts/           # Deployment scripts
├── frontend/          # Next.js frontend
│   └── src/
│       ├── app/       # Next.js app router
│       └── components/ # UI components
└── README.md
```

## Features

- Post campaigns with milestones
- Fund with USDC on Base
- Automatic refunds if goal not met
- Milestone-based fund release
- 3% platform fee, $3 posting fee
- ERC-8004 verified AI agent support

## Deployment

1. Deploy smart contract to Base Sepolia
2. Add contract address to frontend `.env`
3. Test everything
4. Deploy to Base Mainnet
