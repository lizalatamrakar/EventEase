import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Ticket, ChevronDown, Zap, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';


export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm transition-all relative ${
      isActive
        ? 'text-brand-600 dark:text-brand-400 font-semibold'
        : 'text-slate-600 dark:text-white/70 hover:text-slate-950 dark:hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-lg font-bold text-gradient">EventEase</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            {user && <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink>}
            {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg glass-card hover:border-brand-500/40 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-brand-600" />
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  id="user-menu-btn"
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card hover:border-brand-500/40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-white">{user.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass-card shadow-lg z-50 animate-fade-in py-1">
                    <div className="px-4 py-2.5 border-b border-slate-200 dark:border-white/5">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-white/40 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <Ticket className="w-4 h-4" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-slate-200 dark:border-white/5 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-xs">Sign In</Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-3.5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-brand-600" />}
            </button>

            <button
              id="mobile-menu-btn"
              type="button"
              className="btn-ghost p-2"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t app-header py-4 px-4 space-y-1">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/events', label: 'Events' },
            ...(user ? [{ to: '/profile', label: 'Profile' }, { to: '/my-bookings', label: 'My Bookings' }] : []),
            ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-700 dark:text-white/70 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex flex-col gap-2">
            {user ? (
              <button
                type="button"
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="btn-ghost text-sm text-red-500 justify-start"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm justify-center">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm justify-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
