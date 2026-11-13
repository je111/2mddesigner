import LegalLayout from '../../components/legal/LegalLayout';

const sections = [
  { id: 'editeur', title: 'Éditeur du site' },
  { id: 'publication', title: 'Responsable de publication' },
  { id: 'hebergement', title: 'Hébergement' },
  { id: 'propriete', title: 'Propriété intellectuelle' },
  { id: 'responsabilite', title: 'Limitation de responsabilité' },
  { id: 'liens', title: 'Liens hypertextes' },
  { id: 'droit', title: 'Droit applicable' },
  { id: 'contact-legal', title: 'Contact' },
];

export default function MentionsLegales() {
  return (
    <LegalLayout
      title="Mentions légales"
      subtitle="Conformément aux dispositions légales en vigueur en République du Congo, voici les informations relatives à l'éditeur et à l'hébergement du site de 2MD Designer."
      icon="📄"
      lastUpdate="1er janvier 2026"
      sections={sections}
    >
      <div className="info-box">
        <p>
          <strong>2MD Designer</strong> est un studio de création artistique et de décoration
          basé à Brazzaville, en République du Congo. Le présent document précise les
          informations légales relatives au site internet <strong>2mddesigner.com</strong>
          et à son exploitation.
        </p>
      </div>

      <h2 id="editeur">1. Éditeur du site</h2>
      <p>Le site <strong>2mddesigner.com</strong> est édité par :</p>
      <ul>
        <li><strong>Raison sociale :</strong> 2MD Designer</li>
        <li><strong>Forme juridique :</strong> Entreprise individuelle / ETS</li>
        <li><strong>Siège social :</strong> Brazzaville, République du Congo</li>
        <li><strong>Numéro RCCM :</strong> À compléter</li>
        <li><strong>Numéro fiscal (NIU) :</strong> À compléter</li>
        <li><strong>Téléphone :</strong> +242 06 492 08 49</li>
        <li><strong>Email :</strong> <a href="mailto:2mddesigner@gmail.com">2mddesigner@gmail.com</a></li>
        <li><strong>Directeur de la publication :</strong> La direction de 2MD Designer</li>
      </ul>

      <h2 id="publication">2. Responsable de publication</h2>
      <p>
        Le responsable de la publication du site est le représentant légal de
        <strong> 2MD Designer</strong>, joignable à l'adresse email suivante :
        <a href="mailto:2mddesigner@gmail.com"> 2mddesigner@gmail.com</a>.
      </p>
      <p>
        Il est chargé de la gestion éditoriale du site, du contrôle des contenus
        publiés et du respect des obligations légales liées à la publication en ligne.
      </p>

      <h2 id="hebergement">3. Hébergement</h2>
      <p>Le site est hébergé par :</p>
      <ul>
        <li><strong>Nom :</strong> Vercel Inc.</li>
        <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
        <li><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
      </ul>

      <h3>Nom de domaine</h3>
      <p>
        Le nom de domaine <strong>2mddesigner.com</strong> est enregistré auprès d'un
        bureau d'enregistrement accrédité ICANN.
      </p>

      <h2 id="propriete">4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments présents sur ce site (textes, images, photographies,
        créations graphiques, illustrations, logos, marques, vidéos, sons, structure,
        code source, bases de données, etc.) sont la propriété exclusive de
        <strong> 2MD Designer</strong> ou de ses partenaires, et sont protégés par
        les lois congolaises et internationales relatives à la propriété intellectuelle.
      </p>

      <h3>Utilisation autorisée</h3>
      <p>
        Toute reproduction, représentation, modification, publication, adaptation,
        totale ou partielle, des éléments du site, quel que soit le moyen ou le
        procédé utilisé, est interdite, sauf autorisation écrite préalable de
        <strong> 2MD Designer</strong>.
      </p>

      <h3>Créations personnalisées clientes</h3>
      <p>Concernant les créations réalisées sur commande (portraits, tasses, textiles, objets personnalisés…) :</p>
      <ul>
        <li>Le <strong>client</strong> conserve les droits sur les photos et contenus qu'il fournit.</li>
        <li>Le <strong>studio 2MD Designer</strong> conserve les droits sur la réalisation artistique finale.</li>
        <li>Sauf opposition écrite, le studio se réserve le droit de présenter les créations dans son portfolio.</li>
      </ul>

      <h2 id="responsabilite">5. Limitation de responsabilité</h2>
      <p>2MD Designer s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois :</p>
      <ul>
        <li>Le studio ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</li>
        <li>En conséquence, le studio décline toute responsabilité pour toute imprécision, inexactitude ou omission.</li>
        <li>Les prix, disponibilités et délais affichés sont indicatifs et peuvent évoluer sans préavis.</li>
        <li>2MD Designer ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l'utilisateur.</li>
      </ul>

      <h3>Disponibilité du site</h3>
      <p>
        Le site peut être interrompu à tout moment pour maintenance, mise à jour
        ou tout autre motif technique, sans que cela puisse donner lieu à une
        quelconque indemnisation.
      </p>

      <h2 id="liens">6. Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens vers d'autres sites internet.
        2MD Designer n'exerce aucun contrôle sur ces sites et décline toute
        responsabilité quant à leur contenu, leurs pratiques ou leurs politiques
        de confidentialité.
      </p>
      <p>
        La mise en place d'un lien vers le site <strong>2mddesigner.com</strong>
        est autorisée à condition qu'elle ne porte pas atteinte à l'image du studio
        et qu'elle se fasse dans un cadre informatif.
      </p>

      <h2 id="droit">7. Droit applicable et juridiction</h2>
      <p>
        Le présent site et les présentes mentions légales sont soumis au
        <strong> droit congolais</strong>. En cas de litige, et à défaut de
        résolution amiable, les tribunaux compétents de <strong>Brazzaville</strong>
        seront seuls saisis.
      </p>

      <h3>Médiation à l'amiable</h3>
      <p>
        Avant toute action judiciaire, nous vous invitons à nous contacter à
        <a href="mailto:2mddesigner@gmail.com"> 2mddesigner@gmail.com</a> afin
        de rechercher une solution amiable.
      </p>

      <h2 id="contact-legal">8. Contact</h2>
      <p>Pour toute question relative aux présentes mentions légales, vous pouvez nous écrire :</p>

      <div className="info-box">
        <p><strong>2MD Designer</strong></p>
        <p>
          Brazzaville, République du Congo<br />
          ✉️ <a href="mailto:2mddesigner@gmail.com">2mddesigner@gmail.com</a><br />
          📞 +242 06 492 08 49
        </p>
      </div>
    </LegalLayout>
  );
}