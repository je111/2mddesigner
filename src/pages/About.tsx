import { Link } from 'react-router-dom';

const values = [
  { icon: '❤️', title: 'Passion', desc: 'Nous mettons tout notre cœur dans chaque projet.' },
  { icon: '✓', title: 'Qualité', desc: 'Des matériaux soigneusement choisis et un travail minutieux.' },
  { icon: '🤝', title: 'Proximité', desc: 'Nous écoutons et construisons ensemble avec vous.' },
  { icon: '🌍', title: 'Culture', desc: 'Nous puisons dans la richesse de la culture congolaise.' },
  { icon: '⚡', title: 'Réactivité', desc: 'Des délais tenus, une communication fluide.' },
  { icon: '💡', title: 'Innovation', desc: 'Nous cherchons toujours de nouvelles techniques.' },
];

const team = [
  { initials: 'MD', name: 'Morci D.', role: ' Directeur artistique' },
  { initials: 'JC', name: 'Jessy C.', role: 'Dévéloppeur et Data Analyse ' },
  { initials: 'JK', name: 'Josué K.', role: 'Designer textile' },
  { initials: 'CM', name: 'Chancelle M.', role: "Décoration d'intérieur" },
];

export default function About() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
            À propos
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6 text-ink-900">
            Un studio, une <span className="text-gradient">passion</span>
          </h1>
          <p className="text-lg text-gray-600">
            2MD Designer est né d'une envie simple : créer des œuvres qui touchent le cœur
            et racontent une histoire. Basé à Brazzaville.
          </p>
        </div>
      </section>

      {/* Histoire */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-3xl border border-red-100 p-8 md:p-12 shadow-sm">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-6 text-ink-900">
            Notre <span className="text-gradient">histoire</span>
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              2MD Designer a vu le jour en <strong>2023</strong> à Brazzaville, dans un petit
              atelier installé à la maison. Un petit ordinateur, une imprimante et une passion
              immense : il n'en fallait pas plus pour créer de la magie.
            </p>
            <p>
              Après une année de travail acharné, nous avons franchi un cap en ouvrant notre
              propre atelier au bord du goudron, plus proche de vous.
            </p>
            <p>
              Au fil des années, notre atelier est devenu le <strong>rendez-vous des stars</strong>,
              un véritable lieu de rencontre pour les artistes, les familles, les entreprises et
              tous ceux qui recherchent une création authentique.
            </p>
            <p>
              Aujourd'hui, <strong>2MD Designer</strong> collabore avec des artistes de la scène
              congolaise et continue de grandir tout en gardant ce qui fait notre force :
              l'écoute, la qualité et l'amour du travail bien fait.
            </p>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '+500', label: 'Clients satisfaits' },
            { value: '+1200', label: 'Créations réalisées' },
            { value: '+3', label: "Années d'activité" },
            { value: '100%', label: 'Fait main au Congo' },
          ].map((s) => (
            <div key={s.label} className="text-center bg-white rounded-3xl p-6 border border-red-100">
              <div className="font-display text-4xl font-black text-gradient mb-2">{s.value}</div>
              <div className="text-xs text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-black text-ink-900">
            Nos <span className="text-gradient">valeurs</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white p-6 rounded-2xl border border-red-100 card-hover">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-display font-bold text-lg mb-2 text-ink-900">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Équipe */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-black text-ink-900">
            Notre <span className="text-gradient">équipe</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.name} className="text-center bg-white rounded-3xl p-6 border border-red-100 card-hover">
              <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="font-display font-black text-white text-2xl">{m.initials}</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-1 text-ink-900">{m.name}</h3>
              <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider">{m.role}</p>
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
              Créons ensemble
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Parlons de votre projet. Nous serons ravis de vous accompagner.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transition hover:bg-red-50"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}