#!/bin/bash
# No additional tools needed

# Move frontend directory as a whole
mkdir -p /app
mv /repo/frontend /app/

# Install frontend dependencies from within the directory
echo "Installing frontend dependencies..."
cd /app/frontend
npm install
echo "Frontend dependencies installed."

# Start the frontend
cd /app/frontend
npm run dev
