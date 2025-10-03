import { io, Socket } from 'socket.io-client';

export interface RoomState {
  roomId: string;
  participants: Array<{
    id: string;
    name: string;
    selectedCard: string | null;
    hasVoted: boolean;
    lastActive: number;
    socketId: string;
  }>;
  showCards: boolean;
  currentScale: 'fibonacci' | 'powers-of-2' | 't-shirt' | 'custom';
  customValues: string[];
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
const HEARTBEAT_INTERVAL = 5000; // 5 seconds

export class RoomManager {
  private roomId: string;
  private userId: string;
  private userName: string;
  private socket: Socket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(state: RoomState) => void> = [];
  private currentState: RoomState | null = null;

  constructor(roomId: string, userId: string, userName: string) {
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;
    
    this.initializeSocket();
  }

  private initializeSocket() {
    if (typeof window === 'undefined') return;

    // Create socket connection
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Listen for room state updates
    this.socket.on('room-state', (state: RoomState) => {
      this.currentState = state;
      this.notifyListeners(state);
    });

    // Listen for heartbeat checks
    this.socket.on('heartbeat-check', () => {
      if (this.socket) {
        this.socket.emit('heartbeat', {
          roomId: this.roomId,
          userId: this.userId,
        });
      }
    });

    // Handle connection errors
    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
    });

    // Handle reconnection
    this.socket.on('reconnect', () => {
      console.log('Socket reconnected');
      // Rejoin room after reconnection
      this.joinRoom();
    });
  }

  subscribe(listener: (state: RoomState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(state: RoomState) {
    this.listeners.forEach(listener => listener(state));
  }

  getState(): RoomState | null {
    return this.currentState;
  }

  joinRoom() {
    if (!this.socket) return;

    this.socket.emit('join-room', {
      roomId: this.roomId,
      userId: this.userId,
      userName: this.userName,
    });

    this.startHeartbeat();
  }

  leaveRoom() {
    this.stopHeartbeat();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  updateParticipant(updates: Partial<{
    selectedCard: string | null;
    hasVoted: boolean;
  }>) {
    if (!this.socket) return;

    this.socket.emit('update-card', {
      roomId: this.roomId,
      userId: this.userId,
      selectedCard: updates.selectedCard ?? null,
      hasVoted: updates.hasVoted ?? false,
    });
  }

  updateRoomSettings(updates: Partial<{
    showCards: boolean;
    currentScale: RoomState['currentScale'];
    customValues: string[];
  }>) {
    if (!this.socket) return;

    this.socket.emit('update-settings', {
      roomId: this.roomId,
      ...updates,
    });
  }

  resetVotes() {
    if (!this.socket) return;

    this.socket.emit('reset-votes', {
      roomId: this.roomId,
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('heartbeat', {
          roomId: this.roomId,
          userId: this.userId,
        });
      }
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
