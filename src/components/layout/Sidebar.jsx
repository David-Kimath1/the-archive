import { NavLink } from 'react-router-dom';
import { LibraryBig, UserRound, X } from 'lucide-react';
import { navSections } from '../navigation/navItems.js';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({
  mobileMenuOpen,
  onNavigate,
  profile,
  mobileViewport,
  desktopCollapsed,
}) {
  return (
    <aside
      id="primary-navigation"
      className={`sidebar${mobileMenuOpen ? ' sidebar--open' : ''}`}
      aria-label="Primary"
      role={mobileViewport && mobileMenuOpen ? 'dialog' : undefined}
      aria-modal={mobileViewport && mobileMenuOpen ? 'true' : undefined}
      aria-hidden={mobileViewport ? !mobileMenuOpen : desktopCollapsed}
      inert={mobileViewport ? !mobileMenuOpen : desktopCollapsed}
    >
      <div className="sidebar__brand">
        <LibraryBig
          className="sidebar__brand-mark"
          size={24}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className="sidebar__brand-name">The Archive</span>
        <button
          type="button"
          className="sidebar__close"
          onClick={onNavigate}
          aria-label="Close navigation"
        >
          <X size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar__nav">
        {navSections.map((section, idx) => (
          <div className="sidebar__section" key={section.label ?? `section-${idx}`}>
            {section.label && (
              <span className="sidebar__section-label">{section.label}</span>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `sidebar__nav-item${isActive ? ' is-active' : ''}`
                  }
                >
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <Link to="/settings" className="sidebar__user" onClick={onNavigate}>
          <span className="sidebar__user-avatar" aria-hidden="true">
            {profile.image
              ? <img src={profile.image} alt="" />
              : profile.name.trim().charAt(0).toUpperCase() || <UserRound size={16} />}
          </span>
          <span className="sidebar__user-info">
            <span className="sidebar__user-name">{profile.name}</span>
            <span className="sidebar__user-subtitle">Local account</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
