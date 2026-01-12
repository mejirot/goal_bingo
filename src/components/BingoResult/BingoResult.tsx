import { useEffect, useState } from 'react';
import './BingoResult.css';

interface BingoResultProps {
  completedCellCount: number;
  completedLineCount: number;
  isBingo: boolean;
}

export function BingoResult({
  completedCellCount,
  completedLineCount,
  isBingo,
}: BingoResultProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevLineCount, setPrevLineCount] = useState(completedLineCount);

  // 新しいビンゴラインが完成したときに演出を表示
  useEffect(() => {
    if (completedLineCount > prevLineCount && completedLineCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevLineCount(completedLineCount);
  }, [completedLineCount, prevLineCount]);

  const progressPercentage = (completedCellCount / 25) * 100;

  return (
    <div className="bingo-result">
      <div className="bingo-result-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="progress-text">
          達成: {completedCellCount}/25マス ({Math.round(progressPercentage)}%)
        </p>
      </div>

      <div className="bingo-result-lines">
        <p className="lines-text">
          ビンゴ: <span className="lines-count">{completedLineCount}</span>/12ライン
        </p>
      </div>

      {isBingo && (
        <div className={`bingo-celebration ${showCelebration ? 'animate' : ''}`}>
          <span className="celebration-emoji">🎉</span>
          <span className="celebration-text">BINGO!</span>
          <span className="celebration-emoji">🎉</span>
        </div>
      )}

      {showCelebration && !isBingo && completedLineCount > 0 && (
        <div className="line-complete-message">
          {completedLineCount}ライン達成!
        </div>
      )}
    </div>
  );
}
