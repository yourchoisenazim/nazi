
import React, { useRef } from 'react';
import { PhotoIcon } from './Icons';
import { useLocale } from '../i18n';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl, disabled }) => {
  const { t } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative w-full aspect-video border-2 border-dashed rounded-xl flex items-center justify-center text-center p-4 transition-all duration-300 ${
        disabled ? 'cursor-not-allowed bg-slate-800' : 'cursor-pointer bg-slate-800/50 hover:border-indigo-500 hover:bg-slate-800'
      } ${previewUrl ? 'border-indigo-500' : 'border-slate-600'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="hidden"
        disabled={disabled}
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <PhotoIcon />
          <p className="font-semibold">{t('uploadCTA')}</p>
          <p className="text-sm text-slate-500">{t('uploadHint')}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
