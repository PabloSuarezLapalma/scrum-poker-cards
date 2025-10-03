# 🃏 Scrum Poker Cards

A modern, real-time collaborative Scrum poker planning application with no login required. Features a dark UNO-inspired theme with minimal colors and bold accents.

## ✨ Features

### 🌐 Real-Time Collaboration
- **WebSocket Communication**: True real-time sync using Socket.IO across different devices and networks
- **Room-Based Sessions**: Create or join rooms with unique 6-character codes
- **Auto-Join**: Users automatically join the session when they enter
- **Live Presence**: Participants are removed automatically after 30 seconds of inactivity
- **Cross-Device Sync**: Works across any device - phones, tablets, desktops
- **Instant Updates**: See votes, participants, and settings update in real-time
- **Auto Reconnection**: Automatically reconnects if connection is lost

### �🎴 Multiple Card Scales
- **Fibonacci**: 0, 1, 2, 3, 5, 8, 13, 21, ?, ☕
- **Powers of 2**: 0, 1, 2, 4, 8, 16, 32, 64, ?, ☕
- **T-Shirt Sizes**: XS, S, M, L, XL, XXL, ?, ☕
- **Custom Scale**: Create your own card values with add/remove functionality

### 👥 Collaborative Planning
- Virtual planning table with participants arranged in a circle
- Users join automatically - no manual participant addition
- Visual indicators showing who has voted
- Cards stay face-down until "Reveal Cards" is clicked
- **Vote Summary Panel**: Displays average, min, max, and most common votes when cards are revealed
- **Vote Distribution**: Shows the frequency of each vote value
- Start new rounds to reset all votes
- Color-coded avatars (Red, Blue, Yellow, Green)

### 🎨 UNO-Inspired Dark Theme
- Pure black background (#000000)
- Dark neutral UI elements (#171717, #262626, #404040)
- Bold accent colors: Red (#DC2626), Blue (#2563EB), Yellow (#EAB308), Green (#16A34A)
- Minimal, clean design with focus on functionality

### � Fully Responsive
- **Mobile-First Design**: Optimized for all screen sizes to fit on a single screen
- **Collapsible Settings**: Settings panel collapses on mobile for better UX
- **Touch-Friendly**: Large tap targets for cards and buttons
- **Adaptive Layout**: 1-column mobile, 4-column desktop grid
- **Scalable Elements**: Cards and avatars scale based on screen size
- **Compact Spacing**: Optimized padding and margins to maximize content visibility

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd scrum-poker-cards
```

2. **Install all dependencies (frontend + backend)**
```bash
npm run install:all
```

3. **Configure environment variables**

Create `.env.local` in the root directory:
```bash
cp .env.example .env.local
```

Create `.env` in the server directory:
```bash
cp server/.env.example server/.env
```

4. **Start the development servers**
```bash
npm run dev
```

This will start:
- Frontend (Next.js) on [http://localhost:3000](http://localhost:3000)
- Backend (Socket.IO) on [http://localhost:3001](http://localhost:3001)

### Architecture

```
scrum-poker-cards/
├── src/                    # Frontend Next.js app
│   ├── app/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # RoomManager (Socket.IO client)
├── server/                 # Backend WebSocket server
│   └── src/
│       ├── handlers/       # Socket event handlers
│       ├── services/       # Business logic
│       └── types/          # TypeScript types
└── public/                 # Static assets
```

## 📡 Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Socket.IO Client**: WebSocket communication

### Backend
- **Express**: HTTP server
- **Socket.IO**: Real-time bidirectional communication
- **TypeScript**: Type-safe backend
- **In-Memory Storage**: Fast room state management

## 🔧 Development

### Run Frontend Only
```bash
npm run dev:frontend
```

### Run Backend Only
```bash
npm run dev:backend
```

### Build for Production
```bash
npm run build
```

### Start Production Servers
```bash
npm start
```

## 📚 Documentation

- [Usage Guide](./USAGE.md) - How to use the application
- [Implementation Details](./IMPLEMENTATION.md) - Technical implementation
- [Backend Server](./server/README.md) - Backend documentation

## 🌐 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

Set environment variable:
- `NEXT_PUBLIC_SOCKET_URL`: Your backend WebSocket URL

### Backend (Heroku/Railway/Render)
```bash
cd server
git subtree push --prefix server heroku main
```

Set environment variables:
- `PORT`: Server port
- `FRONTEND_URL`: Your frontend URL for CORS
- `NODE_ENV`: production

## 🧪 Testing Real-Time Features

1. Open app in multiple browsers/devices
2. Create a room in one browser
3. Copy the room code
4. Join with the same code from other browsers
5. Select cards and see instant sync
6. Test reveal cards and new round features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for any purpose.
