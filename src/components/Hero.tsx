import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden pattern-red">
      {/* Blobs décoratifs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-brand-200 rounded-full filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-40 -right-32 w-96 h-96 bg-brand-400 rounded-full filter blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ============================================ */}
          {/* TEXTE */}
          {/* ============================================ */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-full mb-6">
              <span className="w-2 h-2 bg-brand-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-brand-700">
                Studio créatif • Brazzaville, Congo
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-ink-900">
              L'art qui vous <span className="text-gradient">ressemble</span>,<br />
              façonné à Brazzaville
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
              Portraits personnalisés, créations artistiques sur mesure et décoration d'intérieur.{' '}
              <span className="font-script text-brand-600 text-2xl">2MD Designer</span> transforme
              vos idées en œuvres uniques — tasses, t-shirts, chapeaux, porte-clés, coussins et bien plus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/contact"
                className="btn-shine group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gradient text-white font-semibold rounded-full shadow-xl shadow-red-500/30 hover:shadow-2xl transition-all"
              >
                Demander un devis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-brand-200 text-ink-900 font-semibold rounded-full hover:border-brand-500 hover:bg-brand-50 transition-all"
              >
                <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Voir nos créations
              </Link>
            </div>

            {/* Preuve sociale */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  BE
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  NO
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-700 to-brand-900 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              
            </div>
          </div>

          {/* ============================================ */}
          {/* VISUEL */}
          {/* ============================================ */}
          <div className="relative order-1 lg:order-2">
            {/* Carte principale avec image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/5] relative bg-gradient-to-br from-brand-500 to-brand-800">
                {/* Image de fond */}
                <img
                  src="https://res.cloudinary.com/ioochnlo/image/upload/w_800,h_1000,c_fill,q_auto,f_auto/v1790591113/2md-designer/orders/twygwbpi2jmazlbchthn.png"
                  alt="Création 2MD Designer — Portrait personnalisé fait main à Brazzaville"
                  className="w-full h-full object-cover"
                  loading="eager"
                />

                {/* Motif africain léger */}
                <div className="absolute inset-0 african-dots opacity-10 pointer-events-none" />

                {/* Overlay dégradé rouge en bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/20 to-transparent pointer-events-none" />

                {/* Texte en bas */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
                  <p className="font-script text-3xl mb-1 drop-shadow-lg">
                    Portrait sur mesure
                  </p>
                  <p className="text-white/90 text-sm drop-shadow">
                    Fait main à Brazzaville
                  </p>
                </div>
              </div>
            </div>

            {/* Badge flottant 1 — en haut à droite */}
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-300 to-brand-500 shadow-xl rotate-6 flex items-center justify-center animate-float">
              <svg className="w-12 h-12 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-3l-3 3-3-3H4a2 2 0 01-2-2V4z" />
              </svg>
            </div>

            {/* Badge flottant 2 — en bas à gauche */}
            <div
              className="absolute -bottom-6 -left-6 w-40 h-40 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-xl -rotate-3 flex items-center justify-center animate-float"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="text-center text-white">
                <svg className="w-14 h-14 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="font-script text-lg">Tasse personnalisée</span>
              </div>
            </div>

            {/* Badge localisation — en bas à droite */}
            <div className="absolute bottom-4 right-4 glass px-4 py-3 rounded-2xl shadow-xl border border-red-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Atelier</div>
                <div className="text-sm font-bold text-ink-900">Brazzaville</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}