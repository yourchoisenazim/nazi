import React, { useState, useEffect } from 'react';
import { useLocale } from '../i18n.ts';
import { LoadingSpinnerIcon } from './Icons.tsx';

export const LoadingDisplay = () => {
  const { t, loadingMessagesKeys } = useLocale();
  const [messageKey, setMessageKey] = useState(loadingMessagesKeys[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageKey(prevKey => {
        const currentIndex = loadingMessagesKeys.indexOf(prevKey);
        const nextIndex = (currentIndex + 1) % loadingMessagesKeys.length;
        return loadingMessagesKeys[nextIndex];
      });
    }, 3500);

    return () => clearInterval(intervalId);
  }, [loadingMessagesKeys]);

  return React.createElement('div', { className: "flex flex-col items-center justify-center p-8 gap-6 text-center" },
    React.createElement(LoadingSpinnerIcon),
    React.createElement('h2', { className: "text-2xl font-bold text-indigo-400" }, t('loadingTitle')),
    React.createElement('p', { className: "text-slate-400 min-h-[40px]" }, t(messageKey))
  );
};
