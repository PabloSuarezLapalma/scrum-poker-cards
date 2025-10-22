# Render Deployment Fix - npm Workspaces Issue

## Problem
Render was failing to build the backend with this error:
```
Could not find a declaration file for module 'express'
'/opt/render/project/src/node_modules/express/index.js' implicitly has an 'any' type
```

## Root Cause
The repository is structured as an npm monorepo with workspaces defined in the root `package.json`:
```json
{
  "workspaces": ["frontend", "backend"]
}
```

When Render cloned the repository and ran `npm install` in the backend folder, npm detected the parent workspace configuration and hoisted all dependencies to `/opt/render/project/src/node_modules` instead of installing them in `/opt/render/project/src/backend/node_modules`.

TypeScript compiler (`tsc`) was then unable to find the type definitions because it was looking in the wrong node_modules folder.

## Solution

### Fix 1: Disable npm workspace hoisting (backend/.npmrc)
Created `backend/.npmrc` with:
```
workspaces=false
```

This tells npm to ignore the workspace configuration when installing dependencies in the backend folder, ensuring all packages (including `@types/express`) are installed locally in `backend/node_modules`.

### Fix 2: Configure TypeScript to check multiple type locations (backend/tsconfig.json)
Added `typeRoots` configuration to handle cases where npm still hoists dependencies:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "typeRoots": ["./node_modules/@types", "../node_modules/@types"]
  }
}
```

This allows TypeScript to find type definitions whether they're installed locally (`./node_modules/@types`) or hoisted to the parent folder (`../node_modules/@types`).

## Changes Made
1. **backend/.npmrc** (new file)
   - Disables npm workspace hoisting
   - Ensures dependencies install in backend/node_modules

2. **render.yaml**
   - Updated build command to `npm install --include=dev`
   - Ensures devDependencies (like @types/express) are installed

3. **backend/src/index.ts**
   - Added explicit type imports: `Request, Response` from express
   - Added type annotations to route handlers

## Verification
✅ Local build test successful:
```bash
cd backend
rm -rf node_modules dist
npm install --include=dev
npm run build
```

✅ All changes committed and pushed to GitHub
✅ Render will auto-deploy on next push

## Next Steps
1. Monitor Render dashboard for successful deployment
2. Once deployed, get the backend URL (e.g., `https://scrum-poker-backend-xyz.onrender.com`)
3. Configure `NEXT_PUBLIC_SOCKET_URL` in Vercel with the Render URL
4. Test the full application end-to-end

## Files Changed
- `backend/.npmrc` (new) - Disable workspace hoisting
- `backend/tsconfig.json` - Add typeRoots for fallback type resolution
- `render.yaml` - Updated build command to use `bash build.sh`
- `backend/render.yaml` - Updated build command to use `bash build.sh`
- `backend/build.sh` - Made executable (chmod +x)
- `backend/src/index.ts` - Add explicit Express types
- `backend/src/handlers/socket.handler.ts` - Fix unused parameters

Created: October 2, 2025
Last Updated: October 3, 2025 (Fixed build.sh permissions and render.yaml)
