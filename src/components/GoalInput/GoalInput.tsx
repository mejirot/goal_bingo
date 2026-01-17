import {
  goalsToMarkdown,
  downloadMarkdown,
  parseMarkdownToGoals,
  readFileAsText,
} from '../../utils/exportUtils';

interface GoalInputProps {
  goals: string[];
  onGoalChange: (index: number, text: string) => void;
  onGoalsImport: (goals: string[]) => void;
  onComplete: () => void;
  canComplete: boolean;
}

export function GoalInput({
  goals,
  onGoalChange,
  onGoalsImport,
  onComplete,
  canComplete,
}: GoalInputProps) {
  const filledCount = goals.filter((g) => g.trim() !== '').length;

  const handleExport = () => {
    const markdown = goalsToMarkdown(goals);
    downloadMarkdown(markdown);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsText(file);
      const parsed = parseMarkdownToGoals(content);
      if (parsed) {
        onGoalsImport(parsed);
      } else {
        alert('ファイルから目標を読み込めませんでした。');
      }
    } catch {
      alert('ファイルの読み込みに失敗しました。');
    }

    // input をリセット（同じファイルを再選択可能に）
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      <p className="text-slate-700 text-center text-lg font-medium">
        25個の目標を入力してください
      </p>

      <div className="glass-card grid grid-cols-5 gap-2 p-4 max-w-[650px] mx-auto sm:gap-1 sm:p-3">
        {goals.map((goal, index) => (
          <div key={index} className="relative aspect-square">
            <label className="absolute -top-2 left-2 text-xs text-slate-500 bg-sky-200/60 px-1.5 rounded z-10">
              {index + 1}
            </label>
            <textarea
              value={goal}
              onChange={(e) => onGoalChange(index, e.target.value)}
              placeholder={`目標 ${index + 1}`}
              className="
                w-full h-full p-1.5 text-[0.85rem] leading-snug text-center
                bg-sky-100/50 backdrop-blur-sm
                border-2 border-sky-200 rounded-xl
                text-slate-700 placeholder:text-slate-400
                focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30
                focus:outline-none transition-all duration-200
                resize-none
                sm:text-[0.7rem]
              "
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-slate-600 text-sm">
          入力済み:{' '}
          <span className={`font-bold ${filledCount === 25 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {filledCount}
          </span>
          /25
        </p>

        {/* インポート/エクスポートボタン */}
        <div className="flex gap-3 w-full max-w-md">
          <label className="glass-button flex-1 px-4 py-2 text-slate-700 font-medium text-sm text-center cursor-pointer hover:scale-105 transition-transform">
            .mdインポート
            <input
              type="file"
              accept=".md"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            className="glass-button flex-1 px-4 py-2 text-slate-700 font-medium text-sm hover:scale-105 transition-transform"
            onClick={handleExport}
          >
            .mdエクスポート
          </button>
        </div>

        <button
          className={`
            w-full max-w-xs px-6 py-3 rounded-xl font-bold text-lg
            transition-all duration-300
            ${canComplete
              ? `
                bg-gradient-to-r from-sky-500 to-blue-500
                text-white shadow-lg
                hover:from-sky-600 hover:to-blue-600
                hover:scale-105 hover:shadow-xl
                active:scale-95
              `
              : `
                bg-slate-200 text-slate-400
                cursor-not-allowed
              `
            }
          `}
          onClick={onComplete}
          disabled={!canComplete}
        >
          ビンゴを開始する
        </button>
      </div>
    </div>
  );
}
