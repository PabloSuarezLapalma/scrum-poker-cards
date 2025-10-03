#!/bin/bash
# Build script for Render deployment
# This ensures devDependencies are installed even if NODE_ENV=production

echo "Installing dependencies including devDependencies..."
npm install --include=dev

echo "Running TypeScript build..."
npm run build

echo "Build complete!"
