# Installation Instructions

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Setup Environment Variables

**Root directory - Create `.env.local`:**
```bash
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:3001" > .env.local
```

**Server directory - Create `server/.env`:**
```bash
echo "PORT=3001" > server/.env
echo "NODE_ENV=development" >> server/.env
echo "FRONTEND_URL=http://localhost:3000" >> server/.env
```

### 3. Start Development
```bash
npm run dev
```

### 4. Open Browser
Visit: http://localhost:3000

## What Happens When You Run `npm run dev`

1. **Backend Server Starts** (Port 3001)
   - Express server with Socket.IO
   - Real-time WebSocket communication enabled
   - CORS configured for frontend

2. **Frontend Starts** (Port 3000)
   - Next.js development server
   - Hot reload enabled
   - Socket.IO client connects to backend

3. **You Can Now**:
   - Create rooms
   - Share room codes
   - See real-time updates across devices

## Verify Installation

### Check Backend Health
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### Check Frontend
Open browser to: http://localhost:3000

You should see the Scrum Poker welcome screen.

### Check WebSocket Connection
1. Open browser console (F12)
2. Look for: `"Socket connected"` or similar
3. No red errors should appear

## Common Issues

### "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "Cannot find module 'socket.io-client'"
```bash
npm install
```

### "Connection refused"
Make sure backend is running:
```bash
cd server
npm run dev
```

## Next Steps

✅ Installation complete!

Now read:
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [USAGE.md](./USAGE.md) - How to use the app
- [README.md](./README.md) - Full documentation
