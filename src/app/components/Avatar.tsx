interface AvatarProps {
  name: string;
}

export function Avatar({ name }: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-neutral-700">
      {initials}
    </div>
  );
}
