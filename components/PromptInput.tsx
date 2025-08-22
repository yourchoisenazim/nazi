
import React from 'react';
import { useLocale } from '../i18n';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  const { t } = useLocale();
  return (
    <div>
      <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
        {t('promptLabel')}
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={t('promptPlaceholder')}
        rows={3}
        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:cursor-not-allowed disabled:bg-slate-800"
      />
    </div>
  );
};

export default PromptInput;
