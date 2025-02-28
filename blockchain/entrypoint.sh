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
ganache --mnemonic "$MNEMONIC" --detach

# Wait for Ganache
echo "Waiting for Ganache to start..."
until nc -zv localhost 8545; do
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
until nc -zv localhost 8545; do
  echo "Waiting for Ganache to be available..."
  sleep 2
done
echo "Ganache is up, running migrations..."

# Run migrations and save output
cd /app/blockchain
truffle migrate --network development | tee /app/blockchain/build/migration-output.txt

# Extract specific contract addresses using more compatible approach
echo "Extracting contract addresses..."
OUTPUT_FILE="/app/blockchain/build/migration-output.txt"

# Function to extract contract address from deployment section
extract_address() {
  local contract_name=$1
  local start_line=$(grep -n "Deploying '$contract_name'" $OUTPUT_FILE | cut -d ':' -f 1)
  
  if [ -z "$start_line" ]; then
    echo "Contract $contract_name deployment not found in output"
    return 1
  fi
  
  # Look for contract address within 20 lines after the deployment line
  local address=$(tail -n +$start_line $OUTPUT_FILE | head -n 20 | grep "contract address:" | head -n 1 | awk '{print $NF}')
  
  if [ -z "$address" ]; then
    echo "Could not find address for $contract_name"
    return 1
  fi
  
  echo "$address"
}

# Extract addresses for each contract
CCT_ADDRESS=$(extract_address "CarbonCreditToken")
PR_ADDRESS=$(extract_address "ProjectRegistration")

echo "Found addresses:"
echo "CCT_ADDRESS: $CCT_ADDRESS"
echo "PR_ADDRESS: $PR_ADDRESS"

# Save to shared volume - this file is used by the healthcheck
echo "{\"CCT_ADDRESS\": \"$CCT_ADDRESS\", \"PR_ADDRESS\": \"$PR_ADDRESS\"}" > /app/blockchain/build/addresses.json

echo "Blockchain initialization complete!"

# Keep container running
tail -f /dev/null
