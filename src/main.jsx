import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyLanguage, detectLanguage } from './i18n/context';
import './index.css';

// Set lang/dir before the first paint so Arabic visitors never see an LTR flash
applyLanguage(detectLanguage());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
