#!/bin/bash
set -e

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
npm install --silent
echo "Blockchain dependencies installed."

# Generate Mnemonic
echo "Generating mnemonic..."
MNEMONIC=$(openssl rand -hex 16 | node -e "const bip39 = require('bip39'); process.stdin.on('data', data => console.log(bip39.entropyToMnemonic(data.toString().trim())));")

# Print mnemonic
echo "Mnemonic: $MNEMONIC"
mkdir -p /app/blockchain/build
# Save mnemonic to shared volume - this file is used by the healthcheck
echo $MNEMONIC > /app/blockchain/build/mnemonic.txt

# Start Ganache
echo "Starting Ganache..."
ganache --mnemonic "$MNEMONIC" --host 0.0.0.0 --port 8545 --detach

# Wait for Ganache
echo "Waiting for Ganache to start..."
until nc -z localhost 8545 || nc -z 127.0.0.1 8545; do
  echo "Waiting for Ganache to be available..."
  sleep 2
done
echo "Ganache is up, running migrations..."

# Run migrations and save output
cd /app/blockchain
truffle migrate --network development | tee /app/blockchain/build/migration-output.txt

# Extract specific contract addresses from migration output
CCT_ADDRESS=$(grep -oP "(?<=Deploying 'CarbonCreditToken'.*contract address:\s*)0x[0-9a-fA-F]{40}" /app/blockchain/build/migration-output.txt | head -1)
PR_ADDRESS=$(grep -oP "(?<=Deploying 'ProjectRegistration'.*contract address:\s*)0x[0-9a-fA-F]{40}" /app/blockchain/build/migration-output.txt | head -1)

# Save to shared volume - this file is used by the healthcheck
echo "{\"CCT_ADDRESS\": \"$CCT_ADDRESS\", \"PR_ADDRESS\": \"$PR_ADDRESS\"}" > /app/blockchain/build/addresses.json

echo "Blockchain initialization complete!"

# Keep container running
tail -f /dev/null
