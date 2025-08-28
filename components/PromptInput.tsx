import React from 'react';
import { useLocale } from '../i18n.ts';

export const PromptInput = ({ value, onChange, disabled }) => {
  const { t } = useLocale();
  return React.createElement('div', null,
    React.createElement('label', { htmlFor: "prompt", className: "block text-sm font-medium text-slate-300 mb-2" },
      t('promptLabel')
    ),
    React.createElement('textarea', {
      id: "prompt",
      value: value,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
      disabled: disabled,
      placeholder: t('promptPlaceholder'),
      rows: 3,
      className: "w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:cursor-not-allowed disabled:bg-slate-800"
    })
  );
};