#!/bin/bash

# Navigate to the frontend directory and install dependencies
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "Frontend dependencies installed."

# Navigate to the backend directory and install dependencies
cd ../backend
echo "Installing backend dependencies..."
npm install
echo "Backend dependencies installed."

# Navigate to the blockchain directory and install dependencies
cd ../blockchain
echo "Using nvm to set node version v18.20.5..."
nvm use v18.20.5
echo "Installing blockchain dependencies..."
npm install
echo "Blockchain dependencies installed."

# Generate AES encryption key
echo "Generating AES encryption key..."
AES_KEY=$(openssl rand -hex 32)
echo "AES_ENCRYPTION_KEY=$AES_KEY" > .env
echo "AES encryption key generated and stored in .env file."

echo "Setup complete!"
