interface GoalInputProps {
  goals: string[];
  onGoalChange: (index: number, text: string) => void;
  onComplete: () => void;
  canComplete: boolean;
}

export function GoalInput({
  goals,
  onGoalChange,
  onComplete,
  canComplete,
}: GoalInputProps) {
  const filledCount = goals.filter((g) => g.trim() !== '').length;

  return (
    <div className="glass-card p-5 space-y-5">
      <p className="text-white/90 text-center text-lg font-medium">
        25個の目標を入力してください
      </p>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-3 sm:gap-1.5">
        {goals.map((goal, index) => (
          <div key={index} className="relative">
            <label className="absolute -top-2 left-2 text-xs text-white/60 bg-white/10 px-1.5 rounded z-10">
              {index + 1}
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => onGoalChange(index, e.target.value)}
              placeholder={`目標 ${index + 1}`}
              className="
                w-full px-3 py-2.5 text-sm
                bg-white/30 backdrop-blur-sm
                border border-white/40 rounded-lg
                text-white placeholder:text-white/40
                focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30
                focus:outline-none transition-all duration-200
              "
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-white/80 text-sm">
          入力済み:{' '}
          <span className={`font-bold ${filledCount === 25 ? 'text-success-400' : 'text-amber-300'}`}>
            {filledCount}
          </span>
          /25
        </p>
        <button
          className={`
            w-full max-w-xs px-6 py-3 rounded-xl font-bold text-lg
            transition-all duration-300
            ${canComplete
              ? `
                bg-gradient-to-r from-primary-500 to-primary-600
                text-white shadow-lg
                hover:from-primary-600 hover:to-primary-700
                hover:scale-105 hover:shadow-xl
                active:scale-95
              `
              : `
                bg-white/20 text-white/50
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
