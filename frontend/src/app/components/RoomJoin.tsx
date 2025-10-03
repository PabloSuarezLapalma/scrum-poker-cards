import { useState } from 'react';

interface RoomJoinProps {
  onJoinRoom: (roomId: string, userName: string) => void;
}

export function RoomJoin({ onJoinRoom }: RoomJoinProps) {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('create');

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      const finalRoomId = mode === 'create' ? generateRoomId() : roomId.trim().toUpperCase();
      onJoinRoom(finalRoomId, userName.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="bg-neutral-900 border-2 border-neutral-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          🃏 Scrum Poker
        </h1>
        <p className="text-center text-neutral-400 mb-6">
          Create or join a planning session
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-700 focus:border-red-500 outline-none transition-colors bg-neutral-800 text-white placeholder-neutral-500"
            />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'create'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              Create Room
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'join'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              Join Room
            </button>
          </div>

          {/* Room ID Input (only for join mode) */}
          {mode === 'join' && (
            <div>
              <label className="block text-sm font-semibold text-neutral-300 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-700 focus:border-blue-500 outline-none transition-colors bg-neutral-800 text-white placeholder-neutral-500 uppercase tracking-wider text-center text-xl font-bold"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {mode === 'create' ? 'Create & Join' : 'Join Room'}
          </button>
        </form>

        {mode === 'create' && (
          <div className="mt-4 text-center text-sm text-neutral-500">
            A unique room code will be generated for sharing
          </div>
        )}
      </div>
    </div>
  );
}
