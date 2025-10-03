'use client';

import { useState, useMemo, useEffect } from 'react';
import { RoomJoin } from './components/RoomJoin';
import { Avatar } from './components/Avatar';
import { PokerCard } from './components/PokerCard';
import { ScaleSelector, PRESET_SCALES, type ScaleType } from './components/ScaleSelector';
import { ParticipantsTable } from './components/ParticipantsTable';
import { VoteSummary } from './components/VoteSummary';
import { useRoomSync } from './hooks/useRoomSync';

export default function Home() {
  const [sessionData, setSessionData] = useState<{ roomId: string; userId: string; userName: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(false);

  // Generate unique user ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('userId')) {
      sessionStorage.setItem('userId', `user-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    }
  }, []);

  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') || '' : '';

  const { roomState, updateCard, updateSettings, resetVotes } = useRoomSync(
    sessionData?.roomId || '',
    userId,
    sessionData?.userName || ''
  );

  const cardValues = useMemo(() => {
    if (!roomState) return PRESET_SCALES.fibonacci;
    if (roomState.currentScale === 'custom') {
      return roomState.customValues.length > 0 ? roomState.customValues : ['?'];
    }
    return PRESET_SCALES[roomState.currentScale];
  }, [roomState]);

  if (!sessionData) {
    return <RoomJoin onJoinRoom={(roomId, userName) => setSessionData({ roomId, userId, userName })} />;
  }

  if (!roomState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading room...</div>
      </div>
    );
  }

  const currentParticipant = roomState.participants.find(p => p.id === userId);
  const selectedCard = currentParticipant?.selectedCard || null;
  const allVoted = roomState.participants.length > 0 && roomState.participants.every(p => p.hasVoted);

  const handleCardSelect = (value: string) => {
    const newCard = value === selectedCard ? null : value;
    updateCard(newCard, newCard !== null);
  };

  const handleScaleChange = (scale: ScaleType) => {
    updateSettings({ currentScale: scale });
  };

  const handleCustomValuesChange = (values: string[]) => {
    updateSettings({ customValues: values });
  };

  const handleRevealCards = () => {
    updateSettings({ showCards: true });
  };

  const handleNewRound = () => {
    resetVotes();
  };

  const handleLeaveRoom = () => {
    setSessionData(null);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(sessionData.roomId);
    setShowRoomCode(true);
    setTimeout(() => setShowRoomCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black p-2 sm:p-3 lg:p-4">
      {/* Header */}
      <header className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar name={sessionData.userName} />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">{sessionData.userName}</h2>
            <button
              onClick={handleLeaveRoom}
              className="text-xs sm:text-sm text-neutral-400 hover:text-red-500 underline transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={copyRoomCode}
            className="px-3 sm:px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg text-xs sm:text-sm text-neutral-300 font-mono transition-colors"
            title="Click to copy"
          >
            {showRoomCode ? '✓ Copied!' : `Room: ${sessionData.roomId}`}
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            🃏 <span className="hidden sm:inline">Scrum Poker</span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Left Sidebar - Settings */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          {/* Mobile: Collapsible Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="lg:hidden w-full px-4 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl text-white font-semibold flex items-center justify-between transition-colors"
          >
            <span>Settings</span>
            <svg 
              className={`w-5 h-5 transition-transform ${showSettings ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`space-y-3 sm:space-y-4 ${showSettings ? 'block' : 'hidden lg:block'}`}>
            <ScaleSelector
              currentScale={roomState.currentScale}
              customValues={roomState.customValues}
              onScaleChange={handleScaleChange}
              onCustomValuesChange={handleCustomValuesChange}
            />

            {/* Action Buttons */}
            <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-700 space-y-2">
              <button
                onClick={handleRevealCards}
                disabled={!allVoted || roomState.showCards}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                  allVoted && !roomState.showCards
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                {roomState.showCards ? '✓ Cards Revealed' : 'Reveal Cards'}
              </button>
              
              <button
                onClick={handleNewRound}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                New Round
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right - Participants Table */}
        <div className="lg:col-span-3">
          <ParticipantsTable
            participants={roomState.participants}
            currentUserId={userId}
            showCards={roomState.showCards}
          />
        </div>
      </div>

      {/* Vote Summary - Only shown when cards are revealed */}
      {roomState.showCards && (
        <div className="max-w-7xl mx-auto mt-3 sm:mt-4">
          <VoteSummary
            participants={roomState.participants}
            showCards={roomState.showCards}
          />
        </div>
      )}

      {/* Bottom - Card Selection */}
      <div className="max-w-7xl mx-auto mt-3 sm:mt-4">
        <div className="bg-neutral-900 rounded-xl p-3 sm:p-4 border border-neutral-700">
          <div className="mb-2 sm:mb-3 text-center">
            <h3 className="text-sm sm:text-base font-bold text-white mb-2">
              {selectedCard ? 'Your Estimate' : 'Select Your Card'}
            </h3>
            {selectedCard && (
              <div className="inline-block mb-2">
                <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl bg-red-600 shadow-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                  {selectedCard}
                </div>
              </div>
            )}
          </div>

          {/* Poker Cards */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
            {cardValues.map((value) => (
              <PokerCard
                key={value}
                value={value}
                isSelected={selectedCard === value}
                onClick={() => handleCardSelect(value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
