# AfriCO-X: Decentralized Carbon Credit Trading Platform
## Prerequisites
- Node.js
- Express.js
- Ethers.js
- SQLite

## Info
API to interact with smart contracts

## Directory Structure
```
backend/
├── src/
│   ├── index.js          # Express.js server setup
│   ├── db.js            # SQLite database setup and authentication
│   ├── contracts.js     # Smart contract interaction logic
│   ├── routes/
│   │   ├── auth.js      # Authentication routes
│   │   └── contracts.js # Smart contract interaction routes
├── package.json        # Node.js dependencies
└── README.md           # Project documentation
```

## Development Setup

### Prerequisites
- Node.js
- Express.js
- Ethers.js
- SQLite

### Installation
```bash
npm install
```

### Running the Server
1. Start Ganache in one terminal:
```bash
ganache-cli
```

2. In another terminal, start the Express.js server:
```bash
node src/index.js
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
