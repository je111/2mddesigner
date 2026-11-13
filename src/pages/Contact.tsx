import { useState } from 'react';
import { createContact } from '../hooks/useCreateContact';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Portrait personnalisé',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!form.name.trim() || !form.message.trim()) {
    setError('Merci de remplir votre nom et votre message.');
    return;
  }

  setSending(true);
  try {
    // 1. Enregistre le contact dans Firebase
    await createContact({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      projectType: form.projectType,
    });

    // 2. Envoie les emails (client + admin) — ne bloque pas si erreur
    try {
      await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: form.message,
            projectType: form.projectType,
          },
        }),
      });
    } catch (emailErr) {
      console.warn('⚠️ Erreur envoi email (non bloquant):', emailErr);
    }

    setSuccess(true);
    setForm({
      name: '',
      email: '',
      phone: '',
      projectType: 'Portrait personnalisé',
      message: '',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.';
    setError(message);
  } finally {
    setSending(false);
  }
};

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-semibold rounded-full mb-4 border border-red-100">
            Contact
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black mb-6 text-ink-900">
            Parlons de votre <span className="text-gradient">projet</span>
          </h1>
          <p className="text-lg text-gray-600">
            Une idée, un cadeau à personnaliser, un projet de décoration ?
            Écrivez-nous, nous vous répondons rapidement.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Infos */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-sm">
              <h2 className="font-display text-2xl font-bold mb-6 text-ink-900">Nos coordonnées</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">Atelier</div>
                    <div className="text-gray-600 text-sm">Avenue de la Paix, Brazzaville, Congo</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">Téléphone / WhatsApp</div>
                    <div className="text-gray-600 text-sm">+242 06 492 08 49</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">Email</div>
                    <div className="text-gray-600 text-sm break-all">2mddesigner@gmail.com</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">Horaires</div>
                    <div className="text-gray-600 text-sm">Lun – Dim : 8h – 18h</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-brand-gradient rounded-3xl p-6 text-white shadow-xl">
              <h3 className="font-display font-bold text-lg mb-2">Réponse rapide</h3>
              <p className="text-sm text-red-100">
                Nous nous engageons à vous répondre en moins de <strong className="text-white">24h</strong> en jours ouvrés.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-8">
            <h2 className="font-display text-2xl font-bold mb-6 text-ink-900">Envoyez-nous un message</h2>

            {success ? (
              <div className="p-8 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-green-800 mb-2">
                  Message envoyé !
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  Merci pour votre message. Nous vous répondrons très rapidement.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-sm text-green-700 hover:text-green-800 font-semibold underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-ink-900">
                      Nom complet <span className="text-brand-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-ink-900">Téléphone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+242 ..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-ink-900">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="vous@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-ink-900">Type de projet</label>
                  <select
                    value={form.projectType}
                    onChange={(e) => update('projectType', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition bg-white"
                  >
                    <option>Portrait personnalisé</option>
                    <option>Objet personnalisé</option>
                    <option>Textile</option>
                    <option>Décoration d'intérieur</option>
                    <option>Autre projet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-ink-900">
                    Votre message <span className="text-brand-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Décrivez votre projet..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-100 focus:border-brand-500 outline-none transition resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full btn-shine px-6 py-4 bg-brand-gradient text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoyer ma demande
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
