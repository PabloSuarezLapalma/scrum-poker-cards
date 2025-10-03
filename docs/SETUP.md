# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

From the root directory:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

Or use the shortcut:
```bash
npm run install:all
```

### 2. Configure Environment Variables

#### Frontend Configuration
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

For production, set this to your deployed backend URL:
```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend.herokuapp.com
```

#### Backend Configuration
Create `server/.env` file:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

For production:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Start Development Servers

#### Option A: Start Both Servers Together (Recommended)
```bash
npm run dev
```

This runs both frontend and backend concurrently.

#### Option B: Start Servers Separately

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

### 4. Verify Setup

1. Open browser to [http://localhost:3000](http://localhost:3000)
2. Backend should be running on [http://localhost:3001](http://localhost:3001)
3. Check backend health: [http://localhost:3001/health](http://localhost:3001/health)

You should see the Scrum Poker login screen!

## 🧪 Testing the Setup

### Test Local Real-Time Sync

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Enter your name and click "Create Room"
3. Copy the room code
4. Open a new incognito/private window
5. Go to [http://localhost:3000](http://localhost:3000)
6. Click "Join Room" and enter the code
7. Both users should see each other in real-time!

### Test Multi-Device Sync

1. Get your local IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`
   
2. Update `server/.env`:
```env
FRONTEND_URL=http://your-ip:3000
```

3. Update `.env.local`:
```env
NEXT_PUBLIC_SOCKET_URL=http://your-ip:3001
```

4. Restart servers: `npm run dev`

5. On mobile/other device, visit: `http://your-ip:3000`

6. Join the same room and test!

## 🔧 Troubleshooting

### Frontend Can't Connect to Backend

**Problem**: Connection refused or CORS errors

**Solution**:
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `.env.local` has correct `NEXT_PUBLIC_SOCKET_URL`
3. Check `server/.env` has correct `FRONTEND_URL`
4. Restart both servers

### WebSocket Connection Failed

**Problem**: "WebSocket connection failed" in console

**Solution**:
1. Check backend logs for errors
2. Verify port 3001 is not in use: `netstat -ano | findstr :3001` (Windows) or `lsof -i :3001` (Mac/Linux)
3. Try using polling transport in browser console:
```javascript
localStorage.debug = 'socket.io-client:*'
```
4. Refresh page and check console logs

### Participants Not Syncing

**Problem**: Other users don't appear in the room

**Solution**:
1. Open browser console (F12) and check for errors
2. Verify both users joined the same room code
3. Check backend logs to see if both users connected
4. Test backend health endpoint: `http://localhost:3001/health`

### Port Already in Use

**Problem**: "Port 3000/3001 already in use"

**Solution**:

Windows:
```bash
# Find process on port
netstat -ano | findstr :3000
# Kill process
taskkill /PID <process-id> /F
```

Mac/Linux:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

Or change ports in environment files.

## 📦 Building for Production

### Build Everything
```bash
npm run build
```

This will:
1. Build the Next.js frontend → `.next/` folder
2. Build the backend TypeScript → `server/dist/` folder

### Test Production Build Locally
```bash
npm start
```

## 🌐 Deployment Checklist

### Frontend (Vercel/Netlify)
- [ ] Build passes: `npm run build:frontend`
- [ ] Environment variable set: `NEXT_PUBLIC_SOCKET_URL`
- [ ] Test connection to backend after deploy

### Backend (Heroku/Railway/Render)
- [ ] Build passes: `cd server && npm run build`
- [ ] Environment variables set: `PORT`, `FRONTEND_URL`, `NODE_ENV`
- [ ] WebSocket support enabled on platform
- [ ] Health check endpoint working

### CORS Configuration
- [ ] Backend `FRONTEND_URL` matches deployed frontend
- [ ] Frontend `NEXT_PUBLIC_SOCKET_URL` matches deployed backend
- [ ] Test cross-origin requests work

## 🎯 Next Steps

1. ✅ Setup complete? Try creating your first room!
2. 📖 Read [USAGE.md](./USAGE.md) for user guide
3. 🔍 Check [IMPLEMENTATION.md](./IMPLEMENTATION.md) for technical details
4. 🚀 Deploy to production when ready!

## 💡 Tips

- Use `concurrently` package (already installed) to run both servers
- Backend stores room state in memory - rooms persist until server restart
- Inactive participants are auto-removed after 30 seconds
- Rooms are cleaned up after 1 hour of inactivity
- Frontend auto-reconnects if connection drops

## 🆘 Still Having Issues?

1. Check all environment variables are set correctly
2. Ensure Node.js version is 18 or higher: `node --version`
3. Clear browser cache and try again
4. Check firewall isn't blocking ports 3000/3001
5. Try running each server individually to isolate the issue

Happy Planning! 🎴
