import LegalLayout from '../../components/legal/LegalLayout';

const sections = [
  { id: 'definition', title: 'Qu\'est-ce qu\'un cookie ?' },
  { id: 'types', title: 'Cookies utilisés' },
  { id: 'finalites', title: 'Finalités' },
  { id: 'tiers', title: 'Cookies tiers' },
  { id: 'duree', title: 'Durée de vie' },
  { id: 'gestion', title: 'Gérer vos cookies' },
  { id: 'navigateurs', title: 'Paramètres navigateurs' },
  { id: 'contact-cookies', title: 'Contact' },
];

export default function Cookies() {
  return (
    <LegalLayout
      title="Politique Cookies"
      subtitle="Cette page vous explique ce que sont les cookies, comment nous les utilisons sur le site de 2MD Designer, et comment vous pouvez les contrôler."
      icon="🍪"
      lastUpdate="1er janvier 2026"
      sections={sections}
    >
      <div className="info-box">
        <p>
          <strong>En résumé :</strong> nous utilisons un nombre limité de cookies,
          principalement techniques (indispensables au fonctionnement du site).
          Nous n'utilisons <strong>aucun cookie publicitaire</strong> ni de traqueur
          agressif.
        </p>
      </div>

      <h2 id="definition">1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur,
        tablette, smartphone) lorsque vous visitez un site internet. Il permet au
        site de mémoriser certaines informations sur votre visite (préférences,
        panier, langue, etc.).
      </p>
      <p>
        Les cookies ne contiennent généralement aucune information permettant de
        vous identifier personnellement. Ils sont utilisés pour améliorer votre
        expérience de navigation.
      </p>

      <h3>Cookies et technologies similaires</h3>
      <p>Outre les cookies proprement dits, notre site peut utiliser :</p>
      <ul>
        <li><strong>Le stockage local (localStorage)</strong> : pour mémoriser vos préférences de navigation</li>
        <li><strong>Les balises pixels</strong> : pour mesurer les visites (mesure d'audience anonyme)</li>
      </ul>

      <h2 id="types">2. Cookies utilisés sur notre site</h2>

      <h3>2.1. Cookies strictement nécessaires</h3>
      <p>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés sans affecter votre navigation.</p>

      <table>
        <thead>
          <tr>
            <th>Nom du cookie</th>
            <th>Finalité</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>session_id</code></td>
            <td>Maintenir votre session active</td>
            <td>Session</td>
          </tr>
          <tr>
            <td><code>csrf_token</code></td>
            <td>Sécurité des formulaires</td>
            <td>Session</td>
          </tr>
          <tr>
            <td><code>cookie_consent</code></td>
            <td>Mémoriser votre choix de cookies</td>
            <td>12 mois</td>
          </tr>
          <tr>
            <td><code>cart_items</code></td>
            <td>Conserver le contenu de votre panier</td>
            <td>30 jours</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2. Cookies de mesure d'audience</h3>
      <p>
        Ces cookies nous permettent de comprendre comment le site est utilisé.
        Les données sont <strong>totalement anonymisées</strong>.
      </p>

      <table>
        <thead>
          <tr>
            <th>Nom du cookie</th>
            <th>Finalité</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>_pa_id</code></td>
            <td>Identifiant anonyme de visiteur</td>
            <td>13 mois</td>
          </tr>
          <tr>
            <td><code>_pa_ses</code></td>
            <td>Durée de la visite et pages vues</td>
            <td>30 minutes</td>
          </tr>
        </tbody>
      </table>

      <h3>2.3. Cookies de préférence</h3>
      <p>Ces cookies mémorisent vos choix pour améliorer votre expérience lors de vos prochaines visites.</p>

      <table>
        <thead>
          <tr>
            <th>Nom du cookie</th>
            <th>Finalité</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>lang_pref</code></td>
            <td>Langue d'affichage préférée</td>
            <td>12 mois</td>
          </tr>
          <tr>
            <td><code>recently_viewed</code></td>
            <td>Produits récemment consultés</td>
            <td>30 jours</td>
          </tr>
        </tbody>
      </table>

      <div className="warning-box">
        <p>
          <strong>Aucun cookie publicitaire.</strong> Nous n'utilisons pas de cookies
          de ciblage publicitaire ni de revendeurs de données. Votre navigation
          reste privée.
        </p>
      </div>

      <h2 id="finalites">3. Pourquoi utilisons-nous ces cookies ?</h2>
      <ul>
        <li><strong>Sécurité :</strong> protéger votre session et nos formulaires contre les attaques.</li>
        <li><strong>Fonctionnement :</strong> permettre la navigation, le panier, la commande.</li>
        <li><strong>Personnalisation :</strong> garder en mémoire vos préférences.</li>
        <li><strong>Amélioration :</strong> comprendre comment améliorer notre site.</li>
      </ul>

      <h2 id="tiers">4. Cookies tiers</h2>
      <p>Nous limitons au strict minimum le recours à des services tiers. Voici les services pouvant déposer des cookies :</p>

      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Type</th>
            <th>Finalité</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Fonts</td>
            <td>Police d'écriture</td>
            <td>Affichage des polices (aucun cookie persistant)</td>
          </tr>
          <tr>
            <td>WhatsApp Widget</td>
            <td>Bouton de contact</td>
            <td>Contact direct (cookie uniquement après clic)</td>
          </tr>
          <tr>
            <td>Mesure d'audience</td>
            <td>Statistiques anonymes</td>
            <td>Comprendre l'utilisation du site</td>
          </tr>
        </tbody>
      </table>

      <p>Nous ne faisons appel à <strong>aucun régisseur publicitaire</strong> (Google Ads, Facebook Ads, etc.).</p>

      <h2 id="duree">5. Durée de vie des cookies</h2>
      <p>Les cookies utilisés sur notre site ont deux types de durée :</p>
      <ul>
        <li><strong>Cookies de session :</strong> supprimés automatiquement à la fermeture de votre navigateur.</li>
        <li><strong>Cookies persistants :</strong> conservés sur votre appareil pour une durée définie (généralement 12 mois maximum).</li>
      </ul>

      <h2 id="gestion">6. Gérer vos préférences cookies</h2>
      <p>
        Vous pouvez à tout moment modifier vos préférences cookies. Vos choix sont
        enregistrés pour 12 mois.
      </p>

      <h3>Comment désactiver les cookies ?</h3>
      <ul>
        <li>Via votre navigateur (voir section 7)</li>
        <li>En nous contactant à <a href="mailto:2mddesigner@gmail.com">2mddesigner@gmail.com</a></li>
      </ul>

      <div className="warning-box">
        <p>
          <strong>Attention :</strong> si vous désactivez tous les cookies, certaines
          fonctionnalités du site (panier, session) pourraient ne plus fonctionner correctement.
        </p>
      </div>

      <h2 id="navigateurs">7. Gérer les cookies via votre navigateur</h2>
      <p>Vous pouvez configurer votre navigateur pour refuser ou supprimer les cookies. Voici les liens vers les pages d'aide des principaux navigateurs :</p>

      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h3>Mode navigation privée</h3>
      <p>
        La plupart des navigateurs proposent un mode « navigation privée » qui
        n'enregistre pas l'historique ni les cookies à la fermeture.
      </p>

      <h2 id="contact-cookies">8. Contact</h2>
      <p>Pour toute question relative à notre utilisation des cookies, vous pouvez nous contacter :</p>

      <div className="info-box">
        <p><strong>2MD Designer — Responsable cookies</strong></p>
        <p>
          Brazzaville, République du Congo<br />
          ✉️ <a href="mailto:2mddesigner@gmail.com">2mddesigner@gmail.com</a><br />
          📞 +242 06 492 08 49
        </p>
      </div>

      <h3>Modifications de cette politique</h3>
      <p>
        Nous pouvons mettre à jour cette politique cookies à tout moment. La version
        en vigueur est toujours celle publiée sur cette page.
      </p>
    </LegalLayout>
  );
}