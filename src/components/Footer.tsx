import { Link } from 'react-router-dom';
import { STUDIO_INFO } from '../lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
                <span className="font-display font-black text-white text-sm">2MD</span>
              </div>
              <span className="font-display font-bold text-white">{STUDIO_INFO.name}</span>
            </div>
            <p className="text-sm mb-4">Studio de création artistique et décoration à Brazzaville.</p>
            <p className="text-xs text-brand-400">Fait avec ❤ à Brazzaville, Congo</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Créations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogue?q=portrait" className="hover:text-brand-400 transition">Portraits</Link></li>
              <li><Link to="/catalogue?q=tasse" className="hover:text-brand-400 transition">Tasses</Link></li>
              <li><Link to="/catalogue?q=tee" className="hover:text-brand-400 transition">T-shirts</Link></li>
              <li><Link to="/catalogue?q=chapeau" className="hover:text-brand-400 transition">Chapeaux</Link></li>
              <li><Link to="/catalogue?q=coussin" className="hover:text-brand-400 transition">Coussins</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Studio</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/a-propos" className="hover:text-brand-400 transition">À propos</Link></li>
              <li><Link to="/catalogue" className="hover:text-brand-400 transition">Catalogue</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact rapide</h4>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{STUDIO_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">{STUDIO_INFO.email}</span>
              </li>
            </ul>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/1C1JHKknoF/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook 2MD Designer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-600 flex items-center justify-center transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <span className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-600 flex items-center justify-center transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
              </span>
              <a href="https://www.tiktok.com/@2md.designer.offi?_r=1&_t=ZN-9A4DTpJOpUs" target="_blank" rel="noopener noreferrer" aria-label="TikTok 2MD Designer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-600 flex items-center justify-center transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {year} {STUDIO_INFO.name} — {STUDIO_INFO.city}, {STUDIO_INFO.country}.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
  <Link to="/mentions-legales" className="hover:text-brand-400 transition">
    Mentions légales
  </Link>
  <Link to="/confidentialite" className="hover:text-brand-400 transition">
    Confidentialité
  </Link>
  <Link to="/cgv" className="hover:text-brand-400 transition">
    CGV
  </Link>
  <Link to="/cookies" className="hover:text-brand-400 transition">
    Cookies
  </Link>
</div>
        </div>
      </div>
    </footer>
  );
}
