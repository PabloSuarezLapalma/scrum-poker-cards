# Scrum Poker Project Restructuring Script (PowerShell)
# This script reorganizes the project into frontend/backend structure

Write-Host "🔄 Starting Project Restructuring..." -ForegroundColor Cyan
Write-Host ""

# Create new directory structure
Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "frontend", "backend", "docs" | Out-Null

# Move frontend files
Write-Host "📦 Moving frontend files..." -ForegroundColor Yellow
if (Test-Path "src") {
    Move-Item -Path "src" -Destination "frontend/" -Force
}

if (Test-Path "public") {
    Move-Item -Path "public" -Destination "frontend/" -Force
}

# Move Next.js config files
Write-Host "⚙️  Moving Next.js configuration..." -ForegroundColor Yellow
@("next.config.ts", "next-env.d.ts", "postcss.config.mjs", "eslint.config.mjs") | ForEach-Object {
    if (Test-Path $_) {
        Move-Item -Path $_ -Destination "frontend/" -Force -ErrorAction SilentlyContinue
    }
}

# Copy and update package.json for frontend
if (Test-Path "frontend-package.json") {
    Move-Item -Path "frontend-package.json" -Destination "frontend/package.json" -Force
    Write-Host "✅ Frontend package.json created" -ForegroundColor Green
}

# Copy frontend tsconfig
if (-not (Test-Path "frontend/tsconfig.json") -and (Test-Path "tsconfig.json")) {
    Copy-Item -Path "tsconfig.json" -Destination "frontend/" -Force
    Write-Host "✅ Frontend tsconfig.json copied" -ForegroundColor Green
}

# Move backend (rename server to backend)
Write-Host "🔧 Moving backend files..." -ForegroundColor Yellow
if (Test-Path "server") {
    # Copy server contents to backend
    Get-ChildItem -Path "server" -Recurse | ForEach-Object {
        $dest = $_.FullName.Replace("server", "backend")
        if ($_.PSIsContainer) {
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
        } else {
            Copy-Item -Path $_.FullName -Destination $dest -Force
        }
    }
    
    # Update backend package.json if separate file exists
    if (Test-Path "backend-package.json") {
        Move-Item -Path "backend-package.json" -Destination "backend/package.json" -Force
        Write-Host "✅ Backend package.json updated" -ForegroundColor Green
    }
    
    # Move render.yaml to backend
    if (Test-Path "backend-render.yaml") {
        Move-Item -Path "backend-render.yaml" -Destination "backend/render.yaml" -Force
        Write-Host "✅ Render configuration added" -ForegroundColor Green
    }
    
    Write-Host "✅ Backend directory created" -ForegroundColor Green
}

# Move documentation
Write-Host "📚 Moving documentation..." -ForegroundColor Yellow
@("SETUP.md", "ARCHITECTURE.md", "IMPLEMENTATION.md", "INSTALL.md", "USAGE.md", "BACKEND_IMPLEMENTATION.md") | ForEach-Object {
    if (Test-Path $_) {
        Move-Item -Path $_ -Destination "docs/" -Force -ErrorAction SilentlyContinue
    }
}

# Move environment templates
Write-Host "🔐 Setting up environment templates..." -ForegroundColor Yellow
if (Test-Path "frontend-.env.example") {
    Move-Item -Path "frontend-.env.example" -Destination "frontend/.env.example" -Force
    Write-Host "✅ Frontend .env.example created" -ForegroundColor Green
}

if (Test-Path "backend-.env.example") {
    Move-Item -Path "backend-.env.example" -Destination "backend/.env.example" -Force
    Write-Host "✅ Backend .env.example created" -ForegroundColor Green
}

# Create local env files from examples
if ((Test-Path "frontend/.env.example") -and -not (Test-Path "frontend/.env.local")) {
    Copy-Item -Path "frontend/.env.example" -Destination "frontend/.env.local" -Force
    Write-Host "✅ Frontend .env.local created (edit with your values)" -ForegroundColor Green
}

if ((Test-Path "backend/.env.example") -and -not (Test-Path "backend/.env")) {
    Copy-Item -Path "backend/.env.example" -Destination "backend/.env" -Force
    Write-Host "✅ Backend .env created (edit with your values)" -ForegroundColor Green
}

# Update root package.json
if (Test-Path "package-new.json") {
    Move-Item -Path "package-new.json" -Destination "package.json" -Force
    Write-Host "✅ Root package.json updated" -ForegroundColor Green
}

# Clean up old files
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
if (Test-Path "server") {
    Remove-Item -Path "server" -Recurse -Force -ErrorAction SilentlyContinue
}
Remove-Item -Path ".env.local", ".env.example" -Force -ErrorAction SilentlyContinue

# Create README files
Write-Host "📝 Creating README files..." -ForegroundColor Yellow

@"
# Frontend - Scrum Poker

Next.js application for Scrum Poker planning.

## Development

``````bash
npm install
npm run dev
``````

Open http://localhost:3000

## Environment Variables

Copy ``.env.example`` to ``.env.local`` and update:

``````env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
``````

For production, set this to your Render backend URL.

## Deployment

Deploy to Vercel:

``````bash
vercel --prod
``````

See ../DEPLOYMENT.md for detailed instructions.
"@ | Out-File -FilePath "frontend/README.md" -Encoding UTF8

@"
# Backend - Scrum Poker

Express + Socket.IO server for real-time collaboration.

## Development

``````bash
npm install
npm run dev
``````

Server runs on http://localhost:3001

## Environment Variables

Copy ``.env.example`` to ``.env`` and update:

``````env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
``````

## Deployment to Render

See ../DEPLOYMENT.md for detailed Render deployment instructions.

The server will automatically deploy when you push to GitHub if connected to Render.
"@ | Out-File -FilePath "backend/README.md" -Encoding UTF8

@"
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
"@ | Out-File -FilePath "docs/README.md" -Encoding UTF8

Write-Host ""
Write-Host "✅ Restructuring complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Review the new structure:"
Write-Host "     - frontend/  (Next.js app)"
Write-Host "     - backend/   (Express + Socket.IO)"
Write-Host "     - docs/      (Documentation)"
Write-Host ""
Write-Host "  2. Install dependencies:"
Write-Host "     npm run install:all"
Write-Host ""
Write-Host "  3. Update environment variables:"
Write-Host "     - Edit frontend/.env.local"
Write-Host "     - Edit backend/.env"
Write-Host ""
Write-Host "  4. Start development servers:"
Write-Host "     npm run dev"
Write-Host ""
Write-Host "  5. Test the application:"
Write-Host "     - Frontend: http://localhost:3000"
Write-Host "     - Backend:  http://localhost:3001/health"
Write-Host ""
Write-Host "  6. Read DEPLOYMENT.md for production deployment"
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Yellow
