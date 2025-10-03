import { Server as SocketIOServer, Socket } from 'socket.io';
import { RoomService } from '../services/room.service';
import {
  JoinRoomPayload,
  UpdateCardPayload,
  UpdateSettingsPayload,
  ResetVotesPayload,
} from '../types/room.types';

const HEARTBEAT_INTERVAL = 5000; // 5 seconds
const CLEANUP_INTERVAL = 10000; // 10 seconds

export class SocketHandler {
  private roomService: RoomService;
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map();
  private cleanupIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private io: SocketIOServer) {
    this.roomService = new RoomService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle room join
      socket.on('join-room', (payload: JoinRoomPayload) => {
        this.handleJoinRoom(socket, payload);
      });

      // Handle card update
      socket.on('update-card', (payload: UpdateCardPayload) => {
        this.handleUpdateCard(socket, payload);
      });

      // Handle settings update
      socket.on('update-settings', (payload: UpdateSettingsPayload) => {
        this.handleUpdateSettings(socket, payload);
      });

      // Handle reset votes
      socket.on('reset-votes', (payload: ResetVotesPayload) => {
        this.handleResetVotes(socket, payload);
      });

      // Handle heartbeat
      socket.on('heartbeat', (payload: { roomId: string; userId: string }) => {
        this.handleHeartbeat(payload);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleJoinRoom(socket: Socket, payload: JoinRoomPayload): void {
    const { roomId, userId, userName } = payload;

    // Join the socket room
    socket.join(roomId);

    // Store user info in socket data
    socket.data.roomId = roomId;
    socket.data.userId = userId;

    // Add user to room
    const room = this.roomService.joinRoom(roomId, userId, userName, socket.id);

    // Send current state to the joining user
    socket.emit('room-state', room);

    // Broadcast updated state to all users in the room
    this.io.to(roomId).emit('room-state', room);

    // Start heartbeat for this room if not already started
    this.startHeartbeat(roomId);

    // Start cleanup for this room if not already started
    this.startCleanup(roomId);

    console.log(`User ${userName} (${userId}) joined room ${roomId}`);
  }

  private handleUpdateCard(_socket: Socket, payload: UpdateCardPayload): void {
    const { roomId, userId, selectedCard, hasVoted } = payload;

    const room = this.roomService.updateCard(roomId, userId, selectedCard, hasVoted);

    if (room) {
      // Broadcast updated state to all users in the room
      this.io.to(roomId).emit('room-state', room);
    }
  }

  private handleUpdateSettings(_socket: Socket, payload: UpdateSettingsPayload): void {
    const { roomId, ...updates } = payload;

    const room = this.roomService.updateSettings(roomId, updates);

    if (room) {
      // Broadcast updated state to all users in the room
      this.io.to(roomId).emit('room-state', room);
    }
  }

  private handleResetVotes(_socket: Socket, payload: ResetVotesPayload): void {
    const { roomId } = payload;

    const room = this.roomService.resetVotes(roomId);

    if (room) {
      // Broadcast updated state to all users in the room
      this.io.to(roomId).emit('room-state', room);
    }
  }

  private handleHeartbeat(payload: { roomId: string; userId: string }): void {
    const { roomId, userId } = payload;
    this.roomService.updateHeartbeat(roomId, userId);
  }

  private handleDisconnect(socket: Socket): void {
    const { roomId, userId } = socket.data;

    if (roomId && userId) {
      const room = this.roomService.leaveRoom(roomId, userId);

      if (room) {
        // Broadcast updated state to remaining users
        this.io.to(roomId).emit('room-state', room);
      } else {
        // Room was deleted (no more participants)
        this.stopHeartbeat(roomId);
        this.stopCleanup(roomId);
      }

      console.log(`User ${userId} left room ${roomId}`);
    }

    console.log(`Client disconnected: ${socket.id}`);
  }

  private startHeartbeat(roomId: string): void {
    if (this.heartbeatIntervals.has(roomId)) return;

    const interval = setInterval(() => {
      const room = this.roomService.getRoom(roomId);
      if (room) {
        // Send heartbeat to all clients in the room
        this.io.to(roomId).emit('heartbeat-check');
      } else {
        // Room no longer exists, stop heartbeat
        this.stopHeartbeat(roomId);
      }
    }, HEARTBEAT_INTERVAL);

    this.heartbeatIntervals.set(roomId, interval);
  }

  private stopHeartbeat(roomId: string): void {
    const interval = this.heartbeatIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(roomId);
    }
  }

  private startCleanup(roomId: string): void {
    if (this.cleanupIntervals.has(roomId)) return;

    const interval = setInterval(() => {
      const room = this.roomService.cleanupInactiveParticipants(roomId);
      
      if (room) {
        // Broadcast updated state after cleanup
        this.io.to(roomId).emit('room-state', room);
      } else {
        // Room was deleted, stop cleanup
        this.stopCleanup(roomId);
        this.stopHeartbeat(roomId);
      }
    }, CLEANUP_INTERVAL);

    this.cleanupIntervals.set(roomId, interval);
  }

  private stopCleanup(roomId: string): void {
    const interval = this.cleanupIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.cleanupIntervals.delete(roomId);
    }
  }

  destroy(): void {
    // Clear all intervals
    this.heartbeatIntervals.forEach(interval => clearInterval(interval));
    this.cleanupIntervals.forEach(interval => clearInterval(interval));
    this.heartbeatIntervals.clear();
    this.cleanupIntervals.clear();
    
    // Destroy room service
    this.roomService.destroy();
  }
}
