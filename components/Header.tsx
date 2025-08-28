import React from 'react';
import { useLocale } from '../i18n.ts';
import { FilmIcon } from './Icons.tsx';

export const Header = () => {
  const { t } = useLocale();
  return React.createElement('header', { className: "text-center" },
    React.createElement('div', { className: "inline-flex items-center gap-4" },
      React.createElement(FilmIcon),
      React.createElement('h1', { className: "text-4xl sm:text-5xl font-extrabold tracking-tight" },
        React.createElement('span', { className: "bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text" },
          t('appTitle')
        )
      )
    ),
    React.createElement('p', { className: "mt-4 text-lg text-slate-400" }, t('appSubtitle'))
  );
};
