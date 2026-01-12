interface BingoCellProps {
  goal: string;
  completed: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
  index?: number;
}

export function BingoCell({
  goal,
  completed,
  isHighlighted = false,
  onClick,
  index,
}: BingoCellProps) {
  const cellNumber = index !== undefined ? index + 1 : undefined;
  const ariaLabel = `目標${cellNumber ?? ''}: ${goal}。${completed ? '達成済み' : '未達成'}${isHighlighted ? '。ビンゴライン上' : ''}`;

  // 基本スタイル
  const baseClasses = `
    flex flex-col items-center justify-center
    aspect-square p-2 rounded-xl
    cursor-pointer transition-all duration-200
    relative overflow-hidden
    font-inherit text-inherit
  `;

  // 状態に応じたスタイル
  const stateClasses = completed
    ? `
        bg-gradient-to-br from-success-500/80 to-success-600/80
        border-2 border-success-400 text-white
        shadow-[0_0_20px_rgba(34,197,94,0.5)]
      `
    : `
        bg-white/30 backdrop-blur-sm
        border-2 border-white/40
        hover:bg-white/40 hover:border-white/60 hover:scale-[1.02]
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-white/50
      `;

  // ハイライト（ビンゴライン）スタイル
  const highlightClasses = isHighlighted
    ? `
        border-amber-400 border-[3px]
        shadow-[0_0_20px_rgba(251,191,36,0.6)]
        animate-pulse
      `
    : '';

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${highlightClasses}`}
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={completed}
    >
      <span className="text-[0.7rem] leading-tight text-center break-words line-clamp-4 sm:text-[0.6rem] sm:line-clamp-3">
        {goal}
      </span>
      {completed && (
        <span
          className="absolute top-1 right-1 text-sm font-bold"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  );
}
