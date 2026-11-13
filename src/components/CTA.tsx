import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-brand-gradient p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-red-500/30">
          {/* Blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute inset-0 african-dots opacity-20 pointer-events-none" />

          <div className="relative">
            <p className="font-script text-white text-3xl md:text-4xl mb-4">
              Prêt à démarrer ?
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6">
              Offrez-vous une pièce unique
            </h2>
            <p className="text-lg text-white/95 mb-10 max-w-2xl mx-auto">
              Rejoignez les centaines de clients qui nous font confiance à Brazzaville et partout au Congo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/commander"
                className="btn-shine inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:bg-red-50"
              >
                Commander maintenant
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/20 transition"
              >
                Voir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}