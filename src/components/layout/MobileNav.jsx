import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navSections, allNavItems } from '../navigation/navItems.js';
import { getFocusableElements, trapTabKey } from '../../utils/focus.js';
import './MobileNav.css';

const DYNAMIC_STORAGE_KEY = 'the-archive:mobile-nav-dynamic';

// The two middle slots. Dashboard and Library are fixed at 0 and 1.
const DEFAULT_DYNAMIC = ['/currently-reading', '/want-to-read'];

export default function MobileNav({ navigationInert = false }) {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreDialogRef = useRef(null);
  const moreTriggerRef = useRef(null);

  // Manage the 2 dynamic slots
  const [dynamicRoutes, setDynamicRoutes] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(DYNAMIC_STORAGE_KEY));
      if (Array.isArray(stored) && stored.length === 2) return stored;
    } catch { /* ignore */ }
    return DEFAULT_DYNAMIC;
  });

  useEffect(() => {
    localStorage.setItem(DYNAMIC_STORAGE_KEY, JSON.stringify(dynamicRoutes));
  }, [dynamicRoutes]);

  useEffect(() => {
    if (!moreOpen) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const appMain = document.querySelector('.app-shell__main');
    const previousMainInert = appMain?.inert ?? false;
    const primaryNav = document.querySelector('.mobile-nav');
    const previousNavInert = primaryNav?.inert ?? false;
    if (appMain) appMain.inert = true;
    if (primaryNav) primaryNav.inert = true;
    getFocusableElements(moreDialogRef.current)[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setMoreOpen(false);
      } else {
        trapTabKey(event, moreDialogRef.current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (appMain) appMain.inert = previousMainInert;
      if (primaryNav) primaryNav.inert = previousNavInert;
      const focusTarget = moreTriggerRef.current ?? previousFocus;
      if (focusTarget instanceof HTMLElement && focusTarget.isConnected) {
        focusTarget.focus();
      }
    };
  }, [moreOpen]);

  const pinnedRoutes = ['/', '/library'];

  // Build the 5 items: 2 pinned + 2 dynamic + More
  const navItems = [
    allNavItems.find(i => i.to === '/'),
    allNavItems.find(i => i.to === '/library'),
    allNavItems.find(i => i.to === dynamicRoutes[0]) || allNavItems.find(i => i.to === '/currently-reading'),
    allNavItems.find(i => i.to === dynamicRoutes[1]) || allNavItems.find(i => i.to === '/want-to-read'),
  ];

  // Determine active index for the sliding indicator
  const activeIndex = navItems.findIndex((item) => {
    if (item.to === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.to);
  });

  // When a user clicks something in the "More" sheet
  const handleDynamicSelect = (route) => {
    if (pinnedRoutes.includes(route)) return; // Shouldn't happen

    setDynamicRoutes((prev) => {
      // If it's already in the slots, don't change anything
      if (prev.includes(route)) return prev;
      // Otherwise, shift the oldest one out and add the new one
      return [prev[1], route];
    });
    setMoreOpen(false);
  };

  // All items available in the More sheet
  const secondaryItems = allNavItems.filter((item) => !pinnedRoutes.includes(item.to));

  return (
    <>
      <nav
        className="mobile-nav"
        aria-label="Primary"
        aria-hidden={navigationInert}
        inert={navigationInert}
      >
        {/* The smooth sliding background circle */}
        {activeIndex !== -1 && (
          <div
            className="mobile-nav__indicator"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeIndex === navItems.indexOf(item);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={`mobile-nav__item${isActive ? ' is-active' : ''}`}
            >
              <span className="mobile-nav__icon-wrap">
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="mobile-nav__label">
                {item.shortLabel ?? item.label}
              </span>
            </NavLink>
          );
        })}

        <button
          type="button"
          className={`mobile-nav__item${moreOpen ? ' is-active' : ''}`}
          onClick={() => setMoreOpen(true)}
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          ref={moreTriggerRef}
        >
          <span className="mobile-nav__icon-wrap">
            <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="mobile-nav__label">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div
          ref={moreDialogRef}
          className="mobile-more"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-more-title"
        >
          <div
            className="mobile-more__backdrop"
            aria-hidden="true"
            onClick={() => setMoreOpen(false)}
          />
          <div className="mobile-more__sheet">
            <div className="mobile-more__head">
              <h2 id="mobile-more-title" className="mobile-more__title">More</h2>
              <button
                type="button"
                className="mobile-more__close"
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <div className="mobile-more__grid">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isSlotActive = dynamicRoutes.includes(item.to);
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => handleDynamicSelect(item.to)}
                    className={`mobile-more__item${isSlotActive ? ' is-active' : ''}`}
                  >
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
