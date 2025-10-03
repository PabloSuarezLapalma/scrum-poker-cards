#!/bin/bash

# Scrum Poker Project Restructuring Script
# This script reorganizes the project into frontend/backend structure

echo "🔄 Starting Project Restructuring..."
echo ""

# Create new directory structure
echo "📁 Creating directory structure..."
mkdir -p frontend backend docs

# Move frontend files
echo "📦 Moving frontend files..."
if [ -d "src" ]; then
    cp -r src frontend/ && rm -rf src || echo "Warning: Could not move src, try manually"
fi

if [ -d "public" ]; then
    mv public frontend/
fi

# Move Next.js config files
echo "⚙️  Moving Next.js configuration..."
mv next.config.ts frontend/ 2>/dev/null
mv next-env.d.ts frontend/ 2>/dev/null
mv postcss.config.mjs frontend/ 2>/dev/null
mv eslint.config.mjs frontend/ 2>/dev/null

# Copy and update package.json for frontend
if [ -f "frontend-package.json" ]; then
    mv frontend-package.json frontend/package.json
    echo "✅ Frontend package.json created"
fi

# Copy frontend tsconfig
if [ ! -f "frontend/tsconfig.json" ] && [ -f "tsconfig.json" ]; then
    cp tsconfig.json frontend/
    echo "✅ Frontend tsconfig.json copied"
fi

# Move backend (rename server to backend)
echo "🔧 Moving backend files..."
if [ -d "server" ]; then
    # Copy server contents to backend
    cp -r server/* backend/ 2>/dev/null
    
    # Update backend package.json if separate file exists
    if [ -f "backend-package.json" ]; then
        mv backend-package.json backend/package.json
        echo "✅ Backend package.json updated"
    fi
    
    # Move render.yaml to backend
    if [ -f "backend-render.yaml" ]; then
        mv backend-render.yaml backend/render.yaml
        echo "✅ Render configuration added"
    fi
    
    echo "✅ Backend directory created"
fi

# Move documentation
echo "📚 Moving documentation..."
mv SETUP.md docs/ 2>/dev/null
mv ARCHITECTURE.md docs/ 2>/dev/null
mv IMPLEMENTATION.md docs/ 2>/dev/null
mv INSTALL.md docs/ 2>/dev/null
mv USAGE.md docs/ 2>/dev/null
mv BACKEND_IMPLEMENTATION.md docs/ 2>/dev/null

# Move environment templates
echo "🔐 Setting up environment templates..."
if [ -f "frontend-.env.example" ]; then
    mv frontend-.env.example frontend/.env.example
    echo "✅ Frontend .env.example created"
fi

if [ -f "backend-.env.example" ]; then
    mv backend-.env.example backend/.env.example
    echo "✅ Backend .env.example created"
fi

# Create local env files from examples
if [ -f "frontend/.env.example" ] && [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Frontend .env.local created (edit with your values)"
fi

if [ -f "backend/.env.example" ] && [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Backend .env created (edit with your values)"
fi

# Update root package.json
if [ -f "package-new.json" ]; then
    mv package-new.json package.json
    echo "✅ Root package.json updated"
fi

# Clean up old files
echo "🧹 Cleaning up..."
rm -rf server 2>/dev/null
rm -f .env.local .env.example 2>/dev/null

# Create README files for each directory
echo "📝 Creating README files..."

cat > frontend/README.md << 'EOF'
# Frontend - Scrum Poker

Next.js application for Scrum Poker planning.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env.local` and update:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

For production, set this to your Render backend URL.

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

See ../DEPLOYMENT.md for detailed instructions.
EOF

cat > backend/README.md << 'EOF'
# Backend - Scrum Poker

Express + Socket.IO server for real-time collaboration.

## Development

```bash
npm install
npm run dev
```

Server runs on http://localhost:3001

## Environment Variables

Copy `.env.example` to `.env` and update:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Deployment to Render

See ../DEPLOYMENT.md for detailed Render deployment instructions.

The server will automatically deploy when you push to GitHub if connected to Render.
EOF

cat > docs/README.md << 'EOF'
# Documentation

## Getting Started
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Installation](./INSTALL.md) - Quick installation guide

## Usage
- [User Guide](./USAGE.md) - How to use the application

## Technical
- [Architecture](./ARCHITECTURE.md) - System architecture overview
- [Implementation](./IMPLEMENTATION.md) - Implementation details
- [Backend Implementation](./BACKEND_IMPLEMENTATION.md) - Backend specifics

## Deployment
- [Deployment Guide](../DEPLOYMENT.md) - Deploy to Render + Vercel
EOF

echo ""
echo "✅ Restructuring complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Review the new structure:"
echo "     - frontend/  (Next.js app)"
echo "     - backend/   (Express + Socket.IO)"
echo "     - docs/      (Documentation)"
echo ""
echo "  2. Install dependencies:"
echo "     npm run install:all"
echo ""
echo "  3. Update environment variables:"
echo "     - Edit frontend/.env.local"
echo "     - Edit backend/.env"
echo ""
echo "  4. Start development servers:"
echo "     npm run dev"
echo ""
echo "  5. Test the application:"
echo "     - Frontend: http://localhost:3000"
echo "     - Backend:  http://localhost:3001/health"
echo ""
echo "  6. Read DEPLOYMENT.md for production deployment"
echo ""
echo "🎉 Happy coding!"
