import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { STUDIO_INFO } from '../lib/constants';

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur border-b border-red-100 ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-105 transition">
                <span className="font-display font-black text-white text-lg">2MD</span>
              </div>
              <div className="leading-tight hidden sm:block">
                <span className="font-display font-bold text-xl block">{STUDIO_INFO.name}</span>
                <span className="text-xs text-brand-600 font-medium tracking-wider">
                   ART & DÉCO
                </span>
              </div>
            </Link>

            {/* Menu desktop */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-medium transition ${
                      isActive ? 'text-brand-600' : 'text-gray-700 hover:text-brand-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* CTA desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/commander"
                className="btn-shine px-6 py-2.5 bg-brand-gradient text-white font-semibold rounded-full shadow-lg shadow-red-500/30 hover:shadow-xl transition-all"
              >
                Commander
              </Link>
            </div>

            {/* Burger mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-red-50 transition"
              aria-label="Menu"
            >
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-red-100">
            <span className="font-display font-bold text-lg">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-red-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/commander"
              onClick={() => setMobileOpen(false)}
              className="block mt-4 text-center px-6 py-3 bg-brand-gradient text-white font-semibold rounded-full shadow-lg"
            >
              Commander
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}