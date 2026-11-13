import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  icon: string;
  lastUpdate: string;
  sections: Section[];
  children: ReactNode;
}

export default function LegalLayout({
  title,
  subtitle,
  icon,
  lastUpdate,
  sections,
  children,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState('');
  const { pathname } = useLocation();

  // Scroll top au changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  // Observer pour détecter la section active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-600 transition">Accueil</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-600 font-semibold">{title}</span>
        </nav>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-red-100 rounded-full mb-6">
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium text-brand-700">Document officiel</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 text-ink-900">
            {title}
          </h1>

          <p className="text-lg text-gray-600 mb-4 max-w-2xl">
            {subtitle}
          </p>

          <p className="text-sm text-gray-500">
            <strong>Dernière mise à jour :</strong> {lastUpdate}
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sommaire sticky */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <div className="bg-brand-50 rounded-2xl p-6 border border-red-100">
                <h3 className="font-display font-bold text-lg mb-4 text-ink-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Sommaire
                </h3>
                <nav className="space-y-1 text-sm">
                  {sections.map((section, i) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`block py-2 pl-3 border-l-[3px] transition ${
                        activeSection === section.id
                          ? 'border-brand-600 text-brand-600 bg-red-50'
                          : 'border-transparent text-gray-700 hover:border-brand-500 hover:text-brand-600'
                      }`}
                    >
                      {i + 1}. {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Autres documents */}
              <div className="mt-6 bg-white rounded-2xl p-5 border border-red-100">
                <p className="text-xs text-gray-500 mb-3 font-medium">Autres documents légaux :</p>
                <div className="space-y-2">
                  <Link to="/mentions-legales" className="block text-xs font-medium text-brand-600 hover:text-brand-700">
                    → Mentions légales
                  </Link>
                  <Link to="/confidentialite" className="block text-xs font-medium text-brand-600 hover:text-brand-700">
                    → Confidentialité
                  </Link>
                  <Link to="/cgv" className="block text-xs font-medium text-brand-600 hover:text-brand-700">
                    → CGV
                  </Link>
                  <Link to="/cookies" className="block text-xs font-medium text-brand-600 hover:text-brand-700">
                    → Cookies
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Contenu principal */}
          <article className="lg:col-span-3 legal-content">
            {children}
          </article>
        </div>
      </section>
    </div>
  );
}