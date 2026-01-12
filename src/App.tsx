import { useEffect, useState } from 'react';
import { BingoBoard } from './components/BingoBoard';
import { BingoResult } from './components/BingoResult';
import { GoalInput } from './components/GoalInput';
import { SharePanel } from './components/SharePanel';
import { useBingoState } from './hooks/useBingoState';
import { getInitialState, useAutoSave } from './hooks/useLocalStorage';
import { getCardFromUrl, clearShareParam } from './utils/shareUtils';
import type { AppState } from './types/bingo';
import './App.css';

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
    <div className="app">
      <header className="app-header">
        <h1>目標ビンゴ</h1>
      </header>

      <main className="app-main">
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

            <div className="app-actions">
              <button className="back-button" onClick={handleBackToInput}>
                目標を編集する
              </button>
            </div>

            <SharePanel card={state.card} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
