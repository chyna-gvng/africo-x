#!/bin/bash
set -e

# Copy frontend directory instead of moving it
mkdir -p /app/frontend
echo "Copying frontend directory..."
cp -r /repo/frontend/* /app/frontend/

# Install frontend dependencies from within the directory
echo "Installing frontend dependencies..."
cd /app/frontend
npm install --silent
echo "Frontend dependencies installed."

# Start the frontend
cd /app/frontend
echo "Starting frontend development server..."
npm run dev -- --host 0.0.0.0
