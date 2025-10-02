export interface RoomState {
  roomId: string;
  participants: Array<{
    id: string;
    name: string;
    selectedCard: string | null;
    hasVoted: boolean;
    lastActive: number;
  }>;
  showCards: boolean;
  currentScale: 'fibonacci' | 'powers-of-2' | 't-shirt' | 'custom';
  customValues: string[];
}

const STORAGE_KEY_PREFIX = 'scrum-poker-room-';
const HEARTBEAT_INTERVAL = 3000; // 3 seconds
const PARTICIPANT_TIMEOUT = 10000; // 10 seconds

export class RoomManager {
  private roomId: string;
  private userId: string;
  private userName: string;
  private channel: BroadcastChannel | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private listeners: Array<(state: RoomState) => void> = [];

  constructor(roomId: string, userId: string, userName: string) {
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;
    
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(`scrum-poker-${roomId}`);
      this.channel.onmessage = (event) => {
        if (event.data.type === 'state-update') {
          this.notifyListeners(event.data.state);
        }
      };
    }

    // Listen to storage events for cross-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange);
    }
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key === this.getStorageKey() && event.newValue) {
      const state = JSON.parse(event.newValue) as RoomState;
      this.notifyListeners(state);
    }
  };

  private getStorageKey(): string {
    return `${STORAGE_KEY_PREFIX}${this.roomId}`;
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
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.getStorageKey());
    if (!stored) return null;
    
    return JSON.parse(stored) as RoomState;
  }

  setState(state: RoomState) {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.getStorageKey(), JSON.stringify(state));
    
    // Broadcast to other tabs
    if (this.channel) {
      this.channel.postMessage({ type: 'state-update', state });
    }
    
    this.notifyListeners(state);
  }

  joinRoom() {
    const state = this.getState() || this.createInitialState();
    
    // Add or update current user
    const existingIndex = state.participants.findIndex(p => p.id === this.userId);
    const participant = {
      id: this.userId,
      name: this.userName,
      selectedCard: null,
      hasVoted: false,
      lastActive: Date.now(),
    };

    if (existingIndex >= 0) {
      state.participants[existingIndex] = participant;
    } else {
      state.participants.push(participant);
    }

    this.setState(state);
    this.startHeartbeat();
    this.startCleanup();
  }

  leaveRoom() {
    const state = this.getState();
    if (state) {
      state.participants = state.participants.filter(p => p.id !== this.userId);
      this.setState(state);
    }
    
    this.stopHeartbeat();
    this.stopCleanup();
    
    if (this.channel) {
      this.channel.close();
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageChange);
    }
  }

  updateParticipant(updates: Partial<{
    selectedCard: string | null;
    hasVoted: boolean;
  }>) {
    const state = this.getState();
    if (!state) return;

    const participant = state.participants.find(p => p.id === this.userId);
    if (participant) {
      Object.assign(participant, updates, { lastActive: Date.now() });
      this.setState(state);
    }
  }

  updateRoomSettings(updates: Partial<{
    showCards: boolean;
    currentScale: RoomState['currentScale'];
    customValues: string[];
  }>) {
    const state = this.getState();
    if (!state) return;

    Object.assign(state, updates);
    this.setState(state);
  }

  resetVotes() {
    const state = this.getState();
    if (!state) return;

    state.participants.forEach(p => {
      p.selectedCard = null;
      p.hasVoted = false;
    });
    state.showCards = false;

    this.setState(state);
  }

  private createInitialState(): RoomState {
    return {
      roomId: this.roomId,
      participants: [],
      showCards: false,
      currentScale: 'fibonacci',
      customValues: ['1', '2', '3', '5', '8'],
    };
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const state = this.getState();
      if (!state) return;

      const participant = state.participants.find(p => p.id === this.userId);
      if (participant) {
        participant.lastActive = Date.now();
        this.setState(state);
      }
    }, HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      const state = this.getState();
      if (!state) return;

      const now = Date.now();
      const activeParticipants = state.participants.filter(
        p => now - p.lastActive < PARTICIPANT_TIMEOUT
      );

      if (activeParticipants.length !== state.participants.length) {
        state.participants = activeParticipants;
        this.setState(state);
      }
    }, HEARTBEAT_INTERVAL);
  }

  private stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}
