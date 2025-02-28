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

# Simple direct extraction approach based on the exact format
OUTPUT_FILE="/app/blockchain/build/migration-output.txt"

# Extract first contract address line after "Deploying 'CarbonCreditToken'"
CCT_LINE=$(cat $OUTPUT_FILE | awk '/Deploying .CarbonCreditToken./{flag=1;next}/contract address:/{if(flag){print $0;flag=0}}')
# Extract first contract address line after "Deploying 'ProjectRegistration'"
PR_LINE=$(cat $OUTPUT_FILE | awk '/Deploying .ProjectRegistration./{flag=1;next}/contract address:/{if(flag){print $0;flag=0}}')

# Extract just the address part
CCT_ADDRESS=$(echo "$CCT_LINE" | awk '{print $NF}')
PR_ADDRESS=$(echo "$PR_LINE" | awk '{print $NF}')

echo "Found addresses:"
echo "CCT_ADDRESS: $CCT_ADDRESS"
echo "PR_ADDRESS: $PR_ADDRESS"

# Verify addresses have been extracted correctly
if [[ ! $CCT_ADDRESS =~ 0x[0-9a-fA-F]{40} ]] || [[ ! $PR_ADDRESS =~ 0x[0-9a-fA-F]{40} ]]; then
    echo "WARNING: Contract addresses not extracted correctly"
    echo "CCT_LINE: $CCT_LINE"
    echo "PR_LINE: $PR_LINE"
    echo "Full output file:"
    cat $OUTPUT_FILE
    
    # As a fallback, try a simpler approach
    echo "Trying fallback approach..."
    CCT_ADDRESS=$(grep -A 5 "Deploying 'CarbonCreditToken'" $OUTPUT_FILE | grep "contract address:" | head -n 1 | awk '{print $NF}')
    PR_ADDRESS=$(grep -A 5 "Deploying 'ProjectRegistration'" $OUTPUT_FILE | grep "contract address:" | head -n 1 | awk '{print $NF}')
    
    echo "Fallback addresses:"
    echo "CCT_ADDRESS: $CCT_ADDRESS"
    echo "PR_ADDRESS: $PR_ADDRESS"
fi

# Save to shared volume - this file is used by the healthcheck
echo "{\"CCT_ADDRESS\": \"$CCT_ADDRESS\", \"PR_ADDRESS\": \"$PR_ADDRESS\"}" > /app/blockchain/build/addresses.json

echo "Blockchain initialization complete!"

# Keep container running
tail -f /dev/null
