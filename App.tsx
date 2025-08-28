import React, { useState, useEffect, useCallback } from 'react';
import { useLocale } from './i18n.ts';
import { AppStatus } from './types.ts';
import { generateVideoFromImage } from './services/geminiService.ts';
import { Header } from './components/Header.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { PromptInput } from './components/PromptInput.tsx';
import { LoadingDisplay } from './components/LoadingDisplay.tsx';
import { VideoPlayer } from './components/VideoPlayer.tsx';
import { PlayCircleIcon, ArrowPathIcon } from './components/Icons.tsx';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result.split(',')[1]);
      } else {
        reject(new Error("Could not read file as a data URL string."));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const App = () => {
  const { t, locale, setLocale, availableLocales } = useLocale();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [status, setStatus] = useState(AppStatus.IDLE);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    
    // Cleanup function to revoke the object URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleImageSelect = useCallback(async (file) => {
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
      let messageToDisplay;
      if (err instanceof Error) {
        switch (err.message) {
          case 'SAFETY_ERROR':
            messageToDisplay = t('errorSafety');
            break;
          case 'QUOTA_ERROR':
            messageToDisplay = t('errorQuota');
            break;
          default:
            messageToDisplay = err.message;
        }
      } else {
        messageToDisplay = t('errorUnknown');
      }
      setError(messageToDisplay);
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
        return React.createElement(LoadingDisplay);
      case AppStatus.SUCCESS:
        return generatedVideo ?
          React.createElement(VideoPlayer, { src: generatedVideo.url, blob: generatedVideo.blob, onReset: handleReset }) :
          null;
      case AppStatus.ERROR:
        return React.createElement('div', { className: "text-center p-8 bg-red-900/20 rounded-lg" },
          React.createElement('p', { className: "text-red-400 font-semibold" }, t('animationFailed')),
          React.createElement('p', { className: "mt-2 text-red-300" }, error),
          React.createElement('button', {
            onClick: handleReset,
            className: "mt-6 inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          },
            React.createElement(ArrowPathIcon),
            t('tryAgainButton')
          )
        );
      default:
        return React.createElement('div', { className: "w-full flex flex-col gap-6" },
          React.createElement(ImageUploader, {
            onImageSelect: handleImageSelect,
            previewUrl: previewUrl,
            disabled: isGenerating
          }),
          React.createElement(PromptInput, {
            value: prompt,
            onChange: setPrompt,
            disabled: isGenerating
          }),
          React.createElement('button', {
            onClick: handleGenerate,
            disabled: !imageBase64 || !prompt || isGenerating,
            className: "w-full mt-2 inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 text-lg transform active:scale-95"
          },
            React.createElement(PlayCircleIcon),
            t('animateButton')
          )
        );
    }
  };

  return React.createElement('div', { className: "min-h-screen text-gray-200 flex flex-col items-center p-4 sm:p-6" },
    React.createElement(Header),
    React.createElement('main', { className: "w-full max-w-2xl mx-auto mt-8 p-6 sm:p-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-slate-700 backdrop-blur-sm" },
      renderContent()
    ),
    React.createElement('footer', { className: "text-center py-6 mt-8 text-slate-300 text-sm" },
      React.createElement('p', null, t('footerText')),
      React.createElement('div', { className: "mt-4" },
        React.createElement('select', {
          value: locale,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setLocale(e.target.value),
          className: "bg-slate-800 border border-slate-700 rounded-md py-1 px-2 text-slate-300 text-xs focus:ring-indigo-500 focus:border-indigo-500",
          'aria-label': "Select language"
        },
          availableLocales.map((loc) => (
            React.createElement('option', { key: loc, value: loc },
              loc.toUpperCase()
            )
          ))
        )
      )
    )
  );
};