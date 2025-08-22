
import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus } from './types';
import { generateVideoFromImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import LoadingDisplay from './components/LoadingDisplay';
import VideoPlayer from './components/VideoPlayer';
import { ArrowPathIcon, PlayCircleIcon } from './components/Icons';
import { useLocale, Locale } from './i18n';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix e.g. "data:image/png;base64,"
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};


const App: React.FC = () => {
  const { t, locale, setLocale, availableLocales } = useLocale();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedVideo, setGeneratedVideo] = useState<{ url: string; blob: Blob } | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setImageFile(file);
    setStatus(AppStatus.UPLOADING);
    try {
      const b64 = await fileToBase64(file);
      setImageBase64(b64);
      setStatus(AppStatus.IDLE);
    } catch (err) {
      setError(t('errorFileRead'));
      setStatus(AppStatus.ERROR);
    }
  }, [t]);

  const handleGenerate = async () => {
    if (!imageBase64 || !prompt) {
      setError(t('errorMissingInputs'));
      return;
    }
    setError(null);
    setStatus(AppStatus.GENERATING);
    setGeneratedVideo(null);

    try {
      const videoResult = await generateVideoFromImage(imageBase64, imageFile?.type || 'image/jpeg', prompt);
      setGeneratedVideo(videoResult);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t('errorUnknown'));
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageBase64(null);
    setPrompt('');
    setGeneratedVideo(null);
    setError(null);
    setStatus(AppStatus.IDLE);
  };
  
  const isGenerating = status === AppStatus.GENERATING;

  const renderContent = () => {
    switch (status) {
      case AppStatus.GENERATING:
        return <LoadingDisplay />;
      case AppStatus.SUCCESS:
        return generatedVideo ? (
          <VideoPlayer src={generatedVideo.url} blob={generatedVideo.blob} onReset={handleReset} />
        ) : null;
      case AppStatus.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/20 rounded-lg">
            <p className="text-red-400 font-semibold">{t('animationFailed')}</p>
            <p className="mt-2 text-red-300">{error}</p>
            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <ArrowPathIcon />
              {t('tryAgainButton')}
            </button>
          </div>
        );
      default:
        return (
          <div className="w-full flex flex-col gap-6">
            <ImageUploader 
              onImageSelect={handleImageSelect}
              previewUrl={imageFile ? URL.createObjectURL(imageFile) : null} 
              disabled={isGenerating}
            />
            <PromptInput 
              value={prompt} 
              onChange={setPrompt}
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={!imageBase64 || !prompt || isGenerating}
              className="w-full mt-2 inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 text-lg transform active:scale-95"
            >
              <PlayCircleIcon />
              {t('animateButton')}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center p-4 sm:p-6">
      <Header />
      <main className="w-full max-w-2xl mx-auto mt-8 p-6 sm:p-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-slate-700 backdrop-blur-sm">
        {renderContent()}
      </main>
      <footer className="text-center py-6 mt-8 text-slate-500 text-sm">
        <p>{t('footerText')}</p>
        <div className="mt-4">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="bg-slate-800 border border-slate-700 rounded-md py-1 px-2 text-slate-300 text-xs focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Select language"
          >
            {availableLocales.map((loc) => (
              <option key={loc} value={loc}>
                {loc.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </div>
  );
};

export default App;
