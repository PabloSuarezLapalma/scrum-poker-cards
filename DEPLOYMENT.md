# Deployment Guide - Render + Vercel

This guide covers deploying the Scrum Poker application with:
- **Backend** on Render (WebSocket support)
- **Frontend** on Vercel (optimized for Next.js)

## Overview

```
Frontend (Vercel)          Backend (Render)
  Next.js App      <--->    Express + Socket.IO
  Port: 3000                Port: 10000 (Render default)
```

---

## Part 1: Deploy Backend to Render

### Prerequisites
- GitHub/GitLab repository
- Render account (free tier available)

### Step 1: Prepare Backend for Deployment

1. **Ensure backend has proper structure:**
   ```
   backend/
   ├── src/
   ├── package.json
   ├── tsconfig.json
   ├── .env.example
   └── render.yaml (optional)
   ```

2. **Verify package.json has correct scripts:**
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/index.js"
     }
   }
   ```

3. **Push to repository:**
   ```bash
   git add backend/
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

### Step 2: Create Render Web Service

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your repository**
   - Select your GitHub/GitLab repository
   - Click "Connect"

4. **Configure the service:**

   | Setting | Value |
   |---------|-------|
   | **Name** | `scrum-poker-backend` |
   | **Region** | Choose closest to your users |
   | **Branch** | `main` or `master` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | Free |

5. **Add Environment Variables:**

   Click "Advanced" → "Add Environment Variable":

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Required |
   | `PORT` | `10000` | Render's default (auto-set) |
   | `FRONTEND_URL` | `http://localhost:3000` | Update after frontend deploy |

   > **Note:** We'll update `FRONTEND_URL` after deploying the frontend.

6. **Configure Health Check:**
   - Health Check Path: `/health`
   - This ensures your service stays alive

7. **Click "Create Web Service"**

### Step 3: Wait for Deployment

- Render will:
  1. Clone your repository
  2. Install dependencies
  3. Build TypeScript → JavaScript
  4. Start the server
  5. Assign a URL like: `https://scrum-poker-backend-abc123.onrender.com`

- Check logs for "Server running on port 10000"

### Step 4: Test Backend

1. **Get your backend URL** from Render dashboard
2. **Test health endpoint:**
   ```bash
   curl https://your-backend.onrender.com/health
   ```
   
   Should return:
   ```json
   {"status":"ok","timestamp":"2025-10-02T..."}
   ```

3. **Verify WebSocket works:**
   - Open browser console on any page
   - Run:
   ```javascript
   const socket = io('https://your-backend.onrender.com');
   socket.on('connect', () => console.log('Connected!'));
   ```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. **Update environment variables:**
   
   Create/update `frontend/.env.production`:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   ```
   
   Replace with your actual Render URL from Part 1.

2. **Commit changes:**
   ```bash
   git add frontend/.env.production
   git commit -m "Add production environment variables"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended for first deploy)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New..." → "Project"**

3. **Import your repository**

4. **Configure Project:**

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | `Next.js` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` (auto-detected) |
   | **Output Directory** | `.next` (auto-detected) |

5. **Add Environment Variables:**

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SOCKET_URL` | `https://your-backend.onrender.com` |

   Replace with your actual Render URL.

6. **Click "Deploy"**

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: scrum-poker-frontend
# - Directory: ./ (current)
# - Override settings? No

# Set environment variable
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Enter: https://your-backend.onrender.com
```

### Step 3: Get Frontend URL

After deployment, Vercel will provide a URL like:
```
https://scrum-poker-abc123.vercel.app
```

---

## Part 3: Connect Frontend and Backend

### Update Backend CORS

1. **Go back to Render Dashboard**

2. **Open your backend service** → "Environment"

3. **Update `FRONTEND_URL` environment variable:**
   ```
   https://scrum-poker-abc123.vercel.app
   ```
   
   Or multiple origins (comma-separated):
   ```
   https://scrum-poker-abc123.vercel.app,http://localhost:3000
   ```

4. **Click "Save Changes"**

5. **Render will automatically redeploy** your backend

### Test the Connection

1. **Open your frontend URL** in a browser
2. **Open browser console** (F12)
3. **Look for:** `"Socket connected"` or similar message
4. **No CORS errors** should appear

5. **Test full flow:**
   - Create a room
   - Copy room code
   - Open in incognito/another device
   - Join the same room
   - Both users should see each other in real-time!

---

## Configuration Summary

### Backend (Render)

**URL:** `https://your-backend.onrender.com`

**Environment Variables:**
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app
```

**Health Check:** `/health`

### Frontend (Vercel)

**URL:** `https://your-frontend.vercel.app`

**Environment Variables:**
```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

---

## Free Tier Limitations

### Render Free Tier
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes ~30 seconds
- ✅ Custom domains supported
- ✅ Automatic HTTPS

**Tip:** Keep service alive with uptime monitors (UptimeRobot, Pingdom)

### Vercel Free Tier
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Edge network CDN
- ✅ Custom domains

---

## Custom Domains (Optional)

### Add Custom Domain to Backend (Render)

1. Go to service → "Settings" → "Custom Domain"
2. Add: `api.yourdomain.com`
3. Update DNS records as shown
4. Update frontend `.env.production`:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
   ```

### Add Custom Domain to Frontend (Vercel)

1. Go to project → "Settings" → "Domains"
2. Add: `yourdomain.com` or `app.yourdomain.com`
3. Update DNS records as shown
4. Update backend `FRONTEND_URL` on Render

---

## Troubleshooting

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check `FRONTEND_URL` in Render includes your Vercel URL
2. Must include protocol: `https://`
3. No trailing slash
4. For multiple origins, comma-separate

### WebSocket Connection Failed

**Problem:** "WebSocket connection to 'wss://...' failed"

**Solution:**
1. Verify backend is running (check `/health`)
2. Render free tier may be sleeping - wait 30s
3. Check browser console for specific errors
4. Verify `NEXT_PUBLIC_SOCKET_URL` is correct

### Backend Sleeping (Render Free Tier)

**Problem:** First request takes 30+ seconds

**Solutions:**
1. **Upgrade to paid plan** ($7/month for always-on)
2. **Use uptime monitor:** 
   - [UptimeRobot](https://uptimerobot.com/) (free)
   - Ping `/health` every 5 minutes
3. **Show loading state** in frontend while connecting

### Environment Variable Not Working

**Problem:** Changes not reflected

**Solution:**
1. Clear browser cache
2. Redeploy frontend: `vercel --prod`
3. Check Vercel dashboard → "Environment Variables"
4. For backend, Render auto-redeploys on env change

---

## Monitoring

### Backend Health

```bash
# Check if backend is responding
curl https://your-backend.onrender.com/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### Logs

**Render:**
- Dashboard → Your Service → "Logs"
- Real-time log streaming
- Filter by date/severity

**Vercel:**
- Dashboard → Your Project → "Logs"
- Function logs and errors
- Real-time monitoring

---

## Continuous Deployment

### Automatic Deploys

Both Render and Vercel support automatic deployment:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Render automatically:**
   - Detects changes in `/backend`
   - Builds and deploys
   - ~2-3 minutes

3. **Vercel automatically:**
   - Detects changes in `/frontend`
   - Builds and deploys
   - ~1-2 minutes

### Branch Previews (Vercel)

- Every PR gets a preview URL
- Test changes before merging
- Automatic cleanup after merge

---

## Cost Optimization

### Stay on Free Tier

1. **Backend (Render):**
   - Single service = Free
   - Use uptime monitor to keep alive
   - Or accept 30s cold start

2. **Frontend (Vercel):**
   - Single project = Free
   - 100GB bandwidth is generous
   - Monitor usage in dashboard

### When to Upgrade

**Render Paid ($7/month):**
- Need always-on backend
- Multiple services
- More RAM/CPU

**Vercel Pro ($20/month):**
- Exceed 100GB bandwidth
- Need advanced analytics
- Team collaboration

---

## Security Checklist

- [x] HTTPS enabled (automatic on both platforms)
- [x] CORS configured correctly
- [x] Environment variables set
- [x] No secrets in code
- [x] Health check enabled
- [ ] Add rate limiting (optional)
- [ ] Add authentication (optional)
- [ ] Set up monitoring alerts

---

## Next Steps

1. ✅ **Test thoroughly** with multiple users
2. ✅ **Monitor logs** for first few days
3. ✅ **Set up uptime monitoring** (if using free Render)
4. 📱 **Test on mobile devices**
5. 🎨 **Customize branding**
6. 📊 **Add analytics** (optional)

---

## Quick Reference

### Redeploy Backend
```bash
git add backend/
git commit -m "Backend changes"
git push origin main
# Render auto-deploys in ~2-3 minutes
```

### Redeploy Frontend
```bash
cd frontend
vercel --prod
# Or push to GitHub for automatic deployment
```

### Update Environment Variable
```bash
# Vercel
cd frontend
vercel env add NEXT_PUBLIC_SOCKET_URL production

# Render
# Use dashboard → Environment → Edit
```

---

**🎉 Congratulations! Your Scrum Poker app is now live!**

Share your Vercel URL with your team and start planning!
