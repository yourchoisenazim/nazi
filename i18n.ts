import React, { createContext, useState, useContext, ReactNode } from 'react';

const translations = {
  en: {
    appTitle: 'AI Image Animator',
    appSubtitle: 'Transform static images into dynamic videos with AI.',
    uploadCTA: 'Click to upload an image',
    uploadHint: 'PNG or JPG',
    promptLabel: 'Animation Prompt',
    promptPlaceholder: 'e.g., A photorealistic car driving down a sun-drenched road, cinematic...',
    animateButton: 'Animate Image',
    footerText: 'Powered by Gemini. Create amazing video animations from a single image.',
    errorFileRead: 'Failed to read the image file.',
    errorMissingInputs: 'Please upload an image and provide an animation prompt.',
    errorUnknown: 'An unknown error occurred during video generation.',
    animationFailed: 'Animation Failed',
    tryAgainButton: 'Try Again',
    loadingTitle: 'Animating Your Image',
    loadingMsg1: "Warming up the AI's imagination...",
    loadingMsg2: 'Gathering stardust and moonbeams...',
    loadingMsg3: 'Teaching pixels how to dance...',
    loadingMsg4: 'This can take a minute, great art needs patience.',
    loadingMsg5: 'Composing a symphony of motion...',
    loadingMsg6: 'Unleashing creative digital energy...',
    loadingMsg7: 'Almost there, the magic is happening!',
    successTitle: 'Animation Complete!',
    downloadButton: 'Download Video',
    createAnotherButton: 'Create Another',
  },
  es: {
    appTitle: 'Animador de Imágenes IA',
    appSubtitle: 'Transforma imágenes estáticas en videos dinámicos con IA.',
    uploadCTA: 'Haz clic para subir una imagen',
    uploadHint: 'PNG o JPG',
    promptLabel: 'Instrucción de Animación',
    promptPlaceholder: 'Ej: Un coche fotorrealista conduciendo por una carretera soleada, cinemático...',
    animateButton: 'Animar Imagen',
    footerText: 'Creado con Gemini. Crea increíbles animaciones de video a partir de una sola imagen.',
    errorFileRead: 'Error al leer el archivo de imagen.',
    errorMissingInputs: 'Por favor, sube una imagen y proporciona una instrucción de animación.',
    errorUnknown: 'Ocurrió un error desconocido durante la generación del video.',
    animationFailed: 'Falló la Animación',
    tryAgainButton: 'Intentar de Nuevo',
    loadingTitle: 'Animando Tu Imagen',
    loadingMsg1: 'Calentando la imaginación de la IA...',
    loadingMsg2: 'Recolectando polvo de estrellas y rayos de luna...',
    loadingMsg3: 'Enseñando a los píxeles a bailar...',
    loadingMsg4: 'Esto puede tardar un minuto, el gran arte necesita paciencia.',
    loadingMsg5: 'Componiendo una sinfonía de movimiento...',
    loadingMsg6: 'Liberando energía digital creativa...',
    loadingMsg7: '¡Casi listo, la magia está sucediendo!',
    successTitle: '¡Animación Completa!',
    downloadButton: 'Descargar Video',
    createAnotherButton: 'Crear Otro',
  },
  fr: {
    appTitle: "Animateur d'Image IA",
    appSubtitle: "Transformez des images statiques en vidéos dynamiques avec l'IA.",
    uploadCTA: 'Cliquez pour télécharger une image',
    uploadHint: 'PNG ou JPG',
    promptLabel: "Instruction d'Animation",
    promptPlaceholder: "Ex: Une voiture photoréaliste roulant sur une route ensoleillée, cinématique...",
    animateButton: "Animer l'Image",
    footerText: "Propulsé par Gemini. Créez d'incroyables animations vidéo à partir d'une seule image.",
    errorFileRead: "Échec de la lecture du fichier image.",
    errorMissingInputs: "Veuillez télécharger une image et fournir une instruction d'animation.",
    errorUnknown: "Une erreur inconnue s'est produite lors de la génération de la vidéo.",
    animationFailed: "L'animation a Échoué",
    tryAgainButton: 'Réessayer',
    loadingTitle: 'Animation de Votre Image',
    loadingMsg1: "Réchauffement de l'imagination de l'IA...",
    loadingMsg2: 'Collecte de poussière d’étoiles et de rayons de lune...',
    loadingMsg3: 'Apprendre aux pixels à danser...',
    loadingMsg4: 'Cela peut prendre une minute, le grand art demande de la patience.',
    loadingMsg5: 'Composition d’une symphonie du mouvement...',
    loadingMsg6: 'Libération de l’énergie numérique créative...',
    loadingMsg7: 'Presque terminé, la magie opère !',
    successTitle: 'Animation Terminée !',
    downloadButton: 'Télécharger la Vidéo',
    createAnotherButton: 'Créer une Autre',
  },
};

export type Locale = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['en'];

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.split(/[-_]/)[0];
  return browserLang in translations ? (browserLang as Locale) : 'en';
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  availableLocales: Locale[];
  loadingMessagesKeys: TranslationKey[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale());

  const t = (key: TranslationKey): string => {
    return translations[locale]?.[key] || translations['en'][key] || key;
  };
  
  const availableLocales = Object.keys(translations) as Locale[];
  const loadingMessagesKeys: TranslationKey[] = [
    'loadingMsg1', 'loadingMsg2', 'loadingMsg3', 'loadingMsg4', 'loadingMsg5', 'loadingMsg6', 'loadingMsg7'
  ];

  const value = { locale, setLocale, t, availableLocales, loadingMessagesKeys };

  return React.createElement(LocaleContext.Provider, { value }, children);
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};