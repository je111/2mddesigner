const services = [
  {
    title: 'Tasses personnalisées',
    description: 'Imprimez vos photos, citations ou logos sur des tasses uniques.',
    image: 'https://res.cloudinary.com/ioochnlo/image/upload/w_500,h_280,c_fill,q_auto,f_auto/v1790586441/2md-designer/catalogue/vvd6zc7rz9fclpu6dpce.jpg',
  },
  {
    title: 'T-shirts & hoodies',
    description: 'Sérigraphie et impression DTF de haute qualité.',
    image: 'https://res.cloudinary.com/ioochnlo/image/upload/w_500,h_280,c_fill,q_auto,f_auto/v1790587670/2md-designer/catalogue/shjavr5fbu8mpxlft46v.jpg',
  },
  {
    title: 'Chapeaux & casquettes',
    description: 'Brodés ou imprimés, personnalisés à votre image.',
    image: 'https://res.cloudinary.com/ioochnlo/image/upload/w_500,h_280,c_fill,q_auto,f_auto/v1790615359/2md-designer/catalogue/qbpwsqkjgoyneztlhorn.jpg',
  },
  {
    title: 'Porte-clés souvenirs',
    description: 'Petits objets personnalisés à offrir : photos, noms, dates.',
    image: 'https://res.cloudinary.com/ioochnlo/image/upload/w_500,h_280,c_fill,q_auto,f_auto/v1790625869/porte_cl%C3%A9.jpg',
  },
  {
    title: 'Coussins déco',
    description: 'Transformez vos photos en coussins décoratifs.',
    image: 'https://res.cloudinary.com/ioochnlo/image/upload/w_500,h_280,c_fill,q_auto,f_auto/v1790587740/2md-designer/catalogue/p0u8j7vuzzc3xflrrpk1.jpg',
  },
  {
    title: 'Bijoux & Chaînes personnalisées',
    description: 'Chaînes et bijoux personnalisés avec vos photos ou symboles.',
    image: 'https://res.cloudinary.com/ioochnlo/image/upload/w_500,h_280,c_fill,q_auto,f_auto/v1790468757/2md-designer/catalogue/zotqbq6udmqyjvzwfcw0.jpg',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-1.5 bg-white text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
            Nos services
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 text-ink-900">
            Créations <span className="text-gradient">uniques</span> & sur mesure
          </h2>
          <p className="text-gray-600">
            Chaque pièce est pensée, dessinée et réalisée avec soin dans notre atelier à Brazzaville.
          </p>
        </div>

        {/* Grille services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service) => (
            <div
              key={service.title}
              className="card-hover bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden group"
            >
              {/* Image courte (16:9) */}
              <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-800">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/30 transition duration-300" />
              </div>

              {/* Contenu compact */}
              <div className="p-4">
                <h3 className="font-display text-base font-bold mb-2 text-ink-900 group-hover:text-brand-600 transition leading-snug">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bas de section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4 text-sm">
            Vous avez un projet spécial ? Nous réalisons aussi <strong>la décoration d'intérieur</strong> et des <strong>œuvres sur mesure</strong>.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink-900 text-white font-semibold rounded-full hover:bg-brand-600 transition text-sm"
          >
            Discuter de mon projet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}