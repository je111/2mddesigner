/**
 * Vercel Function : envoie les emails de commande (client + admin)
 * POST /api/send-order-email
 * Body : { order }
 */

import { guard, BREVO_TIMEOUT_MS } from './_guard.js';

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  const { order } = req.body || {};

  if (!order || !order.clientName || !order.total) {
    return res.status(400).json({ error: 'Données de commande invalides' });
  }

  // Configuration
  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || '2mddesigner@gmail.com';
  const SENDER_NAME = process.env.BREVO_SENDER_NAME || '2MD Designer';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '2mddesigner@gmail.com';
  const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '242064920849';
  const MTN_MONEY_NUMBER = process.env.MTN_MONEY_NUMBER || '+242 06 492 08 49';
  const LOGO_URL = process.env.BREVO_LOGO_URL || 'https://res.cloudinary.com/ioochnlo/image/upload/v1790624599/2md_designer.png';

  if (!API_KEY) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ error: 'Configuration serveur incomplète' });
  }

  // Helpers
  const formatPrice = (n) =>
    Math.round(n || 0).toLocaleString('fr-FR').replace(/\u202f/g, ' ') + ' FCFA';
  const shortId = (order.id || '').slice(-8).toUpperCase();

  // ============================================
  // EMAIL 1 : CLIENT
  // ============================================
  const clientSubject = `✅ Confirmation de commande — ORD-${shortId}`;
  const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9fafb;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05); max-width:600px; width:100%;">

        <!-- HEADER avec logo -->
        <tr><td style="background:linear-gradient(135deg,#ef4444,#b91c1c); padding:32px 24px; text-align:center;">
          <img src="${LOGO_URL}" alt="2MD Designer" width="80" height="80" style="width:80px; height:80px; object-fit:contain; margin:0 auto 16px; display:block; background:#ffffff; border-radius:16px; padding:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <h1 style="color:#ffffff; margin:16px 0 4px; font-size:24px; font-weight:900;">Merci ${order.clientName} !</h1>
          <p style="color:rgba(255,255,255,0.9); margin:0; font-size:14px;">Votre commande a bien été reçue</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:32px 24px;">

          <p style="font-size:15px; color:#3f3f46; margin:0 0 24px; line-height:1.6;">
            Nous avons bien reçu votre commande <strong>ORD-${shortId}</strong>.
            Pour lancer la fabrication, merci d'effectuer votre paiement.
          </p>

          <!-- Montant à payer -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg,#ef4444,#b91c1c); border-radius:12px; margin-bottom:24px;">
            <tr><td style="padding:24px; text-align:center; color:#ffffff;">
              <div style="font-size:12px; opacity:0.9; margin-bottom:6px; text-transform:uppercase; letter-spacing:1px;">
                ${order.paymentMode === 'deposit' ? 'Acompte à envoyer (50%)' : 'Montant total à envoyer'}
              </div>
              <div style="font-size:32px; font-weight:900; line-height:1.1;">${formatPrice(order.paymentAmount)}</div>
              ${order.paymentMode === 'deposit' ? `<div style="font-size:13px; opacity:0.9; margin-top:8px;">Reste à la livraison : ${formatPrice(order.remaining)}</div>` : ''}
            </td></tr>
          </table>

          <!-- MTN Money -->
          <div style="background:#fef2f2; border-radius:12px; padding:20px; margin-bottom:24px;">
            <h2 style="font-size:16px; color:#18181b; margin:0 0 12px; font-weight:700;">💳 Paiement par MTN Money</h2>
            <p style="font-size:14px; color:#3f3f46; margin:0 0 12px;">
              Envoyez <strong>${formatPrice(order.paymentAmount)}</strong> au numéro :
            </p>
            <div style="background:#ffffff; border-radius:8px; padding:14px; font-family:'Courier New',monospace; font-size:18px; font-weight:bold; color:#dc2626; text-align:center; letter-spacing:1px;">
              ${MTN_MONEY_NUMBER}
            </div>
            <p style="font-size:12px; color:#71717a; margin:12px 0 0;">
              Motif à indiquer : <strong style="color:#dc2626;">ORD-${shortId}</strong>
            </p>
          </div>

          <!-- Récapitulatif -->
          <h2 style="font-size:16px; color:#18181b; margin:0 0 12px; font-weight:700;">📦 Récapitulatif</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #fee2e2; border-radius:12px; overflow:hidden; margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#71717a;">Produit</td>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#18181b; font-weight:600; text-align:right;">${order.product}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#71717a;">Quantité</td>
              <td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#18181b; font-weight:600; text-align:right;">${order.quantity}</td>
            </tr>
            ${order.format ? `<tr><td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#71717a;">Format</td><td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#18181b; font-weight:600; text-align:right;">${order.format}</td></tr>` : ''}
            ${order.style ? `<tr><td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#71717a;">Style</td><td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#18181b; font-weight:600; text-align:right;">${order.style}</td></tr>` : ''}
            ${order.customText ? `<tr><td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#71717a;">Texte</td><td style="padding:12px 16px; border-bottom:1px solid #fee2e2; font-size:14px; color:#18181b; font-weight:600; text-align:right;">${order.customText}</td></tr>` : ''}
            <tr>
              <td style="padding:12px 16px; font-size:14px; color:#71717a;">Total</td>
              <td style="padding:12px 16px; font-size:16px; color:#dc2626; font-weight:900; text-align:right;">${formatPrice(order.total)}</td>
            </tr>
          </table>

          <!-- WhatsApp -->
          <p style="font-size:14px; color:#3f3f46; margin:0 0 16px; line-height:1.6;">
            Une fois le paiement effectué, envoyez-nous la preuve sur WhatsApp :
          </p>
          <table role="presentation" width="100%"><tr><td align="center">
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour 2MD Designer, voici ma preuve de paiement pour la commande ORD-${shortId}`)}"
               style="display:inline-block; background:#22c55e; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:bold; font-size:14px;">
              📱 Envoyer la preuve sur WhatsApp
            </a>
          </td></tr></table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9fafb; padding:24px; text-align:center; border-top:1px solid #fee2e2;">
          <p style="font-size:13px; color:#71717a; margin:0 0 6px; font-weight:600;">
            2MD Designer
          </p>
          <p style="font-size:12px; color:#a1a1aa; margin:0 0 6px;">
            Studio de création artistique & décoration
          </p>
          <p style="font-size:11px; color:#a1a1aa; margin:0;">
            Brazzaville, République du Congo 🇨🇬
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;

  // ============================================
  // EMAIL 2 : ADMIN
  // ============================================
  const adminSubject = `🎉 Nouvelle commande — ORD-${shortId} — ${order.product}`;
  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:32px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:16px; overflow:hidden; max-width:600px; width:100%;">

        <!-- HEADER avec logo -->
        <tr><td style="background:linear-gradient(135deg,#ef4444,#b91c1c); padding:24px; text-align:center;">
          <img src="${LOGO_URL}" alt="2MD Designer" width="64" height="64" style="width:64px; height:64px; object-fit:contain; margin:0 auto 12px; display:block; background:#ffffff; border-radius:12px; padding:6px;">
          <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:900;">🎉 Nouvelle commande !</h1>
          <p style="color:rgba(255,255,255,0.9); margin:8px 0 0; font-size:14px; font-family:'Courier New',monospace;">ORD-${shortId}</p>
        </td></tr>

        <!-- BODY -->
        <tr><td style="padding:28px 24px;">

          <!-- Client -->
          <h2 style="font-size:13px; color:#dc2626; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px; font-weight:700;">👤 Client</h2>
          <table role="presentation" width="100%" style="background:#fef2f2; border-radius:12px; margin-bottom:24px;">
            <tr><td style="padding:16px; font-size:14px; color:#3f3f46; line-height:1.8;">
              <strong style="color:#18181b; font-size:16px;">${order.clientName}</strong><br>
              📞 ${order.clientPhone}<br>
              ${order.clientEmail ? `✉️ ${order.clientEmail}<br>` : ''}
              ${order.clientAddress ? `📍 ${order.clientAddress}` : ''}
            </td></tr>
          </table>

          <!-- Commande -->
          <h2 style="font-size:13px; color:#dc2626; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px; font-weight:700;">📦 Commande</h2>
          <table role="presentation" width="100%" style="background:#fef2f2; border-radius:12px; margin-bottom:24px;">
            <tr><td style="padding:16px; font-size:14px; color:#3f3f46; line-height:1.8;">
              <strong style="color:#18181b; font-size:15px;">${order.product}</strong> × ${order.quantity}<br>
              ${order.format ? `Format : ${order.format}<br>` : ''}
              ${order.style ? `Style : ${order.style}<br>` : ''}
              ${order.customText ? `Texte : "${order.customText}"<br>` : ''}
              ${order.notes ? `<br><em style="color:#71717a;">Notes : ${order.notes}</em>` : ''}
            </td></tr>
          </table>

          <!-- Paiement -->
          <h2 style="font-size:13px; color:#dc2626; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px; font-weight:700;">💰 Paiement</h2>
          <table role="presentation" width="100%" style="background:#fef2f2; border-radius:12px; margin-bottom:24px;">
            <tr><td style="padding:16px; font-size:14px; color:#3f3f46;">
              <p style="margin:0 0 8px;">Mode : <strong>${order.paymentMode === 'full' ? 'Paiement total (-5%)' : 'Acompte 50%'}</strong></p>
              <p style="margin:0 0 8px; font-size:20px; color:#dc2626; font-weight:900;">À recevoir : ${formatPrice(order.paymentAmount)}</p>
              ${order.remaining > 0 ? `<p style="margin:0; font-size:13px; color:#71717a;">Reste : ${formatPrice(order.remaining)}</p>` : ''}
            </td></tr>
          </table>

          <!-- Actions -->
          ${order.clientPhone ? `
          <table role="presentation" width="100%"><tr><td align="center" style="padding-top:8px;">
            <a href="https://wa.me/${order.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${order.clientName}, votre commande ORD-${shortId} est bien reçue !`)}"
               style="display:inline-block; background:#22c55e; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:bold; font-size:14px;">
              📱 Contacter le client
            </a>
          </td></tr></table>
          ` : ''}

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #fee2e2;">
          <p style="font-size:12px; color:#a1a1aa; margin:0;">2MD Designer — Admin Panel</p>
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
    const emailsToSend = [
      // Email au client (uniquement si email fourni)
      order.clientEmail && {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: order.clientEmail, name: order.clientName }],
        subject: clientSubject,
        htmlContent: clientHtml,
      },
      // Email à l'admin (toujours)
      {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: ADMIN_EMAIL, name: 'Admin 2MD' }],
        subject: adminSubject,
        htmlContent: adminHtml,
        replyTo: order.clientEmail ? { email: order.clientEmail, name: order.clientName } : undefined,
      },
    ].filter(Boolean);

    const results = await Promise.allSettled(
      emailsToSend.map((email) =>
        fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
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
      errors: failed.length > 0 ? failed.map((f) => f.reason?.message) : undefined,
    });
  } catch (error) {
    console.error('Erreur envoi emails:', error);
    return res.status(500).json({ error: error.message });
  }
}