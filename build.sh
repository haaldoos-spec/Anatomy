#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install
npm run build
cd ..

echo "Installing frontend dependencies..."
npm install
npm run build

echo "Build complete!"
