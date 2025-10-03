# Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SCRUM POKER SYSTEM                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                     │
│                        (Next.js + React)                                  │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │    Browser A    │  │    Browser B    │  │   Mobile App    │         │
│  │  localhost:3000 │  │  localhost:3000 │  │  your-ip:3000   │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                    │                     │                   │
│           │    Socket.IO Client (WebSocket)         │                   │
│           └────────────────────┼─────────────────────┘                   │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
                                  │ WebSocket Connection
                                  │ (Port 3001)
                                  │
┌─────────────────────────────────┼───────────────────────────────────────┐
│                              BACKEND                                      │
│                     (Express + Socket.IO)                                 │
│                                                                           │
│  ┌───────────────────────────────────────────────────────────┐          │
│  │              Socket.IO Server (WebSocket)                  │          │
│  │                    localhost:3001                          │          │
│  └───────────────────────────┬───────────────────────────────┘          │
│                              │                                            │
│  ┌───────────────────────────┴───────────────────────────────┐          │
│  │                    SocketHandler                            │          │
│  │  • Connection management                                    │          │
│  │  • Event handling (join, update-card, reset)               │          │
│  │  • Broadcasting to rooms                                    │          │
│  │  • Heartbeat system                                         │          │
│  └───────────────────────────┬───────────────────────────────┘          │
│                              │                                            │
│  ┌───────────────────────────┴───────────────────────────────┐          │
│  │                     RoomService                             │          │
│  │  • Room state management (in-memory)                       │          │
│  │  • Participant tracking                                     │          │
│  │  • Vote management                                          │          │
│  │  • Auto-cleanup (30s inactive, 1h room timeout)            │          │
│  └─────────────────────────────────────────────────────────────┘          │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Joins Room

```
User A                          Backend                          User B
  │                               │                                │
  │  1. join-room                 │                                │
  ├──────────────────────────────►│                                │
  │   { roomId, userId, name }    │                                │
  │                               │                                │
  │  2. room-state                │  3. join-room                  │
  │◄──────────────────────────────┤◄───────────────────────────────┤
  │   { participants: [A] }       │   { roomId, userId, name }     │
  │                               │                                │
  │  4. room-state                │  5. room-state                 │
  │◄──────────────────────────────┼───────────────────────────────►│
  │   { participants: [A, B] }    │   { participants: [A, B] }     │
```

### User Selects Card

```
User A                          Backend                          User B
  │                               │                                │
  │  1. update-card               │                                │
  ├──────────────────────────────►│                                │
  │   { card: "5", voted: true }  │                                │
  │                               │                                │
  │  2. room-state (broadcast)    │  3. room-state (broadcast)     │
  │◄──────────────────────────────┼───────────────────────────────►│
  │   { A: voted ✓ }              │   { A: voted ✓ }               │
```

### Heartbeat System

```
Backend                          User A                          User B
  │                               │                                │
  │  1. heartbeat-check (every 5s)│                                │
  ├──────────────────────────────►│                                │
  ├───────────────────────────────┼───────────────────────────────►│
  │                               │                                │
  │  2. heartbeat response        │  3. heartbeat response         │
  │◄──────────────────────────────┤◄───────────────────────────────┤
  │   { roomId, userId }          │   { roomId, userId }           │
  │                               │                                │
  │  4. Cleanup check (every 10s) │                                │
  │  - Remove users inactive > 30s│                                │
  │  - Broadcast updated state    │                                │
```

## Component Hierarchy

```
Frontend (Next.js)
│
├─ page.tsx (Main App)
│  │
│  ├─ useRoomSync() Hook
│  │  └─ RoomManager
│  │     └─ Socket.IO Client
│  │
│  ├─ RoomJoin Component
│  │
│  ├─ ParticipantsTable Component
│  │
│  ├─ PokerCard Components
│  │
│  ├─ ScaleSelector Component
│  │
│  └─ VoteSummary Component

Backend (Express)
│
├─ index.ts (Server Entry)
│  │
│  ├─ Express App
│  │  └─ Health Check Endpoint
│  │
│  └─ Socket.IO Server
│     └─ SocketHandler
│        │
│        ├─ join-room event
│        ├─ update-card event
│        ├─ update-settings event
│        ├─ reset-votes event
│        ├─ heartbeat event
│        └─ disconnect event
│
└─ RoomService
   │
   ├─ In-Memory Room Storage (Map)
   ├─ Participant Management
   ├─ Vote Management
   └─ Cleanup Intervals
```

## State Management

```
┌─────────────────────────────────────────┐
│           Room State (Backend)          │
│                                         │
│  {                                      │
│    roomId: "ABC123",                    │
│    participants: [                      │
│      {                                  │
│        id: "user-123",                  │
│        name: "Alice",                   │
│        selectedCard: "5",               │
│        hasVoted: true,                  │
│        lastActive: 1696234567890,       │
│        socketId: "xyz789"               │
│      },                                 │
│      { ... }                            │
│    ],                                   │
│    showCards: false,                    │
│    currentScale: "fibonacci",           │
│    customValues: [],                    │
│    createdAt: 1696234500000,            │
│    lastActivity: 1696234567890          │
│  }                                      │
└─────────────────────────────────────────┘
         │
         │ Broadcast via Socket.IO
         ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Browser A     │  │   Browser B     │  │   Browser C     │
│  React State    │  │  React State    │  │  React State    │
│  (roomState)    │  │  (roomState)    │  │  (roomState)    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        PRODUCTION                               │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌──────────────────────────┐
│    Vercel / Netlify     │         │  Heroku / Railway        │
│    (Frontend)           │◄───────►│  (Backend)               │
│                         │   WSS   │                          │
│  • Next.js Build        │         │  • Express Server        │
│  • Static Assets        │         │  • Socket.IO Server      │
│  • CDN Distribution     │         │  • In-Memory State       │
│                         │         │  • Health Monitoring     │
│  Domain:                │         │  Domain:                 │
│  your-app.vercel.app    │         │  your-api.herokuapp.com  │
└─────────────────────────┘         └──────────────────────────┘
         │                                     │
         │                                     │
         └──────────────┬──────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │   End Users     │
              │  (Any Device)   │
              └─────────────────┘
```

## Network Flow

```
Client                     Frontend Server              Backend Server
Device                     (Port 3000)                  (Port 3001)
  │                             │                             │
  │  HTTP GET /                 │                             │
  ├────────────────────────────►│                             │
  │                             │                             │
  │  HTML/CSS/JS                │                             │
  │◄────────────────────────────┤                             │
  │                             │                             │
  │  WebSocket Upgrade          │                             │
  ├───────────────────────────────────────────────────────────►│
  │                             │                             │
  │  WebSocket Connected        │                             │
  │◄────────────────────────────────────────────────────────────┤
  │                             │                             │
  │  Socket.IO Events           │                             │
  │◄───────────────────────────────────────────────────────────►│
  │  (join-room, update-card,   │                             │
  │   room-state, etc.)         │                             │
```

This architecture provides:
✅ Real-time bidirectional communication
✅ Scalable room-based architecture
✅ Automatic cleanup and resource management
✅ Production-ready deployment structure
✅ Cross-device compatibility
