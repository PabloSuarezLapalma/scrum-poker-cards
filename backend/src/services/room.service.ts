import { RoomState, Participant } from '../types/room.types';

const ROOM_CLEANUP_INTERVAL = 60000; // 1 minute
const ROOM_INACTIVITY_TIMEOUT = 3600000; // 1 hour
const PARTICIPANT_TIMEOUT = 30000; // 30 seconds

export class RoomService {
  private rooms: Map<string, RoomState> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Start cleanup interval for inactive rooms
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveRooms();
    }, ROOM_CLEANUP_INTERVAL);
  }

  /**
   * Create a new room or get existing one
   */
  getOrCreateRoom(roomId: string): RoomState {
    let room = this.rooms.get(roomId);
    
    if (!room) {
      room = {
        roomId,
        participants: [],
        showCards: false,
        currentScale: 'fibonacci',
        customValues: ['1', '2', '3', '5', '8'],
        createdAt: Date.now(),
        lastActivity: Date.now(),
      };
      this.rooms.set(roomId, room);
    }

    return room;
  }

  /**
   * Get room state
   */
  getRoom(roomId: string): RoomState | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Add or update participant in room
   */
  joinRoom(roomId: string, userId: string, userName: string, socketId: string): RoomState {
    const room = this.getOrCreateRoom(roomId);
    const existingIndex = room.participants.findIndex(p => p.id === userId);

    const participant: Participant = {
      id: userId,
      name: userName,
      selectedCard: null,
      hasVoted: false,
      lastActive: Date.now(),
      socketId,
    };

    if (existingIndex >= 0) {
      // Update existing participant
      room.participants[existingIndex] = participant;
    } else {
      // Add new participant
      room.participants.push(participant);
    }

    room.lastActivity = Date.now();
    return room;
  }

  /**
   * Remove participant from room
   */
  leaveRoom(roomId: string, userId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    room.participants = room.participants.filter(p => p.id !== userId);
    room.lastActivity = Date.now();

    // Remove room if empty
    if (room.participants.length === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    return room;
  }

  /**
   * Update participant's heartbeat
   */
  updateHeartbeat(roomId: string, userId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const participant = room.participants.find(p => p.id === userId);
    if (participant) {
      participant.lastActive = Date.now();
      room.lastActivity = Date.now();
    }

    return room;
  }

  /**
   * Update participant's card selection
   */
  updateCard(
    roomId: string,
    userId: string,
    selectedCard: string | null,
    hasVoted: boolean
  ): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const participant = room.participants.find(p => p.id === userId);
    if (participant) {
      participant.selectedCard = selectedCard;
      participant.hasVoted = hasVoted;
      participant.lastActive = Date.now();
      room.lastActivity = Date.now();
    }

    return room;
  }

  /**
   * Update room settings
   */
  updateSettings(
    roomId: string,
    updates: {
      showCards?: boolean;
      currentScale?: RoomState['currentScale'];
      customValues?: string[];
    }
  ): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    if (updates.showCards !== undefined) room.showCards = updates.showCards;
    if (updates.currentScale !== undefined) room.currentScale = updates.currentScale;
    if (updates.customValues !== undefined) room.customValues = updates.customValues;
    
    room.lastActivity = Date.now();
    return room;
  }

  /**
   * Reset all votes in a room
   */
  resetVotes(roomId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    room.participants.forEach(p => {
      p.selectedCard = null;
      p.hasVoted = false;
    });
    room.showCards = false;
    room.lastActivity = Date.now();

    return room;
  }

  /**
   * Clean up inactive participants
   */
  cleanupInactiveParticipants(roomId: string): RoomState | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const now = Date.now();
    const initialCount = room.participants.length;
    
    room.participants = room.participants.filter(
      p => now - p.lastActive < PARTICIPANT_TIMEOUT
    );

    // Remove room if empty after cleanup
    if (room.participants.length === 0) {
      this.rooms.delete(roomId);
      return undefined;
    }

    // Only update lastActivity if participants were removed
    if (room.participants.length < initialCount) {
      room.lastActivity = Date.now();
    }

    return room;
  }

  /**
   * Clean up inactive rooms
   */
  private cleanupInactiveRooms(): void {
    const now = Date.now();
    const roomsToDelete: string[] = [];

    this.rooms.forEach((room, roomId) => {
      if (now - room.lastActivity > ROOM_INACTIVITY_TIMEOUT) {
        roomsToDelete.push(roomId);
      }
    });

    roomsToDelete.forEach(roomId => {
      this.rooms.delete(roomId);
      console.log(`Cleaned up inactive room: ${roomId}`);
    });
  }

  /**
   * Get all active rooms (for debugging)
   */
  getAllRooms(): RoomState[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.rooms.clear();
  }
}
