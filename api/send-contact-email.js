/**
 * Vercel Function : envoie les emails de contact
 * POST /api/send-contact-email
 * Body : { contact }
 * Envoie 2 emails :
 *  - Au client (confirmation)
 *  - À l'admin (notification nouveau message)
 */

import { guard, BREVO_TIMEOUT_MS } from './_guard.js';

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  const { contact } = req.body || {};

  if (!contact || !contact.name || !contact.message) {
    return res.status(400).json({ error: 'Données de contact invalides' });
  }

  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || '2mddesigner@gmail.com';
  const SENDER_NAME = process.env.BREVO_SENDER_NAME || '2MD Designer';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '2mddesigner@gmail.com';
  const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '242064920849';
  const LOGO_URL =
    process.env.BREVO_LOGO_URL ||
    'https://res.cloudinary.com/ioochnlo/image/upload/v1790624599/2md_designer.png';

  if (!API_KEY) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  const escapeHtml = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  // ============================================
  // EMAIL 1 : CLIENT (confirmation)
  // ============================================
  const clientSubject = `✅ Nous avons bien reçu votre message`;
  const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9fafb;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05); max-width:600px; width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#ef4444,#b91c1c); padding:32px 24px; text-align:center;">
          <img src="${LOGO_URL}" alt="2MD Designer" width="80" height="80" style="width:80px; height:80px; object-fit:contain; margin:0 auto 16px; display:block; background:#ffffff; border-radius:16px; padding:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <h1 style="color:#ffffff; margin:16px 0 4px; font-size:24px; font-weight:900;">Merci ${escapeHtml(contact.name)} !</h1>
          <p style="color:rgba(255,255,255,0.9); margin:0; font-size:14px;">Nous avons bien reçu votre message</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:32px 24px;">

          <p style="font-size:15px; color:#3f3f46; margin:0 0 24px; line-height:1.6;">
            Nous vous remercions pour votre message. Notre équipe vous répondra
            <strong>sous 24h</strong> (jours ouvrés).
          </p>

          <!-- Copie du message -->
          <div style="background:#fef2f2; border-radius:12px; padding:20px; margin-bottom:24px;">
            <h2 style="font-size:14px; color:#dc2626; margin:0 0 12px; text-transform:uppercase; letter-spacing:1px;">📝 Votre message</h2>
            <p style="font-size:14px; color:#3f3f46; margin:0; line-height:1.6; white-space:pre-wrap;">${escapeHtml(contact.message)}</p>
          </div>

          <!-- Récap -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #fee2e2; border-radius:12px; overflow:hidden; margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:13px; color:#71717a;">Nom</td>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:13px; color:#18181b; font-weight:600; text-align:right;">${escapeHtml(contact.name)}</td>
            </tr>
            ${contact.projectType ? `
            <tr>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:13px; color:#71717a;">Type de projet</td>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:13px; color:#18181b; font-weight:600; text-align:right;">${escapeHtml(contact.projectType)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:12px 16px; font-size:13px; color:#71717a;">Reçu le</td>
              <td style="padding:12px 16px; font-size:13px; color:#18181b; font-weight:600; text-align:right;">${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          </table>

          <!-- CTA WhatsApp -->
          <p style="font-size:14px; color:#3f3f46; margin:0 0 16px;">
            Besoin d'une réponse rapide ? Contactez-nous directement sur WhatsApp :
          </p>
          <table role="presentation" width="100%"><tr><td align="center">
            <a href="https://wa.me/${WHATSAPP_NUMBER}" style="display:inline-block; background:#22c55e; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:bold; font-size:14px;">
              📱 Nous écrire sur WhatsApp
            </a>
          </td></tr></table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9fafb; padding:24px; text-align:center; border-top:1px solid #fee2e2;">
          <p style="font-size:13px; color:#71717a; margin:0 0 6px; font-weight:600;">2MD Designer</p>
          <p style="font-size:12px; color:#a1a1aa; margin:0 0 6px;">Studio de création artistique & décoration</p>
          <p style="font-size:11px; color:#a1a1aa; margin:0;">Brazzaville, République du Congo 🇨🇬</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;

  // ============================================
  // EMAIL 2 : ADMIN (notification)
  // ============================================
  const adminSubject = `📬 Nouveau message — ${escapeHtml(contact.name)}`;
  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:32px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:16px; overflow:hidden; max-width:600px; width:100%;">

        <!-- HEADER -->
        <tr><td style="background:linear-gradient(135deg,#ef4444,#b91c1c); padding:24px; text-align:center;">
          <img src="${LOGO_URL}" alt="2MD Designer" width="64" height="64" style="width:64px; height:64px; object-fit:contain; margin:0 auto 12px; display:block; background:#ffffff; border-radius:12px; padding:6px;">
          <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:900;">📬 Nouveau message !</h1>
          <p style="color:rgba(255,255,255,0.9); margin:8px 0 0; font-size:14px;">Via le formulaire de contact</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:28px 24px;">

          <!-- Client -->
          <h2 style="font-size:13px; color:#dc2626; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px; font-weight:700;">👤 Client</h2>
          <table role="presentation" width="100%" style="background:#fef2f2; border-radius:12px; margin-bottom:24px;">
            <tr><td style="padding:16px; font-size:14px; color:#3f3f46; line-height:1.8;">
              <strong style="color:#18181b; font-size:16px;">${escapeHtml(contact.name)}</strong><br>
              ${contact.phone ? `📞 ${escapeHtml(contact.phone)}<br>` : ''}
              ${contact.email ? `✉️ ${escapeHtml(contact.email)}<br>` : ''}
              ${contact.projectType ? `📦 ${escapeHtml(contact.projectType)}` : ''}
            </td></tr>
          </table>

          <!-- Message -->
          <h2 style="font-size:13px; color:#dc2626; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px; font-weight:700;">💬 Message</h2>
          <table role="presentation" width="100%" style="background:#fef2f2; border-radius:12px; margin-bottom:24px;">
            <tr><td style="padding:16px; font-size:14px; color:#3f3f46; line-height:1.7; white-space:pre-wrap;">${escapeHtml(contact.message)}</td></tr>
          </table>

          <!-- Actions -->
          <table role="presentation" width="100%">
            <tr>
              <td align="center" style="padding-top:8px;">
                ${contact.phone ? `
                  <a href="https://wa.me/${String(contact.phone).replace(/\D/g, '')}" style="display:inline-block; background:#22c55e; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:10px; font-weight:bold; font-size:14px; margin:4px;">
                    📱 WhatsApp
                  </a>
                ` : ''}
                ${contact.email ? `
                  <a href="mailto:${escapeHtml(contact.email)}" style="display:inline-block; background:#dc2626; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:10px; font-weight:bold; font-size:14px; margin:4px;">
                    ✉️ Répondre par email
                  </a>
                ` : ''}
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #fee2e2;">
          <p style="font-size:12px; color:#a1a1aa; margin:0;">2MD Designer — Admin</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;

  // ============================================
  // ENVOI DES 2 EMAILS
  // ============================================
  try {
    const emailsToSend = [];

    // Email au client (uniquement si email fourni)
    if (contact.email) {
      emailsToSend.push({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: contact.email, name: contact.name }],
        subject: clientSubject,
        htmlContent: clientHtml,
      });
    }

    // Email à l'admin (toujours)
    emailsToSend.push({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: ADMIN_EMAIL, name: 'Admin 2MD' }],
      subject: adminSubject,
      htmlContent: adminHtml,
      replyTo: contact.email
        ? { email: contact.email, name: contact.name }
        : undefined,
    });

    const results = await Promise.allSettled(
      emailsToSend.map((email) =>
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify(email),
          signal: AbortSignal.timeout(BREVO_TIMEOUT_MS),
        }).then(async (r) => {
          if (!r.ok) throw new Error(await r.text());
          return r.json();
        })
      )
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected');

    if (failed.length > 0) {
      console.error('Emails échoués:', failed.map((f) => f.reason?.message || f.reason));
    }

    return res.status(200).json({
      success: true,
      sent,
      total: emailsToSend.length,
    });
  } catch (error) {
    console.error('Erreur envoi emails:', error);
    return res.status(500).json({ error: error.message });
  }
}