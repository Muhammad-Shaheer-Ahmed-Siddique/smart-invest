import { cn } from '@/lib/cn';

const COLORS = [
  'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
];

function getColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  const sizeClass = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' }[size];
  const color = getColor(initials);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white select-none',
        sizeClass,
        color,
        className
      )}
    >
      {initials}
    </div>
  );
}
