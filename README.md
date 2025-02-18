# AfriCO-X: Decentralized Carbon Credit Trading Platform

## Overview
AfriCO-X is a decentralized carbon credit trading platform that enables the trading of carbon credits as ERC-20 tokens. The platform allows project owners to submit carbon offset projects and receive verification through a weighted voting system. Buyers can purchase carbon credits to offset their emissions and support verified carbon offset projects.

## Prerequisites
- Node.js (v18.20.5)
- npm
- Truffle Suite
- Ganache

## Directory Structure
```
africo-x/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── contracts.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── contracts.js
│   ├── package.json
│   ├── README.md
│   └── example.env
├── blockchain/
│   ├── contracts/
│   │   ├── CarbonCreditToken.sol
│   │   ├── ProjectRegistration.sol
│   │   └── .gitkeep
│   ├── migrations/
│   │   ├── 1_deploy_contracts.js
│   │   └── .gitkeep
│   ├── test/
│   │   ├── cct.test.js
│   │   ├── pr.test.js
│   │   └── .gitkeep
│   ├── truffle-config.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   │   ├── vite.svg
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── balances.js
│   │   │   ├── contracts.js
│   │   │   └── user.js
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── App.css
│   │   │   ├── App.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Register.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   └── eslint.config.js
├── .gitignore
├── README.md
└── setup.sh
```

## Development Setup

### Prerequisites
- Node.js (v18.20.5)
- npm
- Truffle Suite
- Ganache

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/africo-x.git
cd africo-x
```

2. Run the setup script:
```bash
bash setup.sh
```

3. Start Ganache in one terminal:
```bash
ganache-cli
```

4. In another terminal, start the Express.js server:
```bash
cd backend
npm start
```

5. In another terminal, start the React development server:
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Authenticate a user

### Smart Contract Interaction
- `POST /contracts/setRole`: Set role for a user by username
- `POST /contracts/mint`: Mint tokens
- `POST /contracts/burn`: Burn tokens
- `POST /contracts/setDepletionRate`: Set depletion rate for a buyer
- `POST /contracts/submitProject`: Submit a new project
- `POST /contracts/voteForProject`: Vote for a project
- `POST /contracts/finalizeProject`: Finalize a project
- `GET /contracts/getProject`: Get project details
- `GET /contracts/getTotalEligibleVotes`: Get total eligible votes
- `GET /contracts/getEligibleVoterCount`: Get eligible voter count
- `GET /contracts/isEligibleVoter`: Check voter eligibility
- `GET /contracts/hasAddressVoted`: Check if address has voted
- `GET /contracts/getEthBalance`: Get Ethereum balance of a user
- `GET /contracts/getCctBalance`: Get CCT balance of a user
- `GET /contracts/getUserBalances`: Get both ETH and CCT balances of the authenticated user
- `GET /contracts/getUserRole`: Get role of the authenticated user from both the database and the smart contract
- `GET /contracts/getAllProjects`: Get all projects
- `GET /contracts/getProjectsByOwner`: Get projects owned by the authenticated user
- `GET /contracts/getVerifiedProjects`: Get all verified projects
- `POST /contracts/verifyProject`: Verify a project
- `POST /contracts/updateProjectCctAmount`: Update the CCT amount for a project
- `GET /contracts/getUserAddress`: Get user address of the authenticated user
- `POST /contracts/purchaseCCT`: Purchase CCT tokens

## License
MIT License - See SPDX headers in source files
