
import React, { useState, useEffect } from 'react';
import { LoadingSpinnerIcon } from './Icons';
import { useLocale, TranslationKey } from '../i18n';

const LoadingDisplay: React.FC = () => {
  const { t, loadingMessagesKeys } = useLocale();
  const [messageKey, setMessageKey] = useState<TranslationKey>(loadingMessagesKeys[0]);

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

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-6 text-center">
      <LoadingSpinnerIcon />
      <h2 className="text-2xl font-bold text-indigo-400">{t('loadingTitle')}</h2>
      <p className="text-slate-400 min-h-[40px]">{t(messageKey)}</p>
    </div>
  );
};

export default LoadingDisplay;
