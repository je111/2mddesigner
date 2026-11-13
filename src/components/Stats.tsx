const stats = [
  { value: '+500', label: 'Clients satisfaits' },
  { value: '+1200', label: 'Créations réalisées' },
  { value: '+2', label: "Années d'activité" },
  { value: '100%', label: 'Fait main au Congo' },
];

export default function Stats() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white rounded-3xl p-8 shadow-sm border border-red-100 card-hover"
            >
              <div className="font-display text-4xl md:text-5xl font-black text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}