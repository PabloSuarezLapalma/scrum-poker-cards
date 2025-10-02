interface NameInputProps {
  onNameSubmit: (name: string) => void;
}

export function NameInput({ onNameSubmit }: NameInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-neutral-900 border-2 border-neutral-700 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          🃏 Scrum Poker
        </h1>
        <p className="text-center text-neutral-400 mb-6">
          Enter your name to get started
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-700 focus:border-red-500 outline-none transition-colors bg-neutral-800 text-white placeholder-neutral-500"
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Playing
          </button>
        </form>
      </div>
    </div>
  );
}
