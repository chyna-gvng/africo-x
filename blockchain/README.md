# AFRICO-X

## Overview
AFRICO-X is a decentralized application (DApp) built on the Ethereum blockchain that facilitates the trading of carbon credits. It allows project owners to register carbon offset projects and buyers to purchase and retire carbon credits. The platform ensures transparency and security through smart contracts.

## Tools
- Truffle Suite
- Ganache-CLI
- Solidity

## Users
- **Admin**: The deployer of the smart contracts with the highest privileges.
- **ProjectOwner (Seller)**: Users who can submit carbon offset projects.
- **Buyers**: Users who can purchase and retire carbon credits.

## Smart Contracts

### CarbonCreditToken.sol
This contract represents the ERC-20 token for carbon credits.

#### Functions
- **constructor()**: Initializes the ERC-20 Carbon Credit Token and sets the deployer as the Admin.
- **setRole(address user, Role role)**: Assigns a role to a user.
- **getRole(address user)**: Returns the role of a user.
- **mint(address account, uint256 amount)**: Mints new CCT tokens.
- **burn(uint256 amount)**: Burns (retires) CCT tokens.
- **setDepletionRate(address buyer, uint256 rate)**: Sets the depletion rate for a buyer.

### ProjectRegistration.sol
This contract allows project owners to submit projects and receive verification through voting.

#### Functions
- **constructor(address _cct)**: Initializes the contract with the CarbonCreditToken address.
- **submitProject(string calldata _name)**: Allows a project owner to submit a new project.
- **voteForProject(uint256 projectId)**: Allows CCT holders to vote for a project.
- **finalizeProject(uint256 projectId)**: Finalizes project registration if it has >50% of total vote weight.

## Prerequisites
- NodeJS (v16.0.0)
- Truffle
- Ganache-CLI

## Setup
1. **Install dependencies**:
    ```bash
    npm install -g truffle ganache-cli
    ```

2. **Compile contracts using Truffle**:
    ```bash
    truffle compile
    ```

3. **Start Ganache-CLI instance**:
    ```bash
    ganache-cli
    ```

4. **In a separate terminal session, deploy contracts to the RPC**:
    ```bash
    truffle migrate --network development
    ```

5. **Testing**:
    ```bash
    truffle test
    ```

## Additional Notes
- Ensure that your Ganache-CLI instance is running before deploying the contracts.
- Make sure to configure your Truffle configuration file (`truffle-config.js`) to point to the correct network settings.
- For production deployment, consider using a more robust Ethereum node provider like Infura or Alchemy.