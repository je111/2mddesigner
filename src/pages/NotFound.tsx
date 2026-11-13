import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-32">
      <div className="text-center">
        <div className="font-display text-9xl font-black text-gradient mb-4">404</div>
        <h1 className="font-display text-3xl md:text-4xl font-black text-ink-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oups, cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gradient text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}