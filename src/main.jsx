import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BooksProvider } from './context/BooksContext.jsx';
import { QuotesProvider } from './context/QuotesContext.jsx';
import { GoalsProvider } from './context/GoalsContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import './styles/index.css';

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch((error) => console.error('The Archive could not register its offline service worker.', error));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BooksProvider>
      <QuotesProvider>
        <GoalsProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </GoalsProvider>
      </QuotesProvider>
    </BooksProvider>
  </StrictMode>
);
