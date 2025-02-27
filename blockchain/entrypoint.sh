#!/bin/bash
# Install netcat
apt-get update && apt-get install -y netcat-openbsd

# Copy blockchain directory instead of moving it
mkdir -p /app/blockchain
echo "Copying blockchain directory..."
cp -r /repo/blockchain/* /app/blockchain/

# Install global Truffle
npm install -g truffle

# Install blockchain dependencies from within the directory
echo "Installing blockchain dependencies..."
cd /app/blockchain
npm install
echo "Blockchain dependencies installed."

# Wait for Ganache
echo "Waiting for Ganache to start..."
while ! nc -z ganache 8545; do
  sleep 1
done
echo "Ganache is up, running migrations..."

# Run migrations and save output
truffle migrate --network development | tee /app/blockchain/build/migration-output.txt

# Extract specific contract addresses from migration output
CCT_ADDRESS=$(grep -oP "(?<=Deploying 'CarbonCreditToken'.*contract address:\s*)0x[0-9a-fA-F]{40}" /app/blockchain/build/migration-output.txt | head -1)
PR_ADDRESS=$(grep -oP "(?<=Deploying 'ProjectRegistration'.*contract address:\s*)0x[0-9a-fA-F]{40}" /app/blockchain/build/migration-output.txt | head -1)

# Save to shared volume
echo "{\"CCT_ADDRESS\": \"$CCT_ADDRESS\", \"PR_ADDRESS\": \"$PR_ADDRESS\"}" > /app/blockchain/build/addresses.json

# Keep container running
tail -f /dev/null
