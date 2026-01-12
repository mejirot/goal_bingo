import './GoalInput.css';

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
  return (
    <div className="goal-input">
      <p className="goal-input-description">
        25個の目標を入力してください
      </p>

      <div className="goal-input-grid">
        {goals.map((goal, index) => (
          <div key={index} className="goal-input-cell">
            <label className="goal-input-label">{index + 1}</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => onGoalChange(index, e.target.value)}
              placeholder={`目標 ${index + 1}`}
              className="goal-input-field"
            />
          </div>
        ))}
      </div>

      <div className="goal-input-footer">
        <p className="goal-input-count">
          入力済み: {goals.filter((g) => g.trim() !== '').length}/25
        </p>
        <button
          className="goal-input-submit"
          onClick={onComplete}
          disabled={!canComplete}
        >
          ビンゴを開始する
        </button>
      </div>
    </div>
  );
}
