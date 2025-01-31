# AfriCO-X: Decentralized Carbon Credit Trading Platform
## Prerequisites
- Node.js v16.0.0
- npm v7.10.0

## Installation

1. Install global dependencies:
```bash
npm install -g truffle ganache-cli
```

2. Clone the repository:
```bash
git clone https://github.com/chyna-gvng/africo-x.git
cd africo-x
```

3. Install project dependencies:
```bash
npm install
```

4. Configure environment variables:
```bash
cp example.env .env
```
Edit `.env` with your:
- Mnemonic phrase
- Alchemy API key
- Initial owner address

## Local Testing

1. Start Ganache:
```bash
ganache
```

2. In a new terminal, compile contracts:
```bash
truffle compile
```

3. Run tests:
```bash
truffle test
```

4. Deploy contracts:
```bash
truffle migrate --network development
```
