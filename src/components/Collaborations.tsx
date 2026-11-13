import { BookOpen, ExternalLink, FileText, Mail, Wrench, Zap } from 'lucide-react';

const jchub = {
  name: 'JcHub',
  logo: '/jchub-logo-256-jchub.svg',
  url: 'https://jchub.dev',
  email: 'hello@jchub.dev',
  tagline: 'Made in Brazzaville · Français & English',
  description:
    "JcHub.dev est une boîte à outils et une plateforme de ressources gratuites pour les développeurs, créateurs et équipes techniques, portée par une équipe basée à Brazzaville.",
  features: [
    {
      icon: Wrench,
      title: 'Outils de développement',
      desc: 'Utilisables directement dans le navigateur.',
      items: [
        'JSON Formatter & Validator',
        'Décodeur JWT',
        'Regex Tester visuel',
        'Générateur d’UUID (v1, v4, v7)',
        'API Cost Calculator',
        'Aperçu Markdown → HTML',
      ],
    },
    {
      icon: FileText,
      title: 'Ressources gratuites',
      desc: 'Des documents prêts à l’emploi pour vos projets numériques.',
      items: [
        'Cheat sheets en ligne ou en PDF, sans inscription',
        'Checklist de lancement de site web',
        'Modèles Word envoyés par e-mail',
      ],
    },
    {
      icon: BookOpen,
      title: 'Blog & guides',
      desc: 'Tutoriels, retours d’expérience et conseils méthodologiques sur le développement et la création numérique.',
      items: [],
    },
  ],
};

export default function Collaborations() {
  return (
    <section
      id="collaborations"
      className="py-20 md:py-28 bg-brand-600 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-400/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-10 african-dots pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* EN-TÊTE */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-4 py-1.5 bg-white/15 text-white text-sm font-semibold rounded-full mb-4 backdrop-blur">
            Nos partenaires
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-6">
            Ils nous font <span className="font-script text-red-200">confiance</span>
          </h2>
          <p className="text-lg text-red-100">
            2MD Designer collabore avec des partenaires tech congolais pour créer des projets
            uniques.
          </p>
        </div>

        {/* PARTENAIRE TECH */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4" aria-hidden="true" />
              Partenaire tech
            </span>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-center mb-10">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-white p-3 shadow-2xl flex items-center justify-center">
                <img
                  src={jchub.logo}
                  alt={`Logo ${jchub.name}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-3 text-center md:text-left">
              <h3 className="font-display text-3xl md:text-4xl font-black mb-2">{jchub.name}</h3>
              <p className="text-red-200 text-sm font-semibold mb-4">{jchub.tagline}</p>
              <p className="text-red-50 leading-relaxed mb-6">{jchub.description}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href={jchub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-full shadow-xl hover:shadow-2xl hover:bg-red-50 transition"
                >
                  Visiter le site
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${jchub.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 text-white font-semibold rounded-full hover:bg-white/10 transition"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {jchub.email}
                </a>
              </div>
            </div>
          </div>

          {/* CE QUE PROPOSE JCHUB */}
          <div className="grid md:grid-cols-3 gap-4">
            {jchub.features.map(({ icon: Icon, title, desc, items }) => (
              <div key={title} className="bg-white/10 border border-white/15 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-brand-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h4 className="font-display font-bold text-lg">{title}</h4>
                </div>
                <p className="text-sm text-red-100 mb-3">{desc}</p>
                {items.length > 0 && (
                  <ul className="space-y-1.5 text-sm text-red-50">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-red-200" aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-red-100 mb-6 font-script text-2xl">
            « Chaque projet raconte une histoire — la vôtre. »
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:bg-red-50"
          >
            Collaborer avec nous
          </a>
        </div>
      </div>
    </section>
  );
}
