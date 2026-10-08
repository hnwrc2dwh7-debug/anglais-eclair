/* Anglais Éclair — aides : explication de chaque page, page « Aide », bienvenue. */
(() => {
"use strict";
const E = window.Eclair, { $, esc } = E;

/* Une aide courte par page : 2 à 4 étapes concrètes. */
E.HELP = {
  accueil: ["« Ta séance du jour » propose quoi faire maintenant : touche une ligne pour commencer.", "Le cercle compte tes points du jour. Chaque bonne réponse en rapporte.", "Le mot et l’expression du jour changent chaque jour : touche 🔊 pour les écouter."],
  vocabulaire: ["Choisis un thème : chaque carte montre son niveau (A1 = débutant, C1 = expert) et ta progression.", "Utilise les menus pour filtrer par niveau ou par catégorie, ou cherche un mot.", "Dans un thème, « Apprendre » ne montre que les mots nouveaux, « Cartes mémoire » montre tout le thème."],
  theme: ["Touche 🔊 pour écouter un mot ou sa phrase d’exemple, ☆ pour le garder dans tes favoris.", "Active « Cacher le français » pour te tester : touche la traduction floue pour la voir.", "« Quiz du thème » lance un jeu avec seulement les mots de ce thème."],
  cartes: ["Regarde la carte et essaie de te souvenir, puis touche-la pour la retourner.", "Sois honnête : « À revoir », « Difficile » ou « Je savais ». La carte reviendra au bon moment.", "Au clavier : Espace pour retourner, 1, 2, 3 pour noter, S pour écouter."],
  apprendre: ["Tu découvres de nouveaux mots sous forme de cartes : touche la carte pour la retourner.", "Choisis un thème dans le menu, ou laisse le site choisir selon ton niveau.", "Les mots appris reviendront ensuite dans « Révisions »."],
  revisions: ["Ici reviennent les mots que tu as déjà vus, juste avant que tu risques de les oublier.", "Un mot bien connu revient de moins en moins souvent : 1, 2, 4, 8, 16 jours…", "Si la page est vide, c’est que tout est à jour : bravo !"],
  temps: ["Le tableau croise le moment (passé, présent, futur) et l’aspect (simple, continu, parfait…).", "Touche une case pour ouvrir sa fiche : frise, construction, exemples à écouter, exercices.", "Commence par les cases A1 et A2 si tu débutes."],
  lecon: ["Lis la formule, puis les exemples (touche 🔊 pour les entendre).", "Le cadre rouge montre le piège le plus fréquent pour un francophone.", "Fais les exercices en bas : écris ta réponse puis « Vérifier ». Le bouton 💡 donne un indice."],
  grammaire: ["Les leçons sont rangées par catégorie et par niveau : filtre avec les menus.", "Une leçon déjà étudiée affiche « ✓ étudiée ».", "Les 12 temps ont leur propre page : bouton « Les 12 temps »."],
  conjugueur: ["Écris un verbe en anglais (go, work, give up…) et choisis un temps, ou « Tous les temps ».", `Le site reconnaît ${window.IRREGULARS.length} verbes irréguliers et applique les règles pour les autres.`, "Touche 🔊 pour entendre chaque forme."],
  verbes: ["En haut : la fiche du cours en 6 catégories. Chaque catégorie s’écoute et a son propre quiz.", "En bas : tous les verbes. Le « Mode test » cache une colonne pour t’interroger.", "Touche « je sais » pour marquer les verbes appris."],
  jeux: ["Choisis d’abord les mots utilisés (ton niveau, un thème, tes favoris…) et la longueur.", "Puis touche un jeu. Ton record s’affiche sous chaque jeu.", "Les jeux ⚡ et ✅ sont chronométrés : réponds le plus vite possible."],
  jeu: ["Touche la bonne réponse (ou tape-la quand il faut écrire, puis Entrée).", "Le bouton 💡 Indice dévoile la première lettre quand tu dois écrire.", "Au clavier, les touches 1 à 4 choisissent une réponse."],
  phrases: ["Choisis une situation dans le menu (restaurant, voyage, téléphone…).", "Touche 🔊 pour écouter, puis répète à voix haute.", "« Tout écouter » lit toutes les phrases de la situation à la suite."],
  phrasal: ["Un phrasal verb = un verbe + une petite particule (up, off, on…) qui change le sens.", "Choisis « Cacher le sens » pour te tester.", "Apprends-les avec leur exemple, c’est plus facile à retenir."],
  idiomes: ["Ces expressions ne se traduisent pas mot à mot : retiens leur équivalent français.", "Touche 🔊 pour entendre l’expression.", "Quiz des expressions : bouton en haut de page."],
  fauxamis: ["Un faux ami ressemble à un mot français mais n’a pas le même sens.", "La ligne verte donne le vrai sens, la ligne rouge le piège à éviter."],
  familier: ["Ces mots s’entendent dans les séries et entre amis.", "À éviter dans une copie ou un e-mail formel."],
  prononciation: ["Touche un mot pour l’entendre, ou 🐢 pour une écoute lente.", "« Entraîne ton oreille » : écoute un mot et choisis lequel tu as entendu."],
  programme: ["Le programme est facultatif : active-le seulement si tu veux un plan guidé.", "Choisis tes jours d’étude et une durée ; chaque jour propose un thème, une leçon et un jeu.", "Touche un jour pour voir son détail."],
  stats: ["Les barres montrent tes points des 30 derniers jours (vert = objectif atteint).", "« Maîtrisé » = un mot arrivé en boîte 4 ou plus dans les révisions.", "Tout est calculé sur ton appareil."],
  favoris: ["Les mots que tu as marqués d’une ☆ sont ici.", "« Réviser mes favoris » les met en cartes mémoire."],
  reglages: ["Tout est enregistré tout de suite sur cet appareil.", "Apparence : couleur principale, couleur et motif de fond, taille du texte, police.", "Mes données : copie ta sauvegarde pour la coller sur un autre appareil."],
  histoires: ["Choisis une histoire à ton niveau (A1 → B2).", "Écoute-la phrase par phrase, puis réponds aux questions."],
  histoire: ["« Tout écouter » lit l’histoire en surlignant la phrase en cours.", "Cache la traduction pour te tester ; touche une phrase pour voir son sens.", "Réponds aux 3 questions en bas de page."],
  test: ["22 questions, de plus en plus difficiles. Si tu ne sais pas, dis-le : c’est plus juste.", "À la fin, applique le niveau trouvé : le site s’adapte."],
  recherche: ["Tape un mot en anglais ou en français (au moins 2 lettres).", "Les résultats couvrent les mots, verbes, phrases, expressions et faux amis."],
  fiches: ["Choisis un type d’exercice, puis une option (verbes de la fiche, un temps, un thème…) et la longueur.", "Chaque fiche a un numéro de 1 à 9 999 : le même numéro redonne exactement les mêmes phrases.", "« Mode tableau » projette la fiche en grand, phrase par phrase, avec la correction à révéler."],
  fiche: ["Écris tes réponses dans les cases, puis « Corriger ma fiche » : les erreurs s’affichent en rouge avec la bonne réponse.", "« Mode tableau » : une phrase à la fois en grand, Espace pour afficher la réponse.", "Tu peux imprimer la fiche et son corrigé."],
  partager: ["Montre le QR code : on le scanne avec l’appareil photo d’un téléphone.", "Ou copie le lien pour l’envoyer par message."]
};

/* Encadré d'aide en haut de chaque page (ouvert la première fois). */
E.helpBox = (name, param) => {
  if (name === "temps" && param) name = "lecon";
  const steps = E.HELP[name];
  if (!steps || !E.S().showHelp) return "";
  const seen = (E.state.ui.helpSeen ||= {});
  const open = !seen[name];
  seen[name] = 1; E.save();
  return `<details class="help-box"${open ? " open" : ""}><summary>💡 Comment ça marche ?</summary>
    <ol>${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
    <p class="muted">Plus d’explications dans <a href="#aide">l’aide complète</a>. Pour masquer ces encadrés : <a href="#reglages-apprentissage">Réglages</a>.</p></details>`;
};

/* Message de bienvenue (première visite). */
E.welcomeBox = () => E.state.ui.welcomed ? "" : `<section class="card welcome stack" id="welcome">
  <div class="row between"><h2>👋 Bienvenue sur Anglais Éclair !</h2><button class="btn small ghost" type="button" data-welcome-close>Fermer ✕</button></div>
  <div class="mode-pick"><b>Tu es :</b><button class="btn primary" type="button" data-setmode="eleve">🎒 Élève</button><button class="btn" type="button" data-setmode="prof">🍎 Enseignant(e)</button><span class="muted">Tu pourras changer à tout moment avec le bouton en haut de l’écran.</span></div>
  <p>Le site est gratuit, sans compte et sans publicité. Tes progrès restent sur ton appareil. Pour bien démarrer :</p>
  <div class="grid g3">
    <a class="tile" href="#test"><span class="t-emoji">🎓</span><b>1. Test de niveau</b><small>3 minutes pour adapter le site à toi</small></a>
    <a class="tile" href="#vocabulaire"><span class="t-emoji">🧠</span><b>2. Choisis un thème</b><small>Écoute les mots, retourne les cartes</small></a>
    <a class="tile" href="#jeux"><span class="t-emoji">🎮</span><b>3. Joue</b><small>17 jeux pour retenir sans t’ennuyer</small></a>
  </div>
  <p class="muted">Astuce : change les couleurs et le fond dans <a href="#reglages-apparence">Réglages → Apparence</a>. Besoin d’aide ? Touche <b>❓</b> en haut de l’écran.</p>
</section>`;
document.addEventListener("click", e => {
  if (e.target.closest("[data-welcome-close]")) { E.state.ui.welcomed = 1; E.save(); $("#welcome")?.remove(); }
});

/* ---------- Page d'aide complète ---------- */
const NAMES = {
  accueil: "🏠 Accueil", vocabulaire: "🧠 Vocabulaire", theme: "🖼️ Un thème", apprendre: "✨ Nouveaux mots", cartes: "🃏 Cartes mémoire", revisions: "🗂️ Révisions",
  temps: "⏳ Les 12 temps", lecon: "📐 Une leçon", grammaire: "📐 Grammaire", conjugueur: "🧩 Conjugueur", verbes: "🔁 Verbes irréguliers",
  fiches: "📝 Fiches d’exercices", fiche: "📄 Une fiche", jeux: "🎮 Jeux", jeu: "🎯 Pendant un jeu", histoires: "📖 Histoires", histoire: "📖 Une histoire", test: "🎓 Test de niveau",
  phrases: "💬 Phrases utiles", phrasal: "🧲 Phrasal verbs", idiomes: "🦄 Expressions", fauxamis: "🪤 Faux amis", familier: "😎 Anglais familier", prononciation: "👄 Prononciation",
  programme: "📅 Programme", stats: "📊 Mes progrès", favoris: "⭐ Favoris", reglages: "⚙️ Réglages", recherche: "🔎 Recherche", partager: "📲 Partager"
};
const FAQ = [
  ["Est-ce que c’est gratuit ? Faut-il un compte ?", "Oui, c’est entièrement gratuit, sans compte, sans publicité et sans intelligence artificielle. Le site reste en ligne en permanence : on peut le donner à qui on veut, quand on veut."],
  ["Où sont enregistrés mes progrès ?", "Dans le navigateur de ton appareil. Si tu changes d’appareil, va dans Réglages → Mes données, copie ta sauvegarde et colle-la sur l’autre appareil. Attention : vider les données du navigateur efface aussi tes progrès."],
  ["Je n’entends pas les mots.", "Monte le volume et vérifie que le téléphone n’est pas en mode silencieux (sur iPhone, l’interrupteur latéral). Dans Réglages → Voix, touche « Tester la voix » ou choisis une autre voix."],
  ["Comment gagner des points ?", "Chaque bonne réponse, carte révisée, leçon ou partie de jeu rapporte des points. L’objectif du jour (100 points par défaut) se règle dans Réglages ; il est seulement indicatif."],
  ["Que veut dire « maîtrisé » ?", "Un mot est maîtrisé quand tu l’as reconnu plusieurs fois de suite dans les révisions (boîte 4 sur 7)."],
  ["C’est quoi le mode élève et le mode enseignant ?", "Le mode élève (par défaut) montre les points, la séance du jour et les jeux. Le mode enseignant transforme l’accueil en espace prof : projection d’exercices au tableau, fiches et corrigés à imprimer. On change avec le bouton 🎒 / 🍎 en haut de l’écran."],
  ["Je dois étudier certains jours ?", "Non. Par défaut, il n’y a aucun jour imposé. Le programme par jours est une option, à activer seulement si tu veux un plan guidé."],
  ["Ça marche sans internet ?", "Oui : après une première visite, le site s’ouvre hors connexion. Tu peux aussi l’installer comme une appli (Partager → Sur l’écran d’accueil sur iPhone, menu ⋮ → Installer sur Android)."],
  ["La correction refuse ma réponse alors qu’elle est juste.", "Les formes courtes (don’t, I’m) et longues (do not, I am) sont acceptées. Si tu as activé « Correction stricte », les accents et majuscules comptent : désactive-la dans Réglages → Apprentissage."]
];
const GLOSSARY = [
  ["Base verbale", "Le verbe sans rien : go, eat, be (« infinitif sans to »)."], ["Prétérit", "Le passé simple anglais : went, ate, was."], ["Participe passé", "La 3e forme : gone, eaten, been. Elle sert au present perfect et au passif."],
  ["Auxiliaire", "Petit verbe qui aide à construire : be, have, do, will."], ["Modal", "can, could, must, should, may, might, would : ils ajoutent une nuance (pouvoir, devoir…)."], ["Aspect", "La façon de voir l’action : simple (fait), continu (en cours), parfait (lien avec un repère)."],
  ["Phrasal verb", "Verbe + particule qui change le sens : give up = abandonner."], ["Faux ami", "Mot qui ressemble au français mais a un autre sens : actually = en fait."],
  ["CECRL A1 → C1", "Les niveaux européens : A1 débutant, A2 élémentaire, B1 intermédiaire, B2 avancé, C1 expert."], ["Répétition espacée", "Revoir un mot juste avant de l’oublier, à intervalles de plus en plus longs."]
];
E.route("aide", () => `${E.head("Mode d’emploi", "Aide ❓", "Tout ce qu’il faut savoir pour utiliser Anglais Éclair. Chaque page a aussi son encadré « 💡 Comment ça marche ? ».")}
  <section class="card stack"><h2>🚀 Démarrer en 3 étapes</h2>
    <ol class="list-clean"><li><a href="#test">Fais le test de niveau</a> (3 minutes) : le site choisit les mots adaptés.</li><li>Ouvre un <a href="#vocabulaire">thème de vocabulaire</a>, écoute les mots, puis « Apprendre ».</li><li>Joue à un <a href="#jeux">jeu</a> pour fixer les mots. Reviens les jours suivants : les <a href="#revisions">révisions</a> t’attendront.</li></ol></section>
  <section class="card stack"><h2>❔ Questions fréquentes</h2>
    ${FAQ.map(([q, a]) => `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</section>
  <section class="stack"><h2>📚 Page par page</h2><div class="grid auto-fill">
    ${Object.entries(NAMES).filter(([k]) => E.HELP[k]).map(([k, n]) => `<article class="card stack"><h3>${n}</h3><ol class="list-clean">${E.HELP[k].map(s => `<li>${esc(s)}</li>`).join("")}</ol></article>`).join("")}
  </div></section>
  <section class="card stack"><h2>📖 Petit lexique</h2><div class="grid g2">${GLOSSARY.map(([t, d]) => `<div><b>${esc(t)}</b><br><span class="muted">${esc(d)}</span></div>`).join("")}</div></section>
  <section class="card stack"><h2>⌨️ Raccourcis clavier</h2><p>Cartes mémoire : <kbd>Espace</kbd> retourner · <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> noter · <kbd>S</kbd> écouter. Quiz : <kbd>1</kbd> à <kbd>4</kbd> pour répondre, <kbd>Entrée</kbd> pour continuer. Pendu et mot mélangé : tape les lettres au clavier.</p></section>`, "Aide");

/* ---------- Partager le site ---------- */
E.SITE_URL = "https://hnwrc2dwh7-debug.github.io/anglais-eclair/";
E.route("partager", () => {
  E.after(() => {
    const box = $("#qr");
    try {
      const qr = window.qrcode(0, "M"); qr.addData(E.SITE_URL); qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    } catch { box.innerHTML = `<p class="muted">Le QR code n’a pas pu s’afficher. Utilise le lien ci-dessous.</p>`; }
    $("#copyLink").addEventListener("click", () => {
      const done = () => E.toast("Lien copié 📋");
      try { navigator.clipboard.writeText(E.SITE_URL).then(done, () => { $("#linkBox").select(); E.toast("Sélectionne le lien et copie-le."); }); } catch { $("#linkBox").select(); }
    });
    const sh = $("#shareNative");
    if (navigator.share) sh.addEventListener("click", () => navigator.share({ title: "Anglais Éclair", text: "Apprends l’anglais gratuitement avec Anglais Éclair ⚡", url: E.SITE_URL }).catch(() => {}));
    else sh.hidden = true;
  });
  return `${E.head("Gratuit, pour tout le monde", "Partager le site 📲", "Anglais Éclair est public et reste en ligne en permanence : tu peux le donner à qui tu veux, quand tu veux. Pas de compte, pas d’inscription.")}
  <div class="grid g2">
    <section class="card stack share-card" style="justify-items:center;text-align:center"><h2>Scanne-moi</h2><div id="qr" class="qr" aria-label="QR code du site"></div><p class="muted">Ouvre l’appareil photo du téléphone et vise le code.</p></section>
    <section class="card stack"><h2>Le lien du site</h2>
      <label class="field" for="linkBox">Adresse<input id="linkBox" type="text" readonly value="${esc(E.SITE_URL)}"></label>
      <div class="row"><button class="btn primary" type="button" id="copyLink">📋 Copier le lien</button><button class="btn" type="button" id="shareNative">📤 Partager…</button></div>
      <hr>
      <h3>À savoir avant de partager</h3>
      <ul class="list-clean"><li>Chaque personne a ses propres progrès, sur son appareil.</li><li>Fonctionne sur téléphone, tablette et ordinateur, même hors connexion après la première visite.</li><li>Pour les professeurs : une <a href="#enseignants">page de présentation</a> résume les contenus et la méthode.</li></ul>
    </section>
  </div>`;
}, "Partager");
})();
