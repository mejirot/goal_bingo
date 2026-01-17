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
    aspect-square p-1.5 rounded-xl
    cursor-pointer transition-all duration-200
    relative overflow-hidden
    font-inherit text-inherit
  `;

  // 状態に応じたスタイル
  const stateClasses = completed
    ? `
        bg-gradient-to-br from-emerald-400 to-emerald-500
        border-2 border-emerald-300 text-white
        shadow-[0_0_15px_rgba(34,197,94,0.4)]
      `
    : `
        bg-sky-50/80 backdrop-blur-sm
        border-2 border-sky-200 text-slate-700
        hover:bg-sky-100 hover:border-sky-300 hover:scale-[1.02]
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-sky-300
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
      <span className="text-[0.85rem] leading-snug text-center break-words whitespace-pre-line sm:text-[0.7rem]">
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
