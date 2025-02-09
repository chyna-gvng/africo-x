# AfriCO-X: Decentralized Carbon Credit Trading Platform

AfriCO-X is a comprehensive platform designed to facilitate the trading of carbon credits using blockchain technology. The platform enables project owners to submit carbon offset projects, buyers to purchase carbon credits, and a decentralized voting system for project verification.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contracts](#smart-contracts)
  - [CarbonCreditToken (CCT)](#carboncredittoken-cct)
  - [ProjectRegistration](#projectregistration)
- [Backend](#backend)
  - [API Endpoints](#api-endpoints)
- [Frontend](#frontend)
  - [Pages](#pages)
- [Contributing](#contributing)

## Project Structure

The project is organized into three main directories: `blockchain`, `backend`, and `frontend`.

```
afriCO-x/
├── blockchain/
│   ├── contracts/
│   │   ├── CarbonCreditToken.sol
│   │   ├── ProjectRegistration.sol
│   │   └── ...
│   ├── migrations/
│   │   ├── 1_deploy_contracts.js
│   │   └── ...
│   ├── test/
│   │   ├── cct.test.js
│   │   ├── pr.test.js
│   │   └── ...
│   ├── truffle-config.js
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── contracts.js
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── contracts.js
│   │   └── ...
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   │   ├── vite.svg
│   │   └── ...
│   ├── src/
│   │   ├── api/
│   │   │   ├── balances.js
│   │   │   ├── contracts.js
│   │   │   └── user.js
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ...
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── .gitignore
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.0.0 or later)
- Truffle Suite
- Ganache CLI
- npm (Node Package Manager)

## Installation

### Blockchain Contracts

1. Navigate to the `blockchain` directory:
   ```bash
   cd blockchain
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Compile the contracts:
   ```bash
   truffle compile
   ```

4. Start Ganache in one terminal:
   ```bash
   ganache-cli
   ```

5. In another terminal, run the tests:
   ```bash
   truffle test
   ```

6. Deploy the contracts to the local development network:
   ```bash
   truffle migrate --network development
   ```

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Express.js server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Smart Contracts

#### CarbonCreditToken (CCT)

- **Roles**: Admin (1), ProjectOwner (2), Buyer (3)
- **Functions**:
  - `setRole(address user, Role role)`: Assign roles
  - `mint(address account, uint256 amount)`: Create new tokens
  - `burn(uint256 amount)`: Retire tokens
  - `setDepletionRate(address buyer, uint256 rate)`: Configure buyer depletion

#### ProjectRegistration

- **Project Lifecycle**:
  1. ProjectOwner submits project
  2. Buyers vote with their token weight
  3. Admin finalizes projects with >50% votes
- **Key Functions**:
  - `submitProject(string name)`: Register new project
  - `voteForProject(uint256 projectId)`: Vote for project
  - `finalizeProject(uint256 projectId)`: Finalize successful projects

### Backend

#### API Endpoints

- **Authentication**:
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Authenticate a user

- **Smart Contract Interaction**:
  - `POST /contracts/setRole`: Set role for a user
  - `POST /contracts/mint`: Mint tokens
  - `POST /contracts/burn`: Burn tokens
  - `POST /contracts/setDepletionRate`: Set depletion rate for a buyer
  - `POST /contracts/submitProject`: Submit a new project
  - `POST /contracts/voteForProject`: Vote for a project
  - `POST /contracts/finalizeProject`: Finalize a project
  - `GET /contracts/getRole`: Get role of a user
  - `GET /contracts/getProject`: Get project details
  - `GET /contracts/getTotalEligibleVotes`: Get total eligible votes
  - `GET /contracts/getEligibleVoterCount`: Get eligible voter count
  - `GET /contracts/isEligibleVoter`: Check voter eligibility
  - `GET /contracts/hasAddressVoted`: Check if address has voted

### Frontend

#### Pages

- **Home**: Introduction to the platform.
- **Register**: User registration.
- **Login**: User authentication.
- **Dashboard**: User dashboard displaying balances.
- **Projects**: List and manage projects.

## Contributing

1. Create a new branch for your changes.
2. Write tests for new functionality.
3. Run all tests before submitting a pull request.
4. Update documentation as needed.

---
