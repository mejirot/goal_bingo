import { useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { BingoCard } from '../../types/bingo';
import { generateShareUrl } from '../../utils/shareUtils';

interface SharePanelProps {
  card: BingoCard;
}

export function SharePanel({ card }: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = generateShareUrl(card);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: 選択してコピーを促す
      const input = document.querySelector<HTMLInputElement>('.share-url-input');
      if (input) {
        input.select();
      }
    }
  }, [shareUrl]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setCopied(false);
  };

  return (
    <div className="glass-card p-4">
      <button
        className="w-full glass-button px-6 py-3 text-slate-700 font-medium"
        onClick={handleToggle}
      >
        {isOpen ? '閉じる' : '共有する'}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <p className="text-slate-600 text-sm text-center">
            このURLを共有すると、同じビンゴカードを開けます
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              className="
                share-url-input flex-1 px-3 py-2.5 text-sm
                bg-sky-50 backdrop-blur-sm
                border border-sky-300 rounded-lg
                text-slate-700
                focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30
                focus:outline-none
              "
              value={shareUrl}
              readOnly
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              className={`
                px-5 py-2.5 rounded-lg font-medium
                transition-all duration-200
                ${copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-sky-500 text-white hover:bg-sky-600'
                }
              `}
              onClick={handleCopy}
            >
              {copied ? 'コピー済み' : 'コピー'}
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 pt-2">
            <p className="text-slate-500 text-sm">QRコード</p>
            <div className="bg-white p-3 rounded-xl">
              <QRCodeSVG value={shareUrl} size={160} level="M" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
