import React, { useRef } from 'react';
import { useLocale } from '../i18n.ts';
import { PhotoIcon } from './Icons.tsx';

export const ImageUploader = ({ onImageSelect, previewUrl, disabled }) => {
  const { t } = useLocale();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return React.createElement('div', {
      onClick: handleClick,
      className: `relative w-full aspect-video border-2 border-dashed rounded-xl flex items-center justify-center text-center p-4 transition-all duration-300 ${
        disabled ? 'cursor-not-allowed bg-slate-800' : 'cursor-pointer bg-slate-800/50 hover:border-indigo-500 hover:bg-slate-800'
      } ${previewUrl ? 'border-indigo-500' : 'border-slate-600'}`
    },
    React.createElement('input', {
      type: "file",
      ref: fileInputRef,
      onChange: handleFileChange,
      accept: "image/png, image/jpeg",
      className: "hidden",
      disabled: disabled
    }),
    previewUrl ?
      React.createElement('img', { src: previewUrl, alt: "Preview", className: "max-h-full max-w-full object-contain rounded-lg" }) :
      React.createElement('div', { className: "flex flex-col items-center gap-2 text-slate-400" },
        React.createElement(PhotoIcon),
        React.createElement('p', { className: "font-semibold" }, t('uploadCTA')),
        React.createElement('p', { className: "text-sm text-slate-500" }, t('uploadHint'))
      )
  );
};
