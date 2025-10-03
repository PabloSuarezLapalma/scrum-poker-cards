# Project Restructuring Guide

## New Directory Structure

The project has been reorganized to clearly separate frontend and backend:

```
scrum-poker-cards/
├── frontend/                  # Next.js Frontend Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── .env.local
│   └── README.md
│
├── backend/                   # Express + Socket.IO Backend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── render.yaml
│   └── README.md
│
├── docs/                      # Project Documentation
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── package.json              # Root package.json for monorepo scripts
├── .gitignore
└── README.md
```

## Manual Restructuring Steps

Since we need to preserve git history and move files properly, here are the steps:

### Step 1: Move Frontend Files

```bash
# Create frontend directory
mkdir frontend

# Move Next.js files to frontend
mv src frontend/
mv public frontend/
mv next.config.ts frontend/
mv next-env.d.ts frontend/
mv tsconfig.json frontend/
mv postcss.config.mjs frontend/
mv eslint.config.mjs frontend/
mv tailwindcss.config.js frontend/ # if exists

# Copy and modify package.json for frontend
# (We'll create a new one)
```

### Step 2: Move Backend Files

```bash
# Rename server to backend
mv server backend

# Backend is already properly structured
```

### Step 3: Move Documentation

```bash
# Create docs directory
mkdir docs

# Move documentation files
mv SETUP.md docs/
mv ARCHITECTURE.md docs/
mv IMPLEMENTATION.md docs/
mv INSTALL.md docs/
mv USAGE.md docs/
mv BACKEND_IMPLEMENTATION.md docs/
```

### Step 4: Update Root Files

The root directory should only contain:
- `package.json` (monorepo scripts)
- `.gitignore`
- `README.md`
- `.env.example` (template)
- `frontend/` directory
- `backend/` directory
- `docs/` directory

## Quick Migration Script

For faster migration, you can use this bash script:

```bash
#!/bin/bash

# Create directories
mkdir -p frontend backend docs

# Move frontend files
mv src public next.config.ts next-env.d.ts postcss.config.mjs eslint.config.mjs frontend/ 2>/dev/null

# Move backend (rename server)
if [ -d "server" ]; then
    mv server/* backend/
    rmdir server
fi

# Move docs
mv SETUP.md ARCHITECTURE.md IMPLEMENTATION.md INSTALL.md USAGE.md BACKEND_IMPLEMENTATION.md docs/ 2>/dev/null

echo "✅ Restructuring complete!"
echo "Next steps:"
echo "1. Update package.json files"
echo "2. Update import paths"
echo "3. Update environment variables"
echo "4. Test the application"
```

## After Restructuring

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Update environment variables:**
   - Frontend: `frontend/.env.local`
   - Backend: `backend/.env`

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Test everything works:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001/health

## Important Updates Needed

After moving files, you'll need to update:

1. ✅ Import paths in frontend code (should be automatic)
2. ✅ Package.json scripts in root
3. ✅ Environment variable references
4. ✅ Documentation links
5. ✅ Deployment configurations
6. ✅ .gitignore paths

## Benefits of New Structure

✅ **Clear Separation** - Frontend and backend are independent
✅ **Easy Deployment** - Deploy each part separately
✅ **Better Organization** - Documentation in one place
✅ **Scalable** - Easy to add more services
✅ **Professional** - Industry-standard monorepo structure
