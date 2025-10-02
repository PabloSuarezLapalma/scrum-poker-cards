interface VoteSummaryProps {
  participants: Array<{
    id: string;
    name: string;
    selectedCard: string | null;
    hasVoted: boolean;
  }>;
  showCards: boolean;
}

export function VoteSummary({ participants, showCards }: VoteSummaryProps) {
  // Only calculate when cards are revealed
  if (!showCards) {
    return null;
  }

  // Get all voted cards
  const votedCards = participants
    .filter(p => p.hasVoted && p.selectedCard)
    .map(p => p.selectedCard as string);

  if (votedCards.length === 0) {
    return null;
  }

  // Filter numeric values and calculate average
  const numericVotes = votedCards
    .map(card => parseFloat(card))
    .filter(num => !isNaN(num));

  // Calculate statistics
  const hasNumericVotes = numericVotes.length > 0;
  const average = hasNumericVotes 
    ? numericVotes.reduce((sum, val) => sum + val, 0) / numericVotes.length 
    : 0;
  const min = hasNumericVotes ? Math.min(...numericVotes) : 0;
  const max = hasNumericVotes ? Math.max(...numericVotes) : 0;

  // Count frequency of each vote
  const voteCounts = votedCards.reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find most common vote(s)
  const maxCount = Math.max(...Object.values(voteCounts));
  const mostCommon = Object.entries(voteCounts)
    .filter(([, count]) => count === maxCount)
    .map(([card]) => card);

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-700 p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-bold text-white mb-3">Vote Summary</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* Average */}
        {hasNumericVotes && (
          <div className="bg-neutral-800 rounded-lg p-2 sm:p-3 text-center border border-neutral-700">
            <div className="text-[10px] sm:text-xs text-neutral-400 mb-1">Average</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-500">
              {average.toFixed(1)}
            </div>
          </div>
        )}

        {/* Minimum */}
        {hasNumericVotes && (
          <div className="bg-neutral-800 rounded-lg p-2 sm:p-3 text-center border border-neutral-700">
            <div className="text-[10px] sm:text-xs text-neutral-400 mb-1">Min</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500">
              {min}
            </div>
          </div>
        )}

        {/* Maximum */}
        {hasNumericVotes && (
          <div className="bg-neutral-800 rounded-lg p-2 sm:p-3 text-center border border-neutral-700">
            <div className="text-[10px] sm:text-xs text-neutral-400 mb-1">Max</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500">
              {max}
            </div>
          </div>
        )}

        {/* Most Common */}
        <div className="bg-neutral-800 rounded-lg p-2 sm:p-3 text-center border border-neutral-700">
          <div className="text-[10px] sm:text-xs text-neutral-400 mb-1">Most Common</div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-500">
            {mostCommon.length === 1 ? mostCommon[0] : mostCommon.join(', ')}
          </div>
        </div>
      </div>

      {/* Vote Distribution */}
      <div className="mt-3 pt-3 border-t border-neutral-700">
        <h4 className="text-xs sm:text-sm font-semibold text-neutral-400 mb-2">Distribution</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(voteCounts)
            .sort((a, b) => {
              const numA = parseFloat(a[0]);
              const numB = parseFloat(b[0]);
              if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
              }
              return a[0].localeCompare(b[0]);
            })
            .map(([card, count]) => (
              <div
                key={card}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-lg border border-neutral-600"
              >
                <span className="text-white font-bold text-sm sm:text-base">{card}</span>
                <span className="text-neutral-400 text-xs sm:text-sm">×{count}</span>
              </div>
            ))}
        </div>
      </div>

      {!hasNumericVotes && votedCards.length > 0 && (
        <p className="mt-3 text-xs sm:text-sm text-neutral-500 italic">
          * Numeric statistics are not available for non-numeric votes
        </p>
      )}
    </div>
  );
}
