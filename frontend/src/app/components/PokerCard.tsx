interface PokerCardProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

export function PokerCard({ value, isSelected, onClick }: PokerCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-20 h-28 rounded-xl shadow-lg transition-all transform hover:scale-110 hover:-translate-y-2
        ${isSelected 
          ? 'bg-red-600 text-white scale-105 ring-4 ring-red-400' 
          : 'bg-neutral-800 text-white hover:shadow-2xl border-2 border-neutral-700 hover:border-neutral-600'
        }
      `}
    >
      <div className="flex items-center justify-center h-full text-3xl font-bold">
        {value}
      </div>
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-neutral-900">
          <svg className="w-4 h-4 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}
