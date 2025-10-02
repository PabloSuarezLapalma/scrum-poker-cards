import { useEffect, useState, useCallback } from 'react';
import { RoomManager, type RoomState } from '../lib/RoomManager';

export function useRoomSync(roomId: string, userId: string, userName: string) {
  const [roomManager, setRoomManager] = useState<RoomManager | null>(null);
  const [roomState, setRoomState] = useState<RoomState | null>(null);

  useEffect(() => {
    const manager = new RoomManager(roomId, userId, userName);
    setRoomManager(manager);

    // Join room and get initial state
    manager.joinRoom();
    setRoomState(manager.getState());

    // Subscribe to updates
    const unsubscribe = manager.subscribe((state) => {
      setRoomState(state);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      manager.leaveRoom();
    };
  }, [roomId, userId, userName]);

  const updateCard = useCallback((selectedCard: string | null, hasVoted: boolean) => {
    roomManager?.updateParticipant({ selectedCard, hasVoted });
  }, [roomManager]);

  const updateSettings = useCallback((updates: Partial<{
    showCards: boolean;
    currentScale: RoomState['currentScale'];
    customValues: string[];
  }>) => {
    roomManager?.updateRoomSettings(updates);
  }, [roomManager]);

  const resetVotes = useCallback(() => {
    roomManager?.resetVotes();
  }, [roomManager]);

  return {
    roomState,
    updateCard,
    updateSettings,
    resetVotes,
  };
}
