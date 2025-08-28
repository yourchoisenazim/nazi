import React, { useState, createContext, useContext } from 'react';

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
    errorSafety: 'The request was blocked due to safety policies. Please try a different image or prompt.',
    errorQuota: "You've exceeded your API quota. Please check your plan and billing details, and try again later.",
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
    errorSafety: 'La solicitud fue bloqueada por políticas de seguridad. Por favor, intenta con una imagen o instrucción diferente.',
    errorQuota: 'Has excedido tu cuota de API. Por favor, revisa tu plan y detalles de facturación, e inténtalo de nuevo más tarde.',
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
    errorSafety: "La demande a été bloquée pour des raisons de sécurité. Veuillez essayer une autre image ou une autre instruction.",
    errorQuota: "Vous avez dépassé votre quota d'API. Veuillez vérifier votre forfait et vos informations de facturation, puis réessayez plus tard.",
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

const getInitialLocale = () => {
  if (typeof window === 'undefined') return 'en';
  const browserLang = navigator.language.split(/[-_]/)[0];
  return browserLang in translations ? browserLang : 'en';
};

const LocaleContext = createContext(undefined);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(getInitialLocale());

  const t = (key) => {
    return translations[locale]?.[key] || translations['en'][key] || key;
  };
  
  const availableLocales = Object.keys(translations);
  const loadingMessagesKeys = [
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