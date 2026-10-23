import { Link, useLocation } from 'react-router-dom';
import { LibraryBig, Search } from 'lucide-react';
import { allNavItems } from '../navigation/navItems.js';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import './Header.css';

function resolvePageTitle(pathname) {
  const match = allNavItems.find((item) => {
    if (item.to === '/') return pathname === '/';
    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  });
  return match?.label ?? 'The Archive';
}

export default function Header({
  onMenuClick,
  onSearchClick,
  onAddBookClick,
  navigationExpanded,
  mobileMenuOpen,
  profile,
  theme,
  setTheme,
}) {
  const { pathname } = useLocation();
  const pageTitle = resolvePageTitle(pathname);

  return (
    <header className={`header${mobileMenuOpen ? ' header--menu-open' : ''}`}>
      <div className="header__leading">
        <LibraryBig className="header__brand-mark" size={22} strokeWidth={1.8} aria-hidden="true" />
        <span className="header__brand">The Archive</span>
        <h2 className="header__page-title">{pageTitle}</h2>
      </div>

      <div className="header__actions">
        <ThemeToggle theme={theme} onChange={setTheme} />
        <button
          type="button"
          className="header__action"
          aria-label="Search"
          onClick={onSearchClick}
        >
          <Search size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="header__action header__action--primary"
          aria-label="Add book"
          onClick={onAddBookClick}
        >
          <span className="header__action-label">Add Book</span>
        </button>

        <Link
          to="/settings"
          className="header__avatar"
          aria-label={`Profile settings for ${profile.name}`}
        >
          {profile.image
            ? <img src={profile.image} alt="" />
            : <span>{profile.name.trim().charAt(0).toUpperCase()}</span>}
        </Link>

        <button
          type="button"
          className="header__action header__menu"
          onClick={onMenuClick}
          aria-label={navigationExpanded ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navigationExpanded}
          aria-controls="primary-navigation"
        >
          <span className="header__menu-bars" aria-hidden="true">
            <span className="header__menu-bar header__menu-bar--top" />
            <span className="header__menu-bar header__menu-bar--middle" />
            <span className="header__menu-bar header__menu-bar--bottom" />
          </span>
        </button>
      </div>
    </header>
  );
}
