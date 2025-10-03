export interface Participant {
  id: string;
  name: string;
  selectedCard: string | null;
  hasVoted: boolean;
}

interface ParticipantsTableProps {
  participants: Participant[];
  currentUserId: string;
  showCards: boolean;
}

export function ParticipantsTable({ 
  participants, 
  currentUserId, 
  showCards
}: ParticipantsTableProps) {
  const getInitials = (name: string): string => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Arrange participants in a circular layout
  const getPositionStyle = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 35; // percentage
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
    };
  };

  const colors = ['bg-red-600', 'bg-blue-600', 'bg-yellow-500', 'bg-green-600'];

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-700 p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">Planning Table</h2>
        <div className="text-xs sm:text-sm text-neutral-400">
          {participants.filter(p => p.hasVoted).length} / {participants.length} voted
        </div>
      </div>

      {/* Circular Table */}
      <div className="relative w-full aspect-square max-w-2xl mx-auto min-h-[250px] sm:min-h-[350px] lg:min-h-[400px]">
        {/* Table Surface */}
        <div className="absolute inset-[15%] sm:inset-[15%] rounded-full bg-neutral-800 border-2 sm:border-4 border-neutral-700 shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl sm:text-5xl lg:text-6xl mb-1 sm:mb-2">🃏</div>
              <div className="text-xs sm:text-sm text-neutral-500">Scrum Poker</div>
            </div>
          </div>
        </div>

        {/* Participants around the table */}
        {participants.map((participant, index) => {
          const isCurrentUser = participant.id === currentUserId;
          const colorClass = colors[index % colors.length];
          
          return (
            <div
              key={participant.id}
              className="absolute"
              style={getPositionStyle(index, participants.length)}
            >
              <div className="flex flex-col items-center scale-75 sm:scale-90 lg:scale-100">
                {/* Card Display */}
                <div className="mb-1 sm:mb-2">
                  {participant.hasVoted ? (
                    <div className={`
                      w-10 h-14 sm:w-12 sm:h-16 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl
                      ${showCards 
                        ? 'bg-gradient-to-br from-red-600 to-red-700' 
                        : 'bg-neutral-700 border-2 border-neutral-600'
                      }
                    `}>
                      {showCards ? participant.selectedCard : '?'}
                    </div>
                  ) : (
                    <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg border-2 border-dashed border-neutral-600 flex items-center justify-center text-neutral-600">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Avatar and Name */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg ${isCurrentUser ? 'ring-2 ring-white' : ''}`}>
                    {getInitials(participant.name)}
                  </div>
                  <div className="mt-1 text-[10px] sm:text-xs font-semibold text-white text-center max-w-[60px] sm:max-w-[80px] truncate">
                    {participant.name}
                    {isCurrentUser && ' (You)'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
