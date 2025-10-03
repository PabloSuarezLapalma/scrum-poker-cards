# Migration Checklist - Frontend/Backend Separation

Use this checklist to ensure you've completed all steps of the restructuring process.

## ✅ Pre-Migration

- [ ] Backup your current project
  ```bash
  git add .
  git commit -m "Backup before restructuring"
  git push
  ```
- [ ] Review current structure
- [ ] Read RESTRUCTURE.md
- [ ] Have Node.js >= 18.0.0 installed

## 📁 Directory Restructuring

- [ ] Run restructuring script:
  - **Windows**: `./restructure.ps1`
  - **Mac/Linux**: `bash restructure.sh`
- [ ] Verify new structure:
  ```
  ├── frontend/
  ├── backend/
  ├── docs/
  └── package.json (root)
  ```
- [ ] Old `server/` directory removed
- [ ] Old `/src` moved to `frontend/src`
- [ ] Documentation moved to `docs/`

## 📦 Package Configuration

- [ ] Root `package.json` updated with monorepo scripts
- [ ] Frontend `package.json` created in `frontend/`
- [ ] Backend `package.json` exists in `backend/`
- [ ] All package.json files have correct scripts

## 🔐 Environment Variables

### Frontend
- [ ] `frontend/.env.example` exists
- [ ] `frontend/.env.local` created and configured
- [ ] `NEXT_PUBLIC_SOCKET_URL` set to `http://localhost:3001`
- [ ] Production URL documented for later

### Backend
- [ ] `backend/.env.example` exists
- [ ] `backend/.env` created and configured
- [ ] `PORT=3001` set
- [ ] `NODE_ENV=development` set
- [ ] `FRONTEND_URL=http://localhost:3000` set

## 🔧 Configuration Files

- [ ] `backend/render.yaml` created for Render deployment
- [ ] `frontend/next.config.ts` moved correctly
- [ ] `frontend/tsconfig.json` exists
- [ ] `backend/tsconfig.json` exists
- [ ] `.gitignore` updated for new structure

## 📚 Documentation

- [ ] README.md updated with new structure
- [ ] DEPLOYMENT.md created with Render/Vercel instructions
- [ ] RESTRUCTURE.md available for reference
- [ ] `frontend/README.md` created
- [ ] `backend/README.md` created
- [ ] `docs/README.md` created
- [ ] All documentation links updated

## 🧪 Testing

### Installation
- [ ] Run: `npm run install:all`
- [ ] No errors during installation
- [ ] `node_modules` exists in root, frontend, and backend

### Development Servers
- [ ] Run: `npm run dev`
- [ ] Frontend starts on http://localhost:3000
- [ ] Backend starts on http://localhost:3001
- [ ] No console errors

### Backend Health Check
- [ ] Visit: http://localhost:3001/health
- [ ] Returns: `{"status":"ok","timestamp":"..."}`

### Frontend Loading
- [ ] Visit: http://localhost:3000
- [ ] Page loads correctly
- [ ] No console errors
- [ ] Login screen appears

### Real-Time Functionality
- [ ] Create a room
- [ ] Get room code
- [ ] Open incognito window
- [ ] Join with room code
- [ ] Both users see each other
- [ ] Select card in one browser
- [ ] Card appears in other browser
- [ ] Reveal cards works
- [ ] New round resets votes

### WebSocket Connection
- [ ] Check browser console for "Socket connected"
- [ ] No WebSocket errors
- [ ] No CORS errors

## 🌐 Render Deployment Preparation

- [ ] GitHub repository up to date
- [ ] `backend/render.yaml` configured
- [ ] Backend `package.json` has:
  - `"build": "tsc"`
  - `"start": "node dist/index.js"`
- [ ] `.gitignore` doesn't exclude `backend/dist` (Render needs it)
- [ ] Render account created
- [ ] Credit card added to Render (required even for free tier)

## 🚀 Vercel Deployment Preparation

- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] No build errors
- [ ] Production environment variables documented

## 📋 Post-Migration Cleanup

- [ ] Remove old files:
  - [ ] `package-new.json`
  - [ ] `frontend-package.json`
  - [ ] `backend-package.json`
  - [ ] `backend-render.yaml`
  - [ ] `frontend-.env.example`
  - [ ] `backend-.env.example`
- [ ] Rename `README-NEW.md` to `README.md`
- [ ] Update any absolute import paths if needed
- [ ] Test all functionality again

## 🔄 Git Commit

- [ ] Stage all changes:
  ```bash
  git add .
  ```
- [ ] Commit with clear message:
  ```bash
  git commit -m "Restructure project: separate frontend and backend"
  ```
- [ ] Push to repository:
  ```bash
  git push origin main
  ```

## 📖 Team Communication

- [ ] Update team about new structure
- [ ] Share updated setup instructions
- [ ] Document new environment variables needed
- [ ] Update CI/CD pipelines if any
- [ ] Update deployment documentation

## 🎯 Deployment (When Ready)

### Backend to Render
- [ ] Connect Render to GitHub repository
- [ ] Configure service with `backend` root directory
- [ ] Set environment variables on Render
- [ ] Deploy and test
- [ ] Get Render URL (e.g., `https://app.onrender.com`)
- [ ] Verify health check works

### Frontend to Vercel
- [ ] Update `frontend/.env.production` with Render URL
- [ ] Deploy to Vercel: `cd frontend && vercel --prod`
- [ ] Get Vercel URL (e.g., `https://app.vercel.app`)
- [ ] Test production deployment

### Connect Frontend ↔ Backend
- [ ] Update Render `FRONTEND_URL` with Vercel URL
- [ ] Verify CORS works
- [ ] Test end-to-end functionality
- [ ] Check WebSocket connection on production

## ✅ Final Verification

- [ ] Development environment works
- [ ] Production deployment successful
- [ ] Real-time sync works in production
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Documentation complete
- [ ] Team informed

## 📝 Notes

Add any project-specific notes or issues encountered:

```
- 
- 
- 
```

---

## 🆘 Troubleshooting

If you encounter issues, refer to:
- [docs/SETUP.md](./docs/SETUP.md) - Setup troubleshooting
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment issues
- [RESTRUCTURE.md](./RESTRUCTURE.md) - Restructuring guide

---

**Date Completed**: _________________

**Verified By**: _________________

**Production URLs**:
- Frontend: _______________________________
- Backend: ________________________________
