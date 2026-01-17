import { forwardRef } from 'react';
import { BingoCell } from '../BingoCell';
import type { BingoCard, CellIndex } from '../../types/bingo';

interface BingoBoardProps {
  card: BingoCard;
  highlightedCells?: CellIndex[];
  onCellClick?: (index: CellIndex) => void;
}

export const BingoBoard = forwardRef<HTMLDivElement, BingoBoardProps>(
  function BingoBoard({ card, highlightedCells = [], onCellClick }, ref) {
    const highlightedSet = new Set(highlightedCells);

    return (
      <div
        ref={ref}
        className="glass-card grid grid-cols-5 gap-2 p-4 max-w-[650px] mx-auto sm:gap-1 sm:p-3"
        role="grid"
        aria-label="ビンゴカード 5×5マス"
      >
        {card.goals.map((goal, index) => (
          <BingoCell
            key={index}
            goal={goal}
            completed={card.completed[index]}
            isHighlighted={highlightedSet.has(index)}
            onClick={() => onCellClick?.(index)}
            index={index}
          />
        ))}
      </div>
    );
  }
);
