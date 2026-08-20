import { Link } from 'react-router-dom';
import { Zap, Globe, Share2, ExternalLink, Mail } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="border-t app-footer mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-3">
              <span className="text-lg font-bold text-gradient">EventEase</span>
            </Link>
            <p className="text-slate-600 dark:text-white/50 text-sm leading-relaxed max-w-xs">
              Discover, book, and experience the best events in Nepal. Fast, simple, and accessible.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Globe, Share2, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social Link"
                  className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-brand-500/40 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white/80 mb-3">Explore</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/events', label: 'All Events' },
                { to: '/events?category=Music', label: 'Music' },
                { to: '/events?category=Tech', label: 'Technology' },
                { to: '/events?category=Sports', label: 'Sports' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-600 dark:text-white/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white/80 mb-3">Account</h3>
            <ul className="space-y-2">
              {[
                { to: '/login', label: 'Sign In' },
                { to: '/register', label: 'Register' },
                { to: '/my-bookings', label: 'My Bookings' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-600 dark:text-white/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-2">
              <a
                href="mailto:hello@eventease.com"
                className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> hello@eventease.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-slate-500 dark:text-white/30 text-xs">© 2026 EventEase. All rights reserved.</p>
          <p className="text-slate-500 dark:text-white/30 text-xs">College Project Prototype</p>
        </div>
      </div>
    </footer>
  );
}
