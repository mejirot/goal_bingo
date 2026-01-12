import { useEffect, useState } from 'react';
import { BingoBoard } from './components/BingoBoard';
import { BingoResult } from './components/BingoResult';
import { GoalInput } from './components/GoalInput';
import { SharePanel } from './components/SharePanel';
import { useBingoState } from './hooks/useBingoState';
import { getInitialState, useAutoSave } from './hooks/useLocalStorage';
import { getCardFromUrl, clearShareParam } from './utils/shareUtils';
import type { AppState } from './types/bingo';

/**
 * 初期状態を決定する
 * 優先順位: URLパラメータ > localStorage > 新規作成
 */
function getStartupState(): AppState {
  // URLパラメータからカードを復元
  const sharedCard = getCardFromUrl();
  if (sharedCard) {
    // URLパラメータをクリア（履歴を汚さないため）
    clearShareParam();
    return {
      card: sharedCard,
      mode: 'play', // 共有カードはプレイモードで開く
    };
  }

  // localStorageから復元、またはデフォルト
  return getInitialState();
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { state, actions, computed } = useBingoState(getStartupState());

  // 初期化完了をマーク（URL復元の二重実行防止）
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // 状態が変更されるたびに自動保存（初期化後のみ）
  useAutoSave(isInitialized ? state : getInitialState());

  const handleStartPlay = () => {
    actions.setMode('play');
  };

  const handleBackToInput = () => {
    actions.setMode('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 relative overflow-hidden">
      {/* 装飾的なBlobアニメーション */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

      {/* メインコンテンツ */}
      <div className="relative z-10 max-w-[600px] mx-auto px-4 py-6 min-h-screen">
        <header className="glass-card px-6 py-4 mb-6 text-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            目標ビンゴ
          </h1>
        </header>

        <main className="flex flex-col gap-5">
          {state.mode === 'input' ? (
            <GoalInput
              goals={state.card.goals}
              onGoalChange={actions.setGoal}
              onComplete={handleStartPlay}
              canComplete={computed.canStartPlay}
            />
          ) : (
            <>
              <BingoBoard
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
                  className="glass-button px-6 py-3 text-white font-medium hover:scale-105"
                  onClick={handleBackToInput}
                >
                  目標を編集する
                </button>
              </div>

              <SharePanel card={state.card} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
