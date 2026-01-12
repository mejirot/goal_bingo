import './BingoCell.css';

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
  const classNames = [
    'bingo-cell',
    completed ? 'completed' : '',
    isHighlighted ? 'highlighted' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cellNumber = index !== undefined ? index + 1 : undefined;
  const ariaLabel = `目標${cellNumber ?? ''}: ${goal}。${completed ? '達成済み' : '未達成'}${isHighlighted ? '。ビンゴライン上' : ''}`;

  return (
    <button
      className={classNames}
      onClick={onClick}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={completed}
    >
      <span className="bingo-cell-text">{goal}</span>
      {completed && <span className="bingo-cell-check" aria-hidden="true">✓</span>}
    </button>
  );
}
