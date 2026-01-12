import { BingoCell } from '../BingoCell';
import type { BingoCard, CellIndex } from '../../types/bingo';
import './BingoBoard.css';

interface BingoBoardProps {
  card: BingoCard;
  highlightedCells?: CellIndex[];
  onCellClick?: (index: CellIndex) => void;
}

export function BingoBoard({
  card,
  highlightedCells = [],
  onCellClick,
}: BingoBoardProps) {
  const highlightedSet = new Set(highlightedCells);

  return (
    <div className="bingo-board" role="grid" aria-label="ビンゴカード 5×5マス">
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
