import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Portraits',
    description: 'Portraits dessinés ou peints à la main, à partir de vos photos.',
    items: ['Portrait crayon A4', 'Portrait couleur A3', 'Portrait de famille'],
    price: 'À partir de 25 000 FCFA',
    emoji: '🎨',
  },
  {
    title: 'Tasses',
    description: 'Imprimez vos photos, citations ou logos sur des tasses uniques.',
    items: ['Tasse classique', 'Tasse magique', 'Mug premium'],
    price: 'À partir de 8 000 FCFA',
    emoji: '☕',
  },
  {
    title: 'Textile',
    description: 'Sérigraphie et impression DTF de haute qualité.',
    items: ['T-shirt personnalisé', 'Hoodie brodé', 'Casquette'],
    price: 'À partir de 12 000 FCFA',
    emoji: '👕',
  },
  {
    title: 'Objets déco',
    description: 'Coussins, cadres photo, tableaux muraux et bien plus.',
    items: ['Coussin photo', 'Cadre artistique', 'Tableau mural'],
    price: 'À partir de 18 000 FCFA',
    emoji: '🏠',
  },
];

export default function Services() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
            Nos services
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6 text-ink-900">
            Découvrez tous nos <span className="text-gradient">services</span>
          </h1>
          <p className="text-lg text-gray-600">
            Du portrait intime à la décoration d'intérieur, nous créons sur mesure.
            Chaque pièce est unique, faite à la main à Brazzaville.
          </p>
        </div>
      </section>

      {/* Catégories */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-white rounded-3xl p-8 border border-red-100 shadow-sm card-hover">
              <div className="text-5xl mb-4">{cat.emoji}</div>
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-3">{cat.title}</h2>
              <p className="text-gray-600 mb-6">{cat.description}</p>
              <ul className="space-y-2 mb-6">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-red-50">
                <span className="font-display font-bold text-brand-600">{cat.price}</span>
                <Link to="/commander" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                  Commander →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl bg-brand-gradient p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 african-dots opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
              Un projet spécial ?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Décrivez-nous votre idée, nous créerons une pièce unique rien que pour vous.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:bg-red-50"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}