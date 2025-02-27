#!/bin/bash
# Install jq and openssl
apk add --no-cache jq openssl

# Move backend directory as a whole
mkdir -p /app
mv /repo/backend /app/

# Install backend dependencies from within the directory
echo "Installing backend dependencies..."
cd /app/backend
npm install
echo "Backend dependencies installed."

# Copy example.env to .env
echo "Copying example.env to .env..."
cp /app/backend/example.env /app/backend/.env

# Fetch PRIVATE_KEY (specifically for (0)) and MNEMONIC from Ganache logs
echo "Fetching Ganache data..."
GANACHE_CONTAINER=$(docker ps -q -f name=ganache)
PRIVATE_KEY=$(docker logs $GANACHE_CONTAINER | grep -A 1 "Private Keys" | grep "(0)" | grep -oP '0x[0-9a-fA-F]{64}' | sed 's/0x//')
MNEMONIC=$(docker logs $GANACHE_CONTAINER | grep -oP '(?<=Mnemonic:      ).*' | head -1)

# Generate AES_SECRET_KEY
AES_SECRET_KEY=$(openssl rand -hex 32)

# Fetch CCT_ADDRESS and PR_ADDRESS from blockchain service
CCT_ADDRESS=$(jq -r '.CCT_ADDRESS' /blockchain-build/addresses.json)
PR_ADDRESS=$(jq -r '.PR_ADDRESS' /blockchain-build/addresses.json)

# Update .env with exact format
cat <<EOF > /app/backend/.env
PRIVATE_KEY=$PRIVATE_KEY
PROVIDER_URL=http://ganache:8545
CCT_ADDRESS=$CCT_ADDRESS
PR_ADDRESS=$PR_ADDRESS
MNEMONIC=$MNEMONIC
AES_SECRET_KEY=$AES_SECRET_KEY
EOF

# Start the backend
cd /app/backend
node src/index.js
