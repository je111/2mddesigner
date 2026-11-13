import LegalLayout from '../../components/legal/LegalLayout';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'collecte', title: 'Données collectées' },
  { id: 'finalites', title: 'Finalités du traitement' },
  { id: 'photos', title: 'Vos photos' },
  { id: 'partage', title: 'Partage des données' },
  { id: 'duree', title: 'Durée de conservation' },
  { id: 'securite', title: 'Sécurité' },
  { id: 'droits', title: 'Vos droits' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'mineurs', title: 'Protection des mineurs' },
  { id: 'contact-dpo', title: 'Contact' },
];

export default function Confidentialite() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      subtitle="Chez 2MD Designer, la protection de votre vie privée et de vos données personnelles est une priorité absolue. Cette page vous explique comment nous collectons, utilisons et protégeons vos informations."
      icon="🔒"
      lastUpdate="1er janvier 2026"
      sections={sections}
    >
      <h2 id="intro">1. Introduction</h2>
      <p>
        La présente politique de confidentialité décrit la manière dont
        <strong> 2MD Designer</strong> (« nous », « notre », « nos ») collecte, utilise,
        conserve et protège vos données personnelles lorsque vous utilisez notre site
        <strong> 2mddesigner.com</strong>, nos services de création personnalisée, ou
        lorsque vous nous contactez par téléphone, WhatsApp ou email.
      </p>

      <div className="info-box">
        <p>
          <strong>En résumé :</strong> nous ne collectons que les informations strictement
          nécessaires à la réalisation de vos commandes. Nous ne vendons jamais vos données.
          Vos photos sont utilisées uniquement pour créer votre œuvre, puis supprimées
          après la livraison (sauf accord de votre part pour les garder en portfolio).
        </p>
      </div>

      <p>
        Nous nous engageons à respecter les principes de protection des données personnelles
        conformément aux lois congolaises applicables ainsi qu'aux standards internationaux.
      </p>

      <h2 id="collecte">2. Données que nous collectons</h2>
      <p>Nous collectons différentes catégories de données selon la nature de votre interaction avec notre studio :</p>

      <h3>2.1. Données d'identité et de contact</h3>
      <ul>
        <li>Nom et prénom</li>
        <li>Numéro de téléphone (mobile / WhatsApp)</li>
        <li>Adresse email</li>
        <li>Adresse postale (uniquement en cas de livraison)</li>
      </ul>

      <h3>2.2. Données liées à votre commande</h3>
      <ul>
        <li>Type de création demandée (portrait, tasse, textile, décoration…)</li>
        <li>Options de personnalisation (format, style, texte, quantité)</li>
        <li>Photos et visuels que vous nous transmettez</li>
        <li>Historique de vos commandes</li>
        <li>Préférences de livraison</li>
      </ul>

      <h3>2.3. Données de paiement</h3>
      <ul>
        <li>Mode de paiement utilisé (Mobile Money, espèces, virement)</li>
        <li>Montant et date de la transaction</li>
        <li><strong>Nous ne stockons jamais vos identifiants bancaires ou codes Mobile Money.</strong></li>
      </ul>

      <h3>2.4. Données techniques (site web)</h3>
      <ul>
        <li>Adresse IP (anonymisée)</li>
        <li>Type de navigateur et appareil</li>
        <li>Pages visitées et durée de visite</li>
      </ul>

      <h2 id="finalites">3. Pourquoi nous collectons ces données</h2>
      <p>Vos données sont utilisées uniquement dans le cadre de nos activités :</p>

      <table>
        <thead>
          <tr>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Traiter et réaliser votre commande</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Vous contacter au sujet de votre projet</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Gérer la livraison et la facturation</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Vous envoyer des nouvelles (si vous l'avez accepté)</td>
            <td>Consentement</td>
          </tr>
          <tr>
            <td>Améliorer nos services et notre site</td>
            <td>Intérêt légitime</td>
          </tr>
          <tr>
            <td>Respecter nos obligations légales</td>
            <td>Obligation légale</td>
          </tr>
        </tbody>
      </table>

      <h2 id="photos">4. Traitement de vos photos et visuels</h2>
      <p>
        Les photos et visuels que vous nous transmettez font l'objet d'une attention
        particulière car ils peuvent contenir des informations personnelles sensibles.
      </p>

      <h3>4.1. Utilisation</h3>
      <ul>
        <li>Vos photos sont utilisées <strong>uniquement pour réaliser votre création</strong>.</li>
        <li>Elles ne sont jamais revendues, louées ou transmises à des tiers commerciaux.</li>
        <li>Elles ne sont pas utilisées pour entraîner des intelligences artificielles sans votre accord explicite.</li>
      </ul>

      <h3>4.2. Conservation</h3>
      <ul>
        <li>Vos fichiers originaux sont conservés <strong>pendant la durée de la commande</strong>.</li>
        <li>Après livraison, ils sont supprimés sous <strong>30 jours</strong>, sauf demande contraire de votre part.</li>
        <li>Vous pouvez demander la suppression immédiate à tout moment.</li>
      </ul>

      <h3>4.3. Portfolio et réseaux sociaux</h3>
      <p>Sauf opposition de votre part :</p>
      <ul>
        <li>Nous pouvons présenter votre création finalisée dans notre portfolio.</li>
        <li>Vous pouvez demander le retrait à tout moment, sans justification.</li>
        <li>Nous ne publions jamais vos coordonnées personnelles.</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>Votre contrôle total :</strong> vous pouvez nous écrire à
          <a href="mailto:2mddesigner@gmail.com"> 2mddesigner@gmail.com</a>
          pour demander la suppression immédiate de vos photos, à tout moment.
        </p>
      </div>

      <h2 id="partage">5. Partage de vos données</h2>
      <p>
        <strong>Nous ne vendons jamais vos données personnelles.</strong> Elles ne sont
        partagées qu'avec des partenaires strictement nécessaires à la réalisation de
        votre commande :
      </p>
      <ul>
        <li><strong>Prestataires de livraison</strong> (uniquement nom, adresse, téléphone)</li>
        <li><strong>Fournisseurs de paiement</strong> (Mobile Money, banque)</li>
        <li><strong>Hébergeurs et outils techniques</strong> (site web, emails)</li>
        <li><strong>Autorités légales</strong> (uniquement sur réquisition officielle)</li>
      </ul>
      <p>
        Tous nos partenaires s'engagent contractuellement à respecter la
        confidentialité de vos informations.
      </p>

      <h2 id="duree">6. Durée de conservation</h2>
      <p>Nous conservons vos données uniquement le temps nécessaire aux finalités décrites ci-dessus :</p>

      <table>
        <thead>
          <tr>
            <th>Type de donnée</th>
            <th>Durée de conservation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Photos et visuels de commande</td>
            <td>30 jours après livraison (ou immédiatement sur demande)</td>
          </tr>
          <tr>
            <td>Données client (nom, contact)</td>
            <td>3 ans après le dernier contact</td>
          </tr>
          <tr>
            <td>Factures et documents comptables</td>
            <td>10 ans (obligation légale)</td>
          </tr>
          <tr>
            <td>Newsletter (si inscrit)</td>
            <td>Jusqu'à désinscription</td>
          </tr>
          <tr>
            <td>Données techniques du site</td>
            <td>13 mois maximum</td>
          </tr>
        </tbody>
      </table>

      <h2 id="securite">7. Sécurité de vos données</h2>
      <p>Nous mettons en œuvre toutes les mesures techniques et organisationnelles raisonnables pour protéger vos données :</p>
      <ul>
        <li>Chiffrement HTTPS sur l'ensemble du site</li>
        <li>Accès restreint aux données (uniquement l'équipe autorisée)</li>
        <li>Mots de passe forts et authentification sécurisée</li>
        <li>Sauvegardes régulières et sécurisées</li>
        <li>Sensibilisation de notre équipe à la protection des données</li>
      </ul>

      <h2 id="droits">8. Vos droits</h2>
      <p>Conformément aux réglementations en vigueur, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d'accès :</strong> obtenir une copie de vos données.</li>
        <li><strong>Droit de rectification :</strong> corriger des informations inexactes.</li>
        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données.</li>
        <li><strong>Droit à la limitation :</strong> restreindre temporairement le traitement.</li>
        <li><strong>Droit d'opposition :</strong> refuser un traitement.</li>
        <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format lisible.</li>
        <li><strong>Droit de retirer votre consentement</strong> à tout moment.</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>Comment exercer vos droits ?</strong> Envoyez-nous un simple message à
          <a href="mailto:2mddesigner@gmail.com"> 2mddesigner@gmail.com</a>.
          Nous répondons sous <strong>30 jours maximum</strong>, gratuitement.
        </p>
      </div>

      <h2 id="cookies">9. Cookies et technologies similaires</h2>
      <p>Notre site utilise un nombre limité de cookies, uniquement pour :</p>
      <ul>
        <li><strong>Cookies techniques :</strong> assurer le bon fonctionnement du site (obligatoires).</li>
        <li><strong>Cookies de mesure d'audience :</strong> comprendre comment le site est utilisé (anonymisés).</li>
        <li><strong>Cookies de préférence :</strong> mémoriser vos choix.</li>
      </ul>
      <p>
        Nous n'utilisons <strong>aucun cookie publicitaire</strong> ni de traqueur tiers agressif.
        Pour plus d'informations, consultez notre <a href="/cookies">politique cookies</a>.
      </p>

      <h2 id="mineurs">10. Protection des mineurs</h2>
      <p>
        Nos services s'adressent à un public général, mais les commandes impliquant
        des mineurs doivent être passées par un <strong>parent ou tuteur légal</strong>.
      </p>
      <p>
        Nous ne collectons pas sciemment de données concernant des mineurs de moins de
        15 ans sans le consentement parental.
      </p>

      <h2 id="contact-dpo">11. Contact — Protection des données</h2>
      <p>
        Pour toute question relative à cette politique, à vos données personnelles ou
        pour exercer vos droits, vous pouvez nous contacter :
      </p>

      <div className="info-box">
        <p><strong>Responsable de la protection des données — 2MD Designer</strong></p>
        <p>
          Brazzaville, République du Congo<br />
          ✉️ <a href="mailto:2mddesigner@gmail.com">2mddesigner@gmail.com</a><br />
          📞 +242 06 492 08 49<br />
          💬 WhatsApp : +242 06 492 08 49
        </p>
      </div>

      <h3>Modifications de cette politique</h3>
      <p>
        Nous nous réservons le droit de modifier cette politique de confidentialité
        à tout moment. La version en vigueur est toujours celle publiée sur cette page.
      </p>
    </LegalLayout>
  );
}