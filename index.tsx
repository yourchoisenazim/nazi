import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { LocaleProvider } from './i18n.ts';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(LocaleProvider, null,
      React.createElement(App, null)
    )
  )
);
