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
- `POST /contracts/interact`: Interact with a smart contract

## License
MIT License - See SPDX headers in source files
