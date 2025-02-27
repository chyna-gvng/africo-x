#!/bin/bash
# Install netcat and curl
apt-get update && apt-get install -y netcat-openbsd curl

# Copy blockchain directory instead of moving it
mkdir -p /app/blockchain
echo "Copying blockchain directory..."
cp -r /repo/blockchain/* /app/blockchain/

# Install global Truffle
echo "Installing Truffle and Ganache..."
npm install --silent -g truffle ganache

# Install blockchain dependencies from within the directory
echo "Installing blockchain dependencies..."
cd /app/blockchain
npm install
echo "Blockchain dependencies installed."

# Start Ganache
echo "Starting Ganache..."
ganache --detach

# Wait for Ganache
echo "Waiting for Ganache to start..."
while ! nc -zv localhost 8545; do
  sleep 1
done
echo "Ganache is up, running migrations..."

# Complile contracts
truffle compile

# Make sure build directory exists
mkdir -p /app/blockchain/build

# Run migrations and save output
truffle migrate --network development | tee /app/blockchain/build/migration-output.txt

# Extract specific contract addresses from migration output
CCT_ADDRESS=$(grep -oP "(?<=Deploying 'CarbonCreditToken'.*contract address:\s*)0x[0-9a-fA-F]{40}" /app/blockchain/build/migration-output.txt | head -1)
PR_ADDRESS=$(grep -oP "(?<=Deploying 'ProjectRegistration'.*contract address:\s*)0x[0-9a-fA-F]{40}" /app/blockchain/build/migration-output.txt | head -1)

# Save to shared volume - this file is used by the healthcheck
echo "{\"CCT_ADDRESS\": \"$CCT_ADDRESS\", \"PR_ADDRESS\": \"$PR_ADDRESS\"}" > /app/blockchain/build/addresses.json

echo "Blockchain initialization complete!"

# Keep container running
tail -f /dev/null
