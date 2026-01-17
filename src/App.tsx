import { useRef } from 'react';
import { BingoBoard } from './components/BingoBoard';
import { BingoResult } from './components/BingoResult';
import { GoalInput } from './components/GoalInput';
import { ImageExportButton } from './components/ImageExportButton';
import { useBingoState } from './hooks/useBingoState';
import { getInitialState, useAutoSave } from './hooks/useLocalStorage';
import { goalsToMarkdown, downloadMarkdown } from './utils/exportUtils';

function App() {
  const { state, actions, computed } = useBingoState(getInitialState());
  const bingoBoardRef = useRef<HTMLDivElement>(null);

  // 状態が変更されるたびに自動保存
  useAutoSave(state);

  const handleStartPlay = () => {
    actions.setMode('play');
  };

  const handleBackToInput = () => {
    actions.setMode('input');
  };

  const handleExportMarkdown = () => {
    const markdown = goalsToMarkdown(state.card.goals);
    downloadMarkdown(markdown);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 relative overflow-hidden">
      {/* 装飾的なBlobアニメーション */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-[600px] mx-auto px-4 py-6 min-h-screen">
        <header className="glass-card px-6 py-4 mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-700 drop-shadow-sm">
            目標ビンゴ
          </h1>
        </header>

        <main className="flex flex-col gap-5">
          {state.mode === 'input' ? (
            <GoalInput
              goals={state.card.goals}
              onGoalChange={actions.setGoal}
              onGoalsImport={actions.setGoals}
              onComplete={handleStartPlay}
              canComplete={computed.canStartPlay}
            />
          ) : (
            <>
              <BingoBoard
                ref={bingoBoardRef}
                card={state.card}
                highlightedCells={computed.highlightedCells}
                onCellClick={actions.toggleComplete}
              />

              <BingoResult
                completedCellCount={computed.completedCellCount}
                completedLineCount={computed.completedLineCount}
                isBingo={computed.isBingo}
              />

              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  className="glass-button px-6 py-3 text-slate-700 font-medium hover:scale-105"
                  onClick={handleBackToInput}
                >
                  目標を編集する
                </button>
                <ImageExportButton targetRef={bingoBoardRef} />
                <button
                  className="glass-button px-6 py-3 text-slate-700 font-medium hover:scale-105"
                  onClick={handleExportMarkdown}
                >
                  .mdエクスポート
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
