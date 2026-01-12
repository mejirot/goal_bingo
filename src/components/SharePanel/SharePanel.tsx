import { useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { BingoCard } from '../../types/bingo';
import { generateShareUrl } from '../../utils/shareUtils';
import './SharePanel.css';

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
    <div className="share-panel">
      <button className="share-toggle-button" onClick={handleToggle}>
        {isOpen ? '閉じる' : '共有する'}
      </button>

      {isOpen && (
        <div className="share-content">
          <p className="share-description">
            このURLを共有すると、同じビンゴカードを開けます
          </p>

          <div className="share-url-container">
            <input
              type="text"
              className="share-url-input"
              value={shareUrl}
              readOnly
              onClick={(e) => e.currentTarget.select()}
            />
            <button className="share-copy-button" onClick={handleCopy}>
              {copied ? 'コピー済み' : 'コピー'}
            </button>
          </div>

          <div className="share-qr-container">
            <p className="share-qr-label">QRコード</p>
            <QRCodeSVG value={shareUrl} size={160} level="M" />
          </div>
        </div>
      )}
    </div>
  );
}
