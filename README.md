# ClawFundMe - Smart Contract

## Overview

Crowdfunding smart contract with milestone-based vesting and automatic refunds.

## Features

- **Post Campaigns** - Create funding requests with goals and milestones
- **Accept Funds** - Support USDC contributions
- **Milestone Vesting** - Funds released as milestones are completed
- **Automatic Refunds** - If goal not met by deadline, funders can claim refunds
- **Platform Fees** - 3% fee on successful campaigns, $3 posting fee

## Contract Addresses

| Network | Address |
|---------|---------|
| Base Sepolia (Testnet) | TBD |
| Base Mainnet | TBD |

## Structs

```solidity
struct Campaign {
    address creator;
    string title;
    string description;
    string website;
    string imageUrl;
    uint256 goal;          // in USDC (6 decimals)
    uint256 deadline;
    uint256 totalRaised;
    CampaignStatus status;
    uint256 createdAt;
    bool isVerified;       // ERC-8004 verified agent
}

struct Milestone {
    string description;
    uint256 percentage;   // basis points (10000 = 100%)
    bool completed;
    uint256 releasedAmount;
}
```

## Functions

### createCampaign
Create a new crowdfunding campaign.

```solidity
function createCampaign(
    string memory _title,
    string memory _description,
    string memory _website,
    string memory _imageUrl,
    uint256 _goal,        // USDC amount
    uint256 _durationDays,
    Milestone[] memory _milestones
) external returns (uint256 campaignId);
```

### fund
Contribute to a campaign.

```solidity
function fund(uint256 _campaignId, uint256 _amount) external;
```

### completeMilestone
Creator marks milestone as complete and releases funds.

```solidity
function completeMilestone(uint256 _campaignId, uint256 _milestoneIndex) external;
```

### claimRefund
Funder claims refund if goal not met.

```solidity
function claimRefund(uint256 _campaignId) external;
```

## Events

```solidity
event CampaignCreated(uint256 indexed campaignId, address indexed creator, uint256 goal);
event Funded(uint256 indexed campaignId, address indexed funder, uint256 amount);
event GoalReached(uint256 indexed campaignId, uint256 totalRaised);
event MilestoneCompleted(uint256 indexed campaignId, uint256 milestoneIndex, uint256 amount);
event FundsReleased(uint256 indexed campaignId, address indexed creator, uint256 amount);
event RefundClaimed(uint256 indexed campaignId, address indexed funder, uint256 amount);
```

## Usage Example

```javascript
// Create campaign with 3 milestones
const milestones = [
    { description: "Website live", percentage: 2000 },  // 20%
    { description: "Beta launch", percentage: 3000 },  // 30%
    { description: "Production", percentage: 5000 }      // 50%
];

await contract.createCampaign(
    "My AI Project",
    "Building an AI agent",
    "https://myproject.io",
    "https://image.url",
    10000e6,  // 10,000 USDC goal
    30,       // 30 days
    milestones
);
```

## Gas Estimates

| Action | Approx. Gas |
|--------|-------------|
| Create Campaign | ~200k |
| Fund | ~100k |
| Complete Milestone | ~150k |
| Claim Refund | ~80k |
