# AFRICOX - Africa Carbon Exchange
[![Project Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)](https://github.com/chyna-gvng/africo-x)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/chyna-gvng/africo-x/blob/main/LICENSE)

## Overview
AFRICOX is an end-to-end project meticulously designed to revolutionize Africa's carbon exchange market through the innovative application of blockchain technology. This platform addresses critical challenges hindering the growth and effectiveness of carbon trading in Africa, paving the way for a more transparent, efficient, and equitable ecosystem.

## Core Functionality
AFRICOX offers a suite of core functionalities designed to address the identified problems and establish a robust and user-friendly carbon trading platform:

* **Tokenized Carbon Credits:**
    *  The platform utilizes **Carbon Credit Tokens (CCT)**, an **ERC-20 token**, to represent carbon offsets.
    *  **1 CCT is equivalent to roughly 40 metric tonnes of CO2**, providing a standardized and readily understandable unit of carbon offset.

* **Project Registration and Verification:**
    * **Project Owners** can easily submit their sustainability projects directly to the platform through a streamlined submission process.
    * **Buyers** play a crucial role in **decentralized project verification** by voting on submitted projects to assess their legitimacy and impact.
    *  A **weighted voting system** ensures that buyers with a greater stake in the ecosystem have a proportionally larger influence in project verification. A buyer's **voting power is proportional to their CCT holdings**, incentivizing active participation and investment in verified projects.

* **Decentralized Marketplace:**
    *  Upon successful verification, projects are listed in a **decentralized marketplace**.
    *  **Carbon credits (CCTs)** from verified projects can be **purchased directly from the project owner** using **ETH**.
    *  This peer-to-peer marketplace eliminates intermediaries, reducing costs and enhancing transparency.

* **Automated Depletion:**
    *  **Buyers** can configure a **Daily Depletion Rate** within their account settings.
    *  This feature **automatically burns** a pre-set amount of their **CCT tokens daily**, reflecting their ongoing commitment to carbon offsetting and simplifying the process of managing their carbon footprint.
    *  This automated mechanism provides a consistent and reliable way for users to actively participate in carbon offsetting.

* **Role-Based Access Control:**
    * The platform implements a robust **Role-Based Access Control (RBAC)** system, defining distinct user roles with specific permissions and functionalities:
        * **Admin:**
            * Possesses overarching system management capabilities.
            * Responsible for setting user roles and permissions.
            * Authorizes the finalization of projects after successful verification.
        * **Project Owner:**
            * Dedicated role for individuals or organizations managing sustainability initiatives.
            * Authorized to submit carbon offset projects for community verification.
        * **Buyer:**
            * Represents users interested in offsetting their carbon footprint.
            * Empowered to vote on submitted projects for verification.
            * Capable of purchasing CCTs from verified projects in the marketplace.

## Stack

AFRICOX is built using a modern and robust technology stack, ensuring scalability, security, and maintainability:

* **Frontend:**
    * **React.js:** A dynamic JavaScript library for building interactive and user-friendly interfaces.
    * **Vite:** A fast and efficient build tool that enhances the development experience for React applications.

* **Backend:**
    * **Node.js:** A scalable JavaScript runtime environment for building server-side applications.
    * **Express.js:** A minimalist and flexible Node.js web application framework for creating robust APIs.
    * **Ethers.js:** A comprehensive JavaScript library for interacting with the Ethereum blockchain.
    * **SQLite:** A lightweight, serverless database for efficient internal data management.

* **Blockchain:**
    * **Truffle Suite:** A development environment for Ethereum, simplifying smart contract development, testing, and deployment.
    * **Solidity:** A statically-typed programming language for writing secure and reliable smart contracts on the Ethereum blockchain.
    * **Ganache:** A personal Ethereum blockchain emulator for local development and testing, providing a controlled environment.
    * **Node.js:** Used for interacting with the blockchain and managing smart contract deployments.

* **Deployment:**
    * **Docker:** A platform for containerizing applications, ensuring consistent and reproducible deployments across different environments.
    * **Caddy - Proxy:** A powerful, enterprise-ready, open source web server with automatic HTTPS, acting as a reverse proxy for enhanced security and routing.
    * **Shell Scripting:** Automated scripts for streamlined deployment processes.

## Setup
### Development
For development setup, ensure you have NVM(Node Version Manager) available.  
Clone the repo:
```bash
git clone https://github.com/chyna-gvng/africo-x.git
```
Change directory:
```bash
cd africo-x
```
Install global packages:
```bash
npm install -g truffle ganache
```

Change directory to blockchain:
```bash
cd blockchain
```
Switch Node version:
```bash
nvm use v18.20.5
```
Install blockchain packages:
```bash
npm install
```
To setup the blockchain instance, you need 2 terminal sessions:
- Start Ganache instance:
```bash
ganache
```
- Deploy the contracts to the ganache instance:
```bash
truffle migrate --network development
```
Take note of the any private key from the ganache instance, and the contract addresses.  

Change directory to backend:
```bash
cd ../backend
```
Switch Node version:
```bash
nvm use default
```
Install backend packages:
```bash
npm install
```
Generate AES secret:
```bash
openssl rand -hex 32
```
Create and modify .env:
```bash
cp example.env .env
```
Run backend server:
```bash
npm run dev
```

In a new terminal session, change directory to frontend:
```bash
cd frontend
```
Install frontend packages:
```bash
npm install
```
Run frontend server:
```bash
npm run dev
```

### Quick Access
For a simplified and quick setup using Docker, ensure you have **Docker**, **Docker Compose** and **Git** installed.  
Run:
```bash
curl -sSL https://raw.githubusercontent.com/chyna-gvng/africo-x/main/docker-setup.sh | bash
```

## Live
```bash
https://africox.angoyewally.dev
```