import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import MobileNav from './MobileNav.jsx';
import AddBookModal from '../books/AddBookModal.jsx';
import { useBooks } from '../../context/BooksContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { getFocusableElements, trapTabKey } from '../../utils/focus.js';
import './AppShell.css';

export default function AppShell() {
  const { books, addBook } = useBooks();
  const { profile } = useProfile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookModal, setBookModal] = useState({ open: false, initialMode: 'search' });
  const [isCompactViewport, setIsCompactViewport] = useState(
    () => window.matchMedia('(max-width: 1023px)').matches,
  );
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('the-archive:theme') === 'light' ? 'light' : 'dark';
    } catch (error) {
      console.warn('Could not read the saved theme preference.', error);
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('the-archive:theme', theme);
    } catch (error) {
      console.warn('Could not save the theme preference.', error);
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const updateViewport = (event) => {
      setIsCompactViewport(event.matches);
      if (!event.matches) setMobileMenuOpen(false);
    };
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const navigation = document.getElementById('primary-navigation');
    getFocusableElements(navigation)[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setMobileMenuOpen(false);
      } else {
        trapTabKey(event, navigation);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [mobileMenuOpen]);

  const toggleNavigation = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setMobileMenuOpen((open) => !open);
      return;
    }
    setSidebarCollapsed((collapsed) => !collapsed);
  };

  const openBookModal = (initialMode) => {
    setBookModal({ open: true, initialMode });
  };

  return (
    <div className={`app-shell${sidebarCollapsed ? ' app-shell--sidebar-collapsed' : ''}`}>
      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
        profile={profile}
        mobileViewport={isCompactViewport}
        desktopCollapsed={sidebarCollapsed}
      />
      <button
        type="button"
        className={`app-shell__scrim${mobileMenuOpen ? ' is-visible' : ''}`}
        aria-label="Close navigation"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className="app-shell__main" inert={mobileMenuOpen}>
        <Header
          onMenuClick={toggleNavigation}
          onSearchClick={() => openBookModal('search')}
          onAddBookClick={() => openBookModal('manual')}
          mobileMenuOpen={mobileMenuOpen}
          profile={profile}
          navigationExpanded={isCompactViewport ? mobileMenuOpen : !sidebarCollapsed}
          theme={theme}
          setTheme={setTheme}
        />
        <main className="app-shell__content">
          <Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}>
            <Outlet context={{ theme, setTheme }} />
          </Suspense>
        </main>
      </div>
      <MobileNav navigationInert={mobileMenuOpen} />
      <AddBookModal
        open={bookModal.open}
        initialMode={bookModal.initialMode}
        onClose={() => setBookModal((current) => ({ ...current, open: false }))}
        onAddBook={addBook}
        books={books}
      />
    </div>
  );
}
