# 🃏 Scrum Poker Cards

A modern, real-time collaborative Scrum poker planning application with no login required. Features a dark UNO-inspired theme with WebSocket-based real-time synchronization.

[![Deploy Backend](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

## ✨ Features

### 🌐 Real-Time Collaboration
- **WebSocket Communication**: True real-time sync using Socket.IO across different devices and networks
- **Room-Based Sessions**: Create or join rooms with unique 6-character codes
- **Auto-Join**: Users automatically join the session when they enter
- **Live Presence**: Participants are removed automatically after 30 seconds of inactivity
- **Cross-Device Sync**: Works across any device - phones, tablets, desktops
- **Instant Updates**: See votes, participants, and settings update in real-time
- **Auto Reconnection**: Automatically reconnects if connection is lost

### 🎴 Multiple Card Scales
- **Fibonacci**: 0, 1, 2, 3, 5, 8, 13, 21, ?, ☕
- **Powers of 2**: 0, 1, 2, 4, 8, 16, 32, 64, ?, ☕
- **T-Shirt Sizes**: XS, S, M, L, XL, XXL, ?, ☕
- **Custom Scale**: Create your own card values with add/remove functionality

### 👥 Collaborative Planning
- Virtual planning table with participants arranged in a circle
- Visual indicators showing who has voted
- Cards stay face-down until "Reveal Cards" is clicked
- **Vote Summary Panel**: Displays average, min, max, and most common votes
- **Vote Distribution**: Shows the frequency of each vote value
- Start new rounds to reset all votes
- Color-coded avatars (Red, Blue, Yellow, Green)

### 🎨 UNO-Inspired Dark Theme
- Pure black background (#000000)
- Dark neutral UI elements (#171717, #262626, #404040)
- Bold accent colors: Red (#DC2626), Blue (#2563EB), Yellow (#EAB308), Green (#16A34A)
- Minimal, clean design with focus on functionality

### 📱 Fully Responsive
- **Mobile-First Design**: Optimized for all screen sizes
- **Collapsible Settings**: Settings panel collapses on mobile for better UX
- **Touch-Friendly**: Large tap targets for cards and buttons
- **Adaptive Layout**: 1-column mobile, 4-column desktop grid
- **Scalable Elements**: Cards and avatars scale based on screen size

---

## 📁 Project Structure

```
scrum-poker-cards/
├── frontend/                  # Next.js Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # React components
│   │   │   ├── hooks/        # useRoomSync hook
│   │   │   └── lib/          # RoomManager (Socket.IO client)
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── backend/                   # Express + Socket.IO Backend
│   ├── src/
│   │   ├── handlers/         # Socket event handlers
│   │   ├── services/         # RoomService
│   │   ├── types/            # TypeScript interfaces
│   │   └── index.ts          # Server entry
│   ├── package.json
│   ├── render.yaml           # Render deployment config
│   └── .env
│
├── docs/                      # Documentation
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── USAGE.md
│   └── ...
│
├── package.json              # Root monorepo scripts
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scrum-poker-cards.git
   cd scrum-poker-cards
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Frontend:**
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
   
   Edit `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```
   
   **Backend:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

5. **Open your browser**
   - Go to http://localhost:3000
   - Create a room and start estimating!

---

## 🧪 Testing Locally

### Single Device Test
1. Open http://localhost:3000
2. Create a room
3. Copy the room code
4. Open an incognito/private window
5. Join with the room code
6. See real-time sync!

### Multi-Device Test
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `backend/.env`: `FRONTEND_URL=http://YOUR_IP:3000`
3. Update `frontend/.env.local`: `NEXT_PUBLIC_SOCKET_URL=http://YOUR_IP:3001`
4. Restart servers: `npm run dev`
5. On mobile: visit `http://YOUR_IP:3000`
6. Join the same room and test!

---

## 📦 Available Scripts

### Root Level (Monorepo)
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both for production
npm run install:all      # Install all dependencies
npm run clean            # Clean all build artifacts
```

### Frontend Only
```bash
npm run dev:frontend     # Start Next.js dev server
npm run build:frontend   # Build for production
```

### Backend Only
```bash
npm run dev:backend      # Start Express + Socket.IO
npm run build:backend    # Compile TypeScript
```

---

## 🌐 Deployment

### Quick Deploy

**Backend → Render** (Free tier available)
- Push to GitHub
- Connect repository to Render
- Backend auto-deploys on push
- Get URL: `https://your-app.onrender.com`

**Frontend → Vercel** (Free tier available)
```bash
cd frontend
vercel --prod
```

### Complete Guide
See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed step-by-step instructions including:
- Render backend setup
- Vercel frontend deployment
- Environment variable configuration
- Custom domain setup
- Troubleshooting

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Complete deployment guide for Render + Vercel |
| **[RESTRUCTURE.md](./RESTRUCTURE.md)** | Project restructuring guide |
| **[docs/SETUP.md](./docs/SETUP.md)** | Detailed setup and troubleshooting |
| **[docs/USAGE.md](./docs/USAGE.md)** | User guide and features |
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | System architecture diagrams |
| **[docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)** | Technical implementation details |
| **[frontend/README.md](./frontend/README.md)** | Frontend-specific docs |
| **[backend/README.md](./backend/README.md)** | Backend-specific docs |

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Socket.IO Client** - WebSocket client

### Backend
- **Express** - HTTP server
- **Socket.IO** - WebSocket server
- **TypeScript** - Type safety
- **Node.js** - Runtime

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## 🔧 Configuration

### Environment Variables

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001          # Development
# NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com  # Production
```

**Backend (`backend/.env`)**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000                    # Development
# FRONTEND_URL=https://your-frontend.vercel.app       # Production
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Troubleshooting

### Connection Issues
- Check environment variables are correct
- Verify both frontend and backend are running
- Check browser console for errors
- See [docs/SETUP.md](./docs/SETUP.md) for detailed troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL
- No trailing slashes in URLs
- Include protocol (http:// or https://)

### Backend Sleeping (Render Free Tier)
- Free tier spins down after 15 minutes
- First request takes ~30 seconds (cold start)
- Use uptime monitors or upgrade to paid plan

---

## 🎉 Features Roadmap

- [ ] User authentication (optional)
- [ ] Session history
- [ ] Export results to CSV/PDF
- [ ] Timer for estimation rounds
- [ ] Custom card deck upload
- [ ] Dark/Light theme toggle
- [ ] Multiple language support
- [ ] Team statistics dashboard

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/scrum-poker-cards/issues)
- **Documentation**: See [docs/](./docs/) folder
- **Deployment Help**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ for Agile teams everywhere**
