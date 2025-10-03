export interface Participant {
  id: string;
  name: string;
  selectedCard: string | null;
  hasVoted: boolean;
  lastActive: number;
  socketId: string;
}

export interface RoomState {
  roomId: string;
  participants: Participant[];
  showCards: boolean;
  currentScale: 'fibonacci' | 'powers-of-2' | 't-shirt' | 'custom';
  customValues: string[];
  createdAt: number;
  lastActivity: number;
}

export interface JoinRoomPayload {
  roomId: string;
  userId: string;
  userName: string;
}

export interface UpdateCardPayload {
  roomId: string;
  userId: string;
  selectedCard: string | null;
  hasVoted: boolean;
}

export interface UpdateSettingsPayload {
  roomId: string;
  showCards?: boolean;
  currentScale?: RoomState['currentScale'];
  customValues?: string[];
}

export interface ResetVotesPayload {
  roomId: string;
}
