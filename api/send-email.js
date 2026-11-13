/**
 * Vercel Function : envoie un email via Brevo
 * POST /api/send-email
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, subject, htmlContent, replyTo } = req.body || {};

  if (!to || !to.email || !to.email.includes('@')) {
    return res.status(400).json({ error: 'Destinataire invalide' });
  }
  if (!subject || !htmlContent) {
    return res.status(400).json({ error: 'Sujet ou contenu manquant' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || '2mddesigner@gmail.com';
  const SENDER_NAME = process.env.BREVO_SENDER_NAME || '2MD Designer';

  if (!API_KEY) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: to.email, name: to.name || to.email }],
        replyTo: replyTo || undefined,
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo error:', errorText);
      return res.status(response.status).json({
        error: 'Échec de l\'envoi de l\'email',
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, messageId: data.messageId });
  } catch (error) {
    console.error('Erreur fetch Brevo:', error);
    return res.status(500).json({ error: error.message });
  }
}