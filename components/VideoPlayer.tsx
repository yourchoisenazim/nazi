
import React from 'react';
import { ArrowDownTrayIcon, ArrowPathIcon } from './Icons';
import { useLocale } from '../i18n';

interface VideoPlayerProps {
  src: string;
  blob: Blob;
  onReset: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, blob, onReset }) => {
  const { t } = useLocale();
    
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `animation_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-green-400">{t('successTitle')}</h2>
      <video
        src={src}
        controls
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-lg shadow-lg border border-slate-700"
      />
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={handleDownload}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          <ArrowDownTrayIcon />
          {t('downloadButton')}
        </button>
        <button
          onClick={onReset}
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          <ArrowPathIcon />
          {t('createAnotherButton')}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
