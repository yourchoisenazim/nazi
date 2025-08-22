
import React from 'react';
import { FilmIcon } from './Icons';
import { useLocale } from '../i18n';

const Header: React.FC = () => {
  const { t } = useLocale();
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4">
        <FilmIcon />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
            {t('appTitle')}
          </span>
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">{t('appSubtitle')}</p>
    </header>
  );
};

export default Header;
