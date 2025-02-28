#!/bin/bash
set -e

# Copy backend directory instead of moving it
mkdir -p /app/backend
echo "Copying backend directory..."
cp -r /repo/backend/* /app/backend/

# Install backend dependencies from within the directory
echo "Installing backend dependencies..."
cd /app/backend
npm install --silent
echo "Backend dependencies installed."

# Copy example.env to .env
echo "Copying example.env to .env..."
cp /app/backend/example.env /app/backend/.env

# Wait for data from blockchain service
echo "Waiting for blockchain contract addresses..."
while [ ! -f /app/blockchain/build/addresses.json ]; do
  sleep 2
  echo "Still waiting for contract addresses..."
done
echo "Contract addresses found!"

# Generate AES_SECRET_KEY
AES_SECRET_KEY=$(openssl rand -hex 32)

# Fetch CCT_ADDRESS and PR_ADDRESS from blockchain service
CCT_ADDRESS=$(jq -r '.CCT_ADDRESS' /app/blockchain/build/addresses.json)
PR_ADDRESS=$(jq -r '.PR_ADDRESS' /app/blockchain/build/addresses.json)

# Connect to blockchain container's Ganache instance
echo "Fetching account data from Ganache..."
# Use blockchain service name instead of localhost
ACCOUNTS_RESPONSE=$(curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://blockchain:8545)
FIRST_ACCOUNT=$(echo $ACCOUNTS_RESPONSE | jq -r '.result[0]')

# Fetch mnemonic from blockchain service
MNEMONIC=$(cat /app/blockchain/build/mnemonic.txt)

# Generate private key from mnemonic using ethers in a one-liner
PRIVATE_KEY=$(node -e "
const { ethers } = require('ethers');
const mnemonic = '$MNEMONIC';
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log(wallet.privateKey);
")

# Update .env with exact format and use blockchain as provider URL
cat <<EOF > /app/backend/.env
PRIVATE_KEY=$PRIVATE_KEY
PROVIDER_URL=http://blockchain:8545
CCT_ADDRESS=$CCT_ADDRESS
PR_ADDRESS=$PR_ADDRESS
MNEMONIC=$MNEMONIC
AES_SECRET_KEY=$AES_SECRET_KEY
EOF

# Start the backend
cd /app/backend
echo "Starting backend server..."
nohup node src/index.js --host 0.0.0.0 >> server.log 2>&1 &
