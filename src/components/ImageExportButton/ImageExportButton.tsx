import { useState, useCallback } from 'react';
import {
  exportElementAsPng,
  downloadImage,
  generateDefaultFilename,
} from '../../utils/imageExportUtils';

interface ImageExportButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

type ExportState = 'idle' | 'exporting' | 'success' | 'error';

export function ImageExportButton({ targetRef }: ImageExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle');

  const handleExport = useCallback(async () => {
    if (!targetRef.current) {
      console.error('Export target not found');
      return;
    }

    setState('exporting');

    try {
      const dataUrl = await exportElementAsPng(targetRef.current, {
        pixelRatio: 2,
        backgroundColor: '#e0f2fe',
      });

      downloadImage(dataUrl, generateDefaultFilename());
      setState('success');

      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      console.error('Failed to export image:', error);
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  }, [targetRef]);

  const buttonText = {
    idle: '画像として保存',
    exporting: '変換中...',
    success: '保存しました',
    error: 'エラー',
  }[state];

  const buttonClasses = {
    idle: 'glass-button text-slate-700 hover:scale-105',
    exporting: 'bg-slate-400 text-white cursor-wait',
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
  }[state];

  return (
    <button
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${buttonClasses}`}
      onClick={handleExport}
      disabled={state === 'exporting'}
    >
      {buttonText}
    </button>
  );
}
