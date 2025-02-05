# AFRICO-X Blockchain Contracts

## Overview
This directory contains the core smart contracts and development environment for the AFRICO-X carbon credit trading platform. It implements a decentralized system for managing carbon credits as ERC-20 tokens and a project registration system with weighted voting.

## Key Features
- **Carbon Credit Token (CCT)**: ERC-20 token representing carbon credits (1 CCT = 1 metric ton of CO2)
- **Project Registration**: System for submitting and verifying carbon offset projects
- **Weighted Voting**: Token holders can vote on projects with voting power proportional to their token balance
- **Role-Based Access Control**: Three distinct roles (Admin, ProjectOwner, Buyer) with specific permissions

## Directory Structure
```
blockchain/
├── contracts/          # Solidity smart contracts
│   ├── CarbonCreditToken.sol    # ERC-20 token implementation
│   ├── ProjectRegistration.sol  # Project submission and voting system
│   └── .gitkeep
├── migrations/         # Deployment scripts
│   ├── 1_deploy_contracts.js    # Contract deployment
│   └── .gitkeep
├── test/               # Comprehensive test suite
│   ├── cct.test.js     # CarbonCreditToken tests
│   ├── pr.test.js      # ProjectRegistration tests
│   └── .gitkeep
├── truffle-config.js   # Truffle configuration
├── package.json        # Node.js dependencies
└── README.md           # Project documentation
```

## Development Setup

### Prerequisites
- Node.js v16.0.0
- Truffle Suite
- Ganache CLI

### Installation
```bash
npm install -g truffle ganache-cli
npm install
npm install @openzeppelin/contracts
```

### Compile Contracts
```bash
truffle compile
```

### Running Tests
1. Start Ganache in one terminal:
```bash
ganache-cli
```

2. In another terminal, run tests:
```bash
truffle test
```

### Deployment
To deploy to local development network:
```bash
truffle migrate --network development
```

## Smart Contract Documentation

### CarbonCreditToken (CCT)
- **Roles**: Admin (1), ProjectOwner (2), Buyer (3)
- **Functions**:
  - `setRole(address user, Role role)`: Assign roles
  - `mint(address account, uint256 amount)`: Create new tokens
  - `burn(uint256 amount)`: Retire tokens
  - `setDepletionRate(address buyer, uint256 rate)`: Configure buyer depletion

### ProjectRegistration
- **Project Lifecycle**:
  1. ProjectOwner submits project
  2. Buyers vote with their token weight
  3. Admin finalizes projects with >50% votes
- **Key Functions**:
  - `submitProject(string name)`: Register new project
  - `voteForProject(uint256 projectId)`: Vote for project
  - `finalizeProject(uint256 projectId)`: Finalize successful projects

## Contributing
1. Create a new branch for your changes
2. Write tests for new functionality
3. Run all tests before submitting PR
4. Update documentation as needed

## License
MIT License - See SPDX headers in source files
