import React from 'react';
import { useLocale } from '../i18n.ts';
import { ArrowDownTrayIcon, ArrowPathIcon } from './Icons.tsx';

export const VideoPlayer = ({ src, blob, onReset }) => {
  const { t } = useLocale();
    
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `animation_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return React.createElement('div', { className: "flex flex-col items-center gap-6" },
    React.createElement('h2', { className: "text-2xl font-bold text-green-400" }, t('successTitle')),
    React.createElement('video', {
      src: src,
      controls: true,
      autoPlay: true,
      loop: true,
      muted: true,
      playsInline: true,
      className: "w-full rounded-lg shadow-lg border border-slate-700"
    }),
    React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 w-full" },
      React.createElement('button', {
        onClick: handleDownload,
        className: "w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      },
        React.createElement(ArrowDownTrayIcon),
        t('downloadButton')
      ),
      React.createElement('button', {
        onClick: onReset,
        className: "w-full inline-flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      },
        React.createElement(ArrowPathIcon),
        t('createAnotherButton')
      )
    )
  );
};
