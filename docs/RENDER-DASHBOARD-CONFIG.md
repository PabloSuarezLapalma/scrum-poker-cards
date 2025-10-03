# Render Dashboard Configuration Guide

## If Build Still Fails After Pushing Latest Changes

The issue might be that **Render has cached the build command in the dashboard**, which overrides the `render.yaml` file.

### Steps to Fix in Render Dashboard:

1. **Go to your Render dashboard**
   - Navigate to https://dashboard.render.com
   - Select your `scrum-poker-backend` service

2. **Go to Settings**
   - Click on the "Settings" tab in the left sidebar

3. **Update the Build Command**
   - Find the "Build Command" field
   - **Change it to:** `bash build.sh`
   - Click "Save Changes"

4. **Verify Environment Variables**
   - Scroll to "Environment Variables"
   - Make sure `NODE_ENV` is NOT set to `production` (or remove it)
   - If it is set, change it to `development` or remove the variable
   - **Reason:** When `NODE_ENV=production`, npm skips devDependencies by default

5. **Manual Deploy**
   - Go to the "Manual Deploy" section
   - Click "Clear build cache & deploy"
   - This ensures no cached configuration interferes

### Alternative: If Build Command Can't Be Changed

If you can't change the build command in the dashboard, update it to:

```bash
npm install --include=dev && npm run build
```

This explicitly tells npm to install devDependencies even in production mode.

### Why This Is Happening

Render caches the build command from:
1. **First priority:** Dashboard settings (manual configuration)
2. **Second priority:** `render.yaml` file in the repository

If you configured the build command manually in the dashboard before adding `render.yaml`, the dashboard setting takes precedence and overrides the YAML file.

### Verify the Fix

After deploying, check the build logs for:
```
Installing dependencies including devDependencies...
added XX packages, and audited XX packages
```

If you see `@types/express` in the installed packages, the fix worked!

### Quick Test Commands

If you want to test the deployment locally before pushing:

```bash
# Navigate to backend folder
cd backend

# Clean install (simulates Render environment)
rm -rf node_modules dist
npm install --include=dev
npm run build

# Should complete without errors
```

---

## Contact Information

If none of these solutions work, you may need to:
1. Delete the service on Render
2. Create a new service
3. Ensure it uses `render.yaml` from the start (don't manually configure build command)

This ensures no cached configuration interferes with your deployment.
