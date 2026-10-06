/* Anglais Éclair — histoires à lire et écouter, test de niveau. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;
const STORIES = window.STORIES || [];
E.STORY = new Map(STORIES.map(s => [s.id, s]));

E.route("histoires", () => `${E.head("Lire & écouter", "Petites histoires 📖", "Des textes courts, du niveau A1 au B2, à écouter phrase par phrase. Cache la traduction pour te tester, puis réponds aux questions.")}
  <div class="grid auto-fill">${STORIES.map(s => { const r = E.state.best["story:" + s.id]; return `<a class="game-card" href="#histoire-${s.id}"><span class="g-emoji">${s.emoji}</span><div class="row between"><b>${esc(s.title)}</b><span class="tag lvl">${s.level}</span></div><small>${esc(s.fr)} · ${s.lines.length} phrases</small><span class="best">${r === undefined ? "Pas encore lue" : `Quiz : ${r} / ${s.quiz.length}`}</span></a>`; }).join("")}</div>`, "Histoires");

E.route("histoire", id => {
  const s = E.STORY.get(id);
  if (!s) return `<div class="empty">Histoire introuvable. <a class="btn" href="#histoires">Toutes les histoires</a></div>`;
  const i = STORIES.indexOf(s), next = STORIES[i + 1];
  const qs = s.quiz.map(([q, a, ...wrong]) => ({ q, a, o: E.shuffle([a, ...wrong]) }));
  E.after(() => {
    const view = $("#app > .view");
    const lines = $$(".story-line", view);
    view.addEventListener("click", e => {
      if (e.target.closest("#playAll")) {
        E.sayQueue(s.lines.map(l => l[0]), k => { lines.forEach((el, j) => el.classList.toggle("reading", j === k)); });
        return;
      }
      if (e.target.closest("#slowAll")) { E.say(s.lines.map(l => l[0]).join(" "), 0.7); return; }
      const ln = e.target.closest(".story-line");
      if (ln && !e.target.closest("[data-say]")) { ln.classList.toggle("show-fr"); return; }
      const o = e.target.closest("[data-q]");
      if (o && !o.disabled) {
        const qi = Number(o.dataset.q), q = qs[qi], ok = o.dataset.v === q.a;
        $$(`[data-q="${qi}"]`, view).forEach(b => { b.disabled = true; if (b.dataset.v === q.a) b.classList.add("ok"); else if (b === o) b.classList.add("ko"); });
        E.sfx(ok ? "ok" : "ko");
        if (ok) E.addXp(10, "correct");
        q.done = true; q.ok = ok;
        if (qs.every(x => x.done)) {
          const score = qs.filter(x => x.ok).length, key = "story:" + s.id;
          if (E.state.best[key] === undefined || score > E.state.best[key]) E.state.best[key] = score;
          E.addXp(10, "games");
          $("#storyResult").innerHTML = `<div class="feedback ${score === qs.length ? "ok" : "ko"}">${score === qs.length ? "🌟 Parfait !" : score >= qs.length - 1 ? "👍 Bien !" : "🌱 Relis l’histoire et réessaie."} ${score} / ${qs.length} bonnes réponses. <button class="btn small" type="button" id="storyAgain">↻ Recommencer</button></div>`;
          $("#storyAgain").addEventListener("click", () => E.rerender());
          if (score === qs.length) E.burst();
        }
      }
    });
    $("#frToggle").addEventListener("input", e => { view.classList.toggle("hide-fr", !e.target.checked); E.state.ui.storyFr = e.target.checked; E.save(); });
    view.classList.toggle("hide-fr", E.state.ui.storyFr === false);
  });
  return `<div class="crumbs"><a href="#histoires">Histoires</a> › ${esc(s.title)}</div>
  ${E.head(`Niveau ${s.level} · ${s.lines.length} phrases`, `${s.emoji} ${esc(s.title)}`, esc(s.fr), `<div class="row"><button class="btn primary" type="button" id="playAll">▶ Tout écouter</button><button class="btn" type="button" id="slowAll">🐢 Lentement</button></div>`)}
  <section class="card stack">
    <label class="switch" style="border:0;padding-top:0"><span><b>Afficher la traduction</b><small>Sinon, touche une phrase pour voir son sens</small></span><input class="toggle" type="checkbox" id="frToggle" ${E.state.ui.storyFr === false ? "" : "checked"}></label>
    <div class="story">${s.lines.map(([en, fr]) => `<div class="story-line">${E.sayBtn(en)}<span><b>${esc(en)}</b><i>${esc(fr)}</i></span></div>`).join("")}</div>
  </section>
  <section class="card stack"><h2>❓ As-tu bien compris ?</h2>
    ${qs.map((q, qi) => `<div class="stack"><b>${qi + 1}. ${esc(q.q)}</b><div class="opts">${q.o.map(o => `<button class="opt" type="button" data-q="${qi}" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div></div>`).join("")}
    <div id="storyResult"></div>
  </section>
  <div class="row between"><a class="btn ghost" href="#histoires">← Toutes les histoires</a>${next ? `<a class="btn ghost" href="#histoire-${next.id}">${next.emoji} ${esc(next.title)} →</a>` : ""}</div>`;
}, id => E.STORY.get(id)?.title || "Histoire");

/* ---------- Test de niveau ---------- */
E.route("test", () => {
  const qs = window.PLACEMENT.map(([level, q, a, ...wrong]) => ({ level, q, a, o: E.shuffle([a, ...wrong]) }));
  let i = 0;
  E.after(() => {
    const box = $("#testBox");
    const show = () => {
      if (i >= qs.length) return result();
      const q = qs[i];
      box.innerHTML = `<div class="play-top"><span>Question ${i + 1} / ${qs.length}</span><span class="tag lvl">${q.level}</span></div><div class="bar"><i style="width:${i / qs.length * 100}%"></i></div>
        <div class="q-box"><div class="q-prompt">${esc(q.q)}</div><div class="opts">${q.o.map(o => `<button class="opt" type="button" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>
        <button class="btn small ghost" type="button" data-v="">Je ne sais pas</button></div>`;
    };
    const result = () => {
      let reached = "A1";
      for (const l of E.LEVELS) {
        const set = qs.filter(q => q.level === l), good = set.filter(q => q.ok).length;
        if (set.length && good / set.length >= 0.6) reached = l; else break;
      }
      const total = qs.filter(q => q.ok).length;
      E.state.ui.testDone = reached;
      E.addXp(20, "games"); E.sfx("win");
      box.innerHTML = `<div class="card result"><span class="r-big">🎓</span><p>Ton niveau estimé</p><div class="score">${reached}</div><p><b>${E.LEVEL_NAMES[reached]}</b> · ${total} / ${qs.length} bonnes réponses</p>
        <div class="stack" style="width:100%;text-align:left">${E.LEVELS.map(l => { const set = qs.filter(q => q.level === l), g = set.filter(q => q.ok).length; return `<div class="mastery-row"><b>${l}</b><div class="bar ${g / set.length >= 0.6 ? "good" : ""}"><i style="width:${g / set.length * 100}%"></i></div><span class="n">${g}/${set.length}</span></div>`; }).join("")}</div>
        <p class="muted">Ce test est rapide : il donne une indication, pas un diplôme.</p>
        <div class="row" style="justify-content:center"><button class="btn primary" type="button" id="applyLvl">✅ Utiliser le niveau ${reached}</button><button class="btn" type="button" id="retest">↻ Refaire le test</button></div></div>`;
      $("#applyLvl").addEventListener("click", () => { E.S().level = reached; E.save(); E.toast(`Niveau ${reached} enregistré. Les mots et le programme s’adaptent.`); E.go("accueil"); });
      $("#retest").addEventListener("click", () => E.rerender());
    };
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-v]"); if (!b) return;
      qs[i].ok = b.dataset.v === qs[i].a; i++; E.sfx("tick"); show();
    });
    show();
  });
  return `${E.head("En 3 minutes", "Test de niveau 🎓", `${window.PLACEMENT.length} questions, de plus en plus difficiles. Réponds sans stresser : si tu ne sais pas, dis-le. À la fin, le site s’adapte à ton niveau.`)}
  <div class="play" id="testBox"></div>`;
}, "Test de niveau");
})();

/* ---------- Page pour les enseignants ---------- */
(() => {
"use strict";
const E = window.Eclair, { esc } = E;
E.route("enseignants", () => {
  const byLevel = E.LEVELS.map(l => [l, E.THEMES.filter(t => t.level === l).length, E.WORDS.filter(w => w.level === l).length]);
  const nLessons = window.TENSES.length + window.LESSONS.length;
  const nEx = [...window.TENSES, ...window.LESSONS].reduce((a, t) => a + t.ex.length, 0);
  const nPhr = window.PHRASES.reduce((a, g) => a + g.items.length, 0);
  return `${E.head("Présentation", "Pour les enseignants 🍎", "Anglais Éclair est un site gratuit, sans publicité, sans compte et sans intelligence artificielle. Il complète le cours : vocabulaire illustré, grammaire, verbes irréguliers et entraînement par le jeu.")}
  <div class="stat-row">
    <div class="stat"><span class="s-ico">🖼️</span><b>${E.WORDS.length.toLocaleString("fr-FR")}</b><span>mots illustrés, ${E.THEMES.length} thèmes</span></div>
    <div class="stat"><span class="s-ico">📐</span><b>${nLessons}</b><span>leçons de grammaire · ${nEx} exercices corrigés</span></div>
    <div class="stat"><span class="s-ico">🔁</span><b>${window.IRREGULARS.length}</b><span>verbes irréguliers, dont la fiche de ${window.COURSE_GROUPS.reduce((a, c) => a + c.verbs.length, 0)}</span></div>
    <div class="stat"><span class="s-ico">🎮</span><b>${E.GAMES.length}</b><span>jeux et quiz, ${window.STORIES.length} histoires</span></div>
  </div>
  <div class="grid g2">
    <section class="card stack"><h2>📚 Contenus par niveau (CECRL)</h2>
      <div class="table-wrap"><table class="data" style="min-width:0"><thead><tr><th>Niveau</th><th>Thèmes</th><th>Mots</th></tr></thead><tbody>
      ${byLevel.map(([l, t, w]) => `<tr><td><b>${l}</b> · ${E.LEVEL_NAMES[l]}</td><td>${t}</td><td>${w}</td></tr>`).join("")}</tbody></table></div>
      <p class="muted" style="font-size:.88rem">S’y ajoutent ${nPhr} phrases utiles en situation, ${window.PHRASALS.length} phrasal verbs, ${window.IDIOMS.length} expressions imagées, ${window.FALSE_FRIENDS.length} faux amis et ${window.SOUNDS.length} fiches de prononciation.</p></section>
    <section class="card stack"><h2>🧠 La méthode</h2>
      <ul class="list-clean">
        <li><b>Mémorisation espacée</b> : les cartes mémoire reviennent après 1, 2, 4, 8, 16, 32 puis 64 jours, selon la réponse de l’élève.</li>
        <li><b>Écoute systématique</b> : chaque mot, exemple et verbe peut être écouté (accent britannique ou américain, vitesse réglable).</li>
        <li><b>Grammaire explicite</b> : formule, emplois, piège classique pour un francophone, astuce de mémorisation, exemples traduits.</li>
        <li><b>Entraînement varié</b> : QCM, saisie, dictée, défi chronométré, memory, pendu, quiz de temps et de verbes avec erreurs typiques (ex. <i>buyed</i>).</li>
        <li><b>Autonomie</b> : test de niveau, objectif quotidien indicatif, programme par jours facultatif.</li>
      </ul></section>
  </div>
  <div class="grid g2">
    <section class="card stack"><h2>🔁 Les verbes irréguliers</h2>
      <p>La page Verbes reprend le classement de la fiche de cours en six catégories : ${window.COURSE_GROUPS.map(c => `<b>${esc(c.name)}</b>`).join(", ")}. Chaque catégorie s’écoute et se travaille en quiz séparément.</p>
      <a class="btn primary" href="#verbes" style="justify-self:start">Voir la fiche des verbes →</a></section>
    <section class="card stack"><h2>📝 Choix pédagogiques</h2>
      <ul class="list-clean">
        <li>Les « 12 temps » sont une présentation pédagogique (3 repères × 4 aspects). En grammaire anglaise, seuls le présent et le prétérit sont des temps au sens strict ; le futur s’exprime par <i>will</i>, <i>going to</i> ou le présent.</li>
        <li>L’anglais britannique sert de référence (<i>colour</i>, <i>learnt</i>) ; les variantes américaines sont signalées (<i>color</i>, <i>learned</i>, <i>fall</i>, <i>check</i>…).</li>
        <li>Les traductions donnent le sens le plus courant ; certains mots en ont plusieurs selon le contexte.</li>
      </ul></section>
  </div>
  <section class="card stack"><h2>🔒 Données & confidentialité</h2>
    <p>Aucune inscription, aucune adresse e-mail, aucun cookie publicitaire, aucun outil de mesure d’audience. Les progrès de chaque élève restent uniquement dans le navigateur de son appareil. La voix utilisée est celle de l’appareil (synthèse vocale du système). Les polices et tous les fichiers sont hébergés sur le site lui-même : aucune connexion vers un service extérieur (ni Google, ni réseau social). Le site est servi en HTTPS et fonctionne aussi hors connexion.</p></section>
  <section class="card stack"><h2>🧑‍🏫 Idées d’utilisation en classe</h2>
    <ul class="list-clean">
      <li>Projeter un thème illustré et faire répéter les mots avec le bouton 🔊.</li>
      <li>Lancer le <b>Défi éclair</b> (60 s) en début de cours comme rituel.</li>
      <li>Donner en devoir une catégorie de la fiche de verbes, puis le quiz correspondant.</li>
      <li>Utiliser une petite histoire comme compréhension orale : écoute sans le texte, puis questions.</li>
    </ul>
    <div class="row"><a class="btn" href="#vocabulaire">🧠 Vocabulaire</a><a class="btn" href="#temps">⏳ Les 12 temps</a><a class="btn" href="#histoires">📖 Histoires</a><a class="btn" href="#jeux">🎮 Jeux</a></div></section>`;
}, "Pour les enseignants");
})();
