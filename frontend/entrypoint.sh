#!/bin/bash

# Move frontend directory as a whole
mkdir -p /app
mv -r /repo/frontend /app/

# Install frontend dependencies from within the directory
echo "Installing frontend dependencies..."
cd /app/frontend
npm install
echo "Frontend dependencies installed."

# Start the frontend
cd /app/frontend
npm run dev -- --host 0.0.0.0
