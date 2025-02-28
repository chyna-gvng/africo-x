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
while [ ! -f /blockchain-build/addresses.json ]; do
  sleep 2
  echo "Still waiting for contract addresses..."
done
echo "Contract addresses found!"

# Generate AES_SECRET_KEY
AES_SECRET_KEY=$(openssl rand -hex 32)

# Fetch CCT_ADDRESS and PR_ADDRESS from blockchain service
CCT_ADDRESS=$(jq -r '.CCT_ADDRESS' /blockchain-build/addresses.json)
PR_ADDRESS=$(jq -r '.PR_ADDRESS' /blockchain-build/addresses.json)

# Connect to blockchain container's Ganache instance
echo "Fetching account data from Ganache..."
# Use blockchain service name instead of localhost
ACCOUNTS_RESPONSE=$(curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://localhost:8545)
FIRST_ACCOUNT=$(echo $ACCOUNTS_RESPONSE | jq -r '.result[0]')

# Get private key for the first account
PRIVATEKEY_RESPONSE=$(curl -X POST --data '{"jsonrpc":"2.0","method":"personal_listAccounts","params":[],"id":1}' http://localhost:8545)
PRIVATE_KEY=$(echo $PRIVATEKEY_RESPONSE | jq -r '.result[0].privateKey' | sed 's/0x//')

# Fetch mnemonic from blockchain service
MNEMONIC=$(cat /blockchain-build/mnemonic.txt)

# Update .env with exact format and use blockchain as provider URL
cat <<EOF > /app/backend/.env
PRIVATE_KEY=$PRIVATE_KEY
PROVIDER_URL=http://localhost:8545
CCT_ADDRESS=$CCT_ADDRESS
PR_ADDRESS=$PR_ADDRESS
MNEMONIC=$MNEMONIC
AES_SECRET_KEY=$AES_SECRET_KEY
EOF

# Start the backend
cd /app/backend
echo "Starting backend server..."
node src/index.js
