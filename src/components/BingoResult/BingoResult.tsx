import { useEffect, useState } from 'react';

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
    <div className="glass-card p-5 space-y-4">
      {/* プログレスバー */}
      <div className="space-y-2">
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-white/90 text-sm text-center">
          達成: {completedCellCount}/25マス ({Math.round(progressPercentage)}%)
        </p>
      </div>

      {/* ライン数 */}
      <div className="text-center">
        <p className="text-white/90">
          ビンゴ:{' '}
          <span className="text-2xl font-bold text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            {completedLineCount}
          </span>
          /12ライン
        </p>
      </div>

      {/* ビンゴ達成演出 */}
      {isBingo && (
        <div
          className={`
            bg-gradient-to-r from-amber-500/80 to-orange-500/80
            rounded-xl p-4 text-center
            shadow-[0_0_30px_rgba(251,191,36,0.6)]
            ${showCelebration ? 'animate-bounce' : ''}
          `}
        >
          <span className="text-3xl animate-bounce inline-block">🎉</span>
          <span className="text-2xl font-bold text-white mx-3 tracking-widest drop-shadow-lg">
            BINGO!
          </span>
          <span className="text-3xl animate-bounce inline-block">🎉</span>
        </div>
      )}

      {/* ライン達成通知 */}
      {showCelebration && !isBingo && completedLineCount > 0 && (
        <div className="bg-gradient-to-r from-primary-500/80 to-primary-600/80 rounded-xl p-3 text-center text-white font-bold animate-pulse">
          {completedLineCount}ライン達成!
        </div>
      )}
    </div>
  );
}
