/* Anglais Éclair — accueil, vocabulaire, cartes mémoire, révisions, recherche, favoris. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;

/* ---------- Lecture en chaîne ---------- */
E.sayQueue = (texts, onEach) => {
  if (!E.speechOk) return E.toast("La lecture audio n’est pas disponible sur ce navigateur.");
  let i = 0, stopped = false;
  const next = () => {
    if (stopped || i >= texts.length) return;
    onEach && onEach(i);
    const u = new SpeechSynthesisUtterance(String(texts[i]).replace(/\s*\/\s*/g, ", ").replace(/[()]/g, ", "));
    const v = E.pickVoice(); if (v) u.voice = v; u.lang = v ? v.lang : E.S().voiceAccent; u.rate = E.S().rate;
    u.onend = () => { i++; setTimeout(next, 350); };
    u.onerror = () => { stopped = true; };
    speechSynthesis.speak(u);
  };
  try { speechSynthesis.cancel(); } catch {}
  next();
  const stop = () => { stopped = true; try { speechSynthesis.cancel(); } catch {} };
  E.onLeave(stop);
  return stop;
};

/* ---------- Accueil ---------- */
const ring = (pct, label, sub) => {
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - Math.min(1, pct));
  return `<div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="${r}" fill="none" stroke="rgb(255 255 255 / 22%)" stroke-width="12"/>
  <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--spark-base)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg>
  <div class="ring-txt"><b>${label}</b><small>${sub}</small></div></div>`;
};
E.wordOfDay = (offset = 0) => E.WORDS[((E.today() + offset) * 7919) % E.WORDS.length];
E.todayTasks = () => {
  const s = E.S(), d = E.day(), due = E.dueIds().length;
  const plan = E.planToday ? E.planToday() : null;
  const tasks = [];
  tasks.push({ href: "revisions", ico: "🗂️", title: "Révisions", sub: due ? `${E.plural(due, "carte")} à revoir` : "Rien à revoir pour l’instant", done: due === 0 && (d.reviewed || 0) >= 0 && Object.keys(E.state.srs).length > 0, skip: !Object.keys(E.state.srs).length });
  tasks.push({ href: plan?.theme ? `apprendre-${plan.theme.id}` : "apprendre", ico: plan?.theme?.emoji || "✨", title: "Nouveaux mots", sub: `${Math.min(d.learned || 0, s.newWords)} / ${s.newWords} appris${plan?.theme ? ` · ${plan.theme.name}` : ""}`, done: (d.learned || 0) >= s.newWords });
  const lesson = plan?.lesson || (E.nextLesson ? E.nextLesson() : null), game = plan?.game || (E.gameOfDay ? E.gameOfDay() : null);
  if (lesson) tasks.push({ href: lesson.href, ico: "📐", title: "Leçon conseillée", sub: lesson.name, done: E.state.lessons[lesson.id]?.day === E.today() });
  tasks.push({ href: `jeu-${game?.id || "image"}`, ico: game?.emoji || "🎮", title: "Jeu du jour", sub: game?.name || "Un petit quiz", done: (d.games || 0) > 0 });
  return tasks.filter(t => !t.skip);
};
E.route("accueil", () => {
  const s = E.S(), d = E.day(), t = E.today();
  const goal = s.dailyXp, pct = d.xp / goal;
  const due = E.dueIds().length;
  const mastered = Object.keys(E.state.srs).filter(E.mastered).length;
  const started = Object.keys(E.state.srs).length;
  const study = E.isStudyDay(t);
  const planInfo = E.planToday ? E.planToday() : null;
  const tasks = E.todayTasks();
  const firstTodo = tasks.find(x => !x.done) || tasks[0];
  const w = E.wordOfDay(), w2 = E.wordOfDay(1);
  const idiom = window.IDIOMS[t % window.IDIOMS.length];
  const hello = s.name ? `Salut ${esc(s.name)} !` : "Salut !";
  const weekStart = t - ((E.dow(t) + 6) % 7);
  const week = Array.from({ length: 7 }, (_, i) => {
    const n = weekStart + i, dd = E.state.days[E.keyOf(n)], ok = dd && dd.xp >= goal, some = dd && dd.xp > 0;
    return `<div class="d${n === t ? " today" : ""}${E.isStudyDay(n) ? "" : " rest"}${ok ? " ok" : ""}" title="${E.fmtDay(n, true)}">${E.DAYS_SHORT[E.dow(n)]}<i>${ok ? "✅" : some ? "⚡" : E.isStudyDay(n) ? (n < t ? "·" : "○") : "💤"}</i></div>`;
  }).join("");
  return `
  <section class="hero">
    <svg class="hero-bolt" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 2 4 13.5h6.5L9 22l10-12h-6.6L13.5 2Z" fill="#fff"/></svg>
    <div class="stack" style="gap:14px">
      <span class="eyebrow">${E.fmtDay(t, true)}${planInfo ? ` · jour ${planInfo.index + 1} / ${s.planLength} du programme` : ""}</span>
      <h1>${hello} On allume l’éclair ? ⚡</h1>
      <p>${study ? (d.xp >= goal ? "Objectif du jour atteint. Bravo ! Tu peux continuer pour le plaisir." : `Encore <b>${goal - d.xp} points</b> pour atteindre ton objectif du jour. ${s.useDays ? ` Ton rendez-vous : <b>${esc(s.reminder)}</b>.` : ""}`) : "C’est un jour de repos dans ton programme. Une petite partie de jeu ne fait jamais de mal !"}</p>
      <div class="row"><a class="btn spark big" href="#${firstTodo.href}">Commencer ma séance →</a><a class="btn ghost" href="#jeu-eclair">⚡ Défi 60 s</a></div>
    </div>
    <div class="ring-wrap">${ring(pct, d.xp, `sur ${goal} points`)}</div>
  </section>

  ${E.welcomeBox ? E.welcomeBox() : ""}
  ${E.state.ui.welcomed && !Object.keys(E.state.srs).length && !E.state.ui.testDone ? `<section class="card row between" style="background:var(--spark-soft)"><span><b>🎓 Première visite ?</b> Fais le test de niveau (3 minutes) : le site choisira les bons mots pour toi.</span><a class="btn primary" href="#test">Faire le test →</a></section>` : ""}
  <div class="stat-row">
    <div class="stat"><span class="s-ico">🔥</span><b>${E.streak()}</b><span>jours de suite</span></div>
    <div class="stat"><span class="s-ico">🧠</span><b>${mastered}</b><span>mots maîtrisés · ${started} vus</span></div>
    <div class="stat"><span class="s-ico">🗂️</span><b>${due}</b><span>cartes à revoir</span></div>
    <div class="stat"><span class="s-ico">📚</span><b>${Object.keys(E.state.lessons).length}</b><span>leçons étudiées</span></div>
  </div>

  <div class="grid g2">
    <section class="card">
      <div class="card-title"><h2>Ta séance du jour</h2><span class="tag accent">${tasks.filter(x => x.done).length} / ${tasks.length}</span></div>
      <div class="todo">${tasks.map(x => `<a href="#${x.href}" class="${x.done ? "done" : ""}"><span class="t-ico">${x.done ? "✅" : x.ico}</span><span><b>${esc(x.title)}</b><small>${esc(x.sub)}</small></span><span aria-hidden="true">→</span></a>`).join("")}</div>
    </section>
    <section class="card">
      <div class="card-title"><h2>Ta semaine</h2><a class="btn small ghost" href="${s.useDays ? "#reglages-rythme" : "#programme"}">${s.useDays ? "Mes jours ⚙️" : "📅 Programme (facultatif)"}</a></div>
      <div class="week">${week}</div>
      <p class="muted" style="margin-top:12px;font-size:.9rem">${s.useDays ? `✅ objectif atteint · ⚡ un peu de pratique · 💤 jour de repos. ${s.restKeepsStreak ? "Les jours de repos ne cassent pas ta série." : "Chaque jour compte pour ta série."}` : "✅ objectif atteint · ⚡ un peu de pratique. Aucun jour imposé : tu apprends quand tu veux."}</p>
      ${planInfo ? `<div style="margin-top:14px" class="stack"><div class="row between"><b>Programme ${s.planLength} jours</b><span class="muted">${E.state.plan.done.length} jours faits</span></div><div class="bar spark"><i style="width:${Math.round(E.state.plan.done.length / s.planLength * 100)}%"></i></div><a class="btn small" href="#programme">Voir mon programme →</a></div>` : ""}
    </section>
  </div>

  <div class="grid g2">
    <section class="card">
      <div class="card-title"><span class="eyebrow">Le mot du jour</span>${E.favBtn(w.id)}</div>
      <div class="wotd"><div class="big-emoji">${E.img(w)}</div><div class="stack" style="gap:6px">
        <div class="row"><h3>${esc(w.en)}</h3>${E.sayBtn(w.en)}</div>
        <div class="muted">${esc(w.fr)}</div>
        <p>“${esc(w.ex)}”<br><span class="muted">${esc(w.exFr)}</span></p>
        <a class="btn small" href="#theme-${w.theme}">Thème : ${esc(E.THEME.get(w.theme).name)} →</a>
      </div></div>
    </section>
    <section class="card stack">
      <span class="eyebrow">L’expression du jour</span>
      <div class="row"><span style="font-size:2.4rem">${idiom.note}</span><div class="stack" style="gap:4px;min-width:0;flex:1"><div class="row"><b style="font-size:1.15rem">${esc(idiom.en)}</b>${E.sayBtn(idiom.en)}</div><span class="muted">${esc(idiom.fr)}</span></div></div>
      <hr>
      <span class="eyebrow">Et en bonus</span>
      <div class="row"><span style="font-size:2rem">${E.img(w2)}</span><b>${esc(w2.en)}</b>${E.sayBtn(w2.en)}<span class="muted">= ${esc(w2.fr)}</span></div>
      <a class="btn small ghost" href="#idiomes">Toutes les expressions →</a>
    </section>
  </div>

  <section class="stack">
    <h2>Explorer</h2>
    <div class="tiles">
      ${[["vocabulaire", "🧠", "Vocabulaire", `${E.THEMES.length} thèmes en images`], ["temps", "⏳", "Les 12 temps", "Enfin clairs, avec des frises"], ["jeux", "🎮", "Jeux & quiz", "Image, dictée, pendu, memory…"],
        ["verbes", "🔁", "Verbes irréguliers", `${window.IRREGULARS.length} verbes`], ["phrases", "💬", "Phrases utiles", "Restaurant, voyage, travail…"], ["phrasal", "🧲", "Phrasal verbs", `${window.PHRASALS.length} à connaître`],
        ["prononciation", "👄", "Prononciation", "Les sons qui piègent"], ["programme", "📅", "Mon programme", `${s.planLength} jours, à ton rythme`],
        ["histoires", "📖", "Petites histoires", `${(window.STORIES || []).length} textes à écouter`], ["test", "🎓", "Test de niveau", "Ton niveau en 3 minutes"]]
        .map(([h, i, t2, sub]) => `<a class="tile" href="#${h}"><span class="t-emoji">${i}</span><b>${t2}</b><small>${sub}</small></a>`).join("")}
    </div>
  </section>`;
}, "Accueil");

/* ---------- Vocabulaire : liste des thèmes ---------- */
const themeCard = t => {
  const p = E.themeProgress(t);
  return `<a class="theme-card" href="#theme-${t.id}">
    <div class="tc-top"><span class="tc-emoji">${t.emoji}</span><span class="tag lvl">${t.level}</span></div>
    <div><b>${esc(t.name)}</b><div class="muted" style="font-size:.85rem">${t.words.length} mots · ${p.mastered} maîtrisés</div></div>
    <div class="tc-strip" aria-hidden="true">${E.S().showImages ? t.words.slice(0, 8).map(w => w.img).join("") : ""}</div>
    <div class="bar good"><i style="width:${p.pct}%"></i></div>
  </a>`;
};
E.route("vocabulaire", () => {
  const ui = E.state.ui;
  E.after(() => {
    const draw = () => {
      const q = E.norm($("#vq").value), lv = $("#vl").value, cat = $("#vc").value, sort = $("#vs").value;
      ui.vl = lv; ui.vc = cat; ui.vs = sort; E.save();
      let list = E.THEMES.filter(t => (lv === "all" || t.level === lv) && (cat === "all" || t.cat === cat) &&
        (!q || E.norm(t.name).includes(q) || t.words.some(w => E.norm(w.en).includes(q) || E.norm(w.fr).includes(q))));
      if (sort === "progress") list = [...list].sort((a, b) => E.themeProgress(b).pct - E.themeProgress(a).pct);
      if (sort === "todo") list = [...list].sort((a, b) => E.themeProgress(a).pct - E.themeProgress(b).pct);
      if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "fr"));
      if (sort === "level") list = [...list].sort((a, b) => E.lvl(a.level) - E.lvl(b.level));
      const groups = sort === "cat" ? E.CATS.map(c => [c, list.filter(t => t.cat === c)]).filter(g => g[1].length) : [["", list]];
      $("#themeList").innerHTML = list.length ? groups.map(([c, ts]) => `${c ? `<div class="cat-title"><h2>${esc(c)}</h2><span>${E.plural(ts.length, "thème")}</span></div>` : ""}<div class="grid auto-fill">${ts.map(themeCard).join("")}</div>`).join("")
        : `<div class="empty"><span class="e-emoji">🔍</span>Aucun thème ne correspond. Essaie un autre mot.</div>`;
    };
    ["#vq", "#vl", "#vc", "#vs"].forEach(s => $(s).addEventListener("input", draw));
    draw();
  });
  const total = E.WORDS.length, mastered = E.WORDS.filter(w => E.mastered(w.id)).length;
  return `${E.head("Banque de mots", "Vocabulaire en images 🧠", `${E.THEMES.length} thèmes et ${total.toLocaleString("fr-FR")} mots, du niveau A1 au C1. Choisis un thème, écoute, retourne les cartes, joue.`,
    `<div class="stack" style="min-width:220px"><div class="row between"><b>${mastered} / ${total}</b><span class="muted">maîtrisés</span></div><div class="bar good"><i style="width:${(mastered / total * 100).toFixed(1)}%"></i></div><div class="row"><a class="btn small primary" href="#apprendre">✨ Mots du jour</a><a class="btn small" href="#revisions">🗂️ Réviser</a></div></div>`)}
  <div class="card toolbar">
    <label class="field grow" for="vq">Chercher<input id="vq" type="search" placeholder="Un thème ou un mot : chat, kitchen, météo…" autocomplete="off"></label>
    ${E.select("vl", [["all", "Tous les niveaux"], ...E.LEVELS.map(l => [l, `${l} · ${E.LEVEL_NAMES[l]}`])], ui.vl || "all", "Niveau")}
    ${E.select("vc", [["all", "Toutes les catégories"], ...E.CATS.map(c => [c, c])], ui.vc || "all", "Catégorie")}
    ${E.select("vs", [["cat", "Par catégorie"], ["level", "Par niveau"], ["az", "De A à Z"], ["progress", "Les plus avancés"], ["todo", "Les moins avancés"]], ui.vs || "cat", "Trier")}
  </div>
  <div id="themeList" class="stack" style="gap:18px"></div>`;
}, "Vocabulaire");

/* ---------- Un thème ---------- */
const wordCard = w => {
  const m = E.mastered(w.id), c = E.card(w.id);
  return `<article class="word-card${m ? " mastered" : ""}">
    ${E.S().showImages ? `<div class="wc-img" aria-hidden="true">${w.img}</div>` : ""}
    <div class="wc-actions"><span class="wc-en">${esc(w.en)}</span>${E.sayBtn(w.en)}</div>
    <div class="wc-fr" tabindex="0">${esc(w.fr)}</div>
    ${E.S().showExample ? `<div class="wc-ex"><button class="say" style="float:right;width:28px;height:28px;font-size:.8rem" type="button" data-say="${esc(w.ex)}" aria-label="Écouter l’exemple">🔊</button>${esc(w.ex)}<i>${esc(w.exFr)}</i></div>` : ""}
    <div class="wc-actions"><span class="tag ${m ? "good" : c ? "accent" : ""}">${m ? "✓ maîtrisé" : c ? `boîte ${c.b}/7` : "nouveau"}</span>${E.favBtn(w.id)}</div>
  </article>`;
};
const wordRow = w => `<div class="wl-row"><span class="wl-img" aria-hidden="true">${E.img(w)}</span><span><b>${esc(w.en)}</b> ${E.mastered(w.id) ? '<span class="tag good">✓</span>' : ""}<br><small class="muted">${esc(w.ex)}</small></span><span class="wl-fr" tabindex="0">${esc(w.fr)}</span><span class="row" style="gap:4px;flex-wrap:nowrap">${E.sayBtn(w.en)}${E.favBtn(w.id)}</span></div>`;
E.route("theme", id => {
  const t = E.THEME.get(id);
  if (!t) return `<div class="empty"><span class="e-emoji">🤷</span>Ce thème n’existe pas. <a class="btn" href="#vocabulaire">Voir tous les thèmes</a></div>`;
  const p = E.themeProgress(t), ui = E.state.ui;
  const idx = E.THEMES.indexOf(t), prev = E.THEMES[idx - 1], next = E.THEMES[idx + 1];
  E.after(() => {
    const draw = () => {
      const view = $("#tv .on")?.dataset.v || "cartes", sort = $("#tsort").value, hide = $("#thide").checked;
      E.S().vocabView = view; E.S().blurFr = hide; E.save();
      let words = [...t.words];
      if (sort === "az") words.sort((a, b) => a.en.localeCompare(b.en));
      if (sort === "todo") words.sort((a, b) => (E.card(a.id)?.b || 0) - (E.card(b.id)?.b || 0));
      if (sort === "random") words = E.shuffle(words);
      const box = $("#words");
      box.className = (view === "liste" ? "card word-list" : "word-grid") + (hide ? " blur" : "");
      box.innerHTML = words.map(view === "liste" ? wordRow : wordCard).join("");
    };
    $("#tv").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("#tv button").forEach(x => x.classList.toggle("on", x === b)); draw(); });
    $("#tsort").addEventListener("input", draw); $("#thide").addEventListener("input", draw);
    $("#words").addEventListener("click", e => { const fr = e.target.closest(".wc-fr, .wl-fr"); if (fr) fr.classList.toggle("revealed"); });
    $("#listenAll").addEventListener("click", () => {
      const list = t.words;
      E.sayQueue(list.map(w => w.en), i => E.toast(`🔊 ${list[i].en} = ${list[i].fr}`));
    });
    draw();
  });
  return `<div class="crumbs"><a href="#vocabulaire">Vocabulaire</a> › <span>${esc(t.cat)}</span></div>
  ${E.head(`${t.level} · ${E.LEVEL_NAMES[t.level]} · ${t.words.length} mots`, `${t.emoji} ${esc(t.name)}`, `${p.mastered} mots maîtrisés, ${p.started} déjà vus. Clique sur 🔊 pour écouter, sur ☆ pour garder un mot en favori.`,
    `<div class="stack" style="min-width:240px"><div class="bar good"><i style="width:${p.pct}%"></i></div>
     <div class="row"><a class="btn primary" href="#cartes-${t.id}">🃏 Cartes mémoire</a><a class="btn spark" href="#apprendre-${t.id}">✨ Apprendre</a></div>
     <div class="row"><button class="btn small" id="quizTheme" type="button">🎯 Quiz du thème</button><button class="btn small" id="listenAll" type="button">🔊 Tout écouter</button></div></div>`)}
  <div class="card toolbar" style="align-items:center">
    <div class="field">Affichage<div class="seg" id="tv"><button type="button" data-v="cartes" class="${(ui.tv || E.S().vocabView) !== "liste" ? "on" : ""}">🖼️ Cartes</button><button type="button" data-v="liste" class="${E.S().vocabView === "liste" ? "on" : ""}">☰ Liste</button></div></div>
    ${E.select("tsort", [["order", "Ordre du thème"], ["az", "De A à Z"], ["todo", "À revoir d’abord"], ["random", "Au hasard"]], "order", "Ordre")}
    <label class="switch" style="border:0"><span><b>Cacher le français</b><small>Pour se tester : clique pour révéler</small></span><input class="toggle" type="checkbox" id="thide" ${E.S().blurFr ? "checked" : ""}></label>
  </div>
  <div id="words"></div>
  <div class="row between">${prev ? `<a class="btn ghost" href="#theme-${prev.id}">← ${prev.emoji} ${esc(prev.name)}</a>` : "<span></span>"}${next ? `<a class="btn ghost" href="#theme-${next.id}">${next.emoji} ${esc(next.name)} →</a>` : ""}</div>`;
}, id => E.THEME.get(id)?.name || "Thème");
document.addEventListener("click", e => {
  if (e.target.closest("#quizTheme")) { const id = location.hash.slice(7); E.state.ui.gSource = "theme:" + id; E.save(); E.go("jeu-image"); }
});

/* ---------- Session de cartes mémoire ---------- */
E.flashSession = (ids, opt) => {
  const s = E.S();
  if (!ids.length) return `<div class="card empty"><span class="e-emoji">${opt.emptyEmoji || "🎉"}</span><h2>${opt.emptyTitle || "Rien à faire ici"}</h2><p>${opt.emptyText || ""}</p><div class="row" style="justify-content:center">${opt.emptyActions || `<a class="btn primary" href="#vocabulaire">Choisir un thème</a>`}</div></div>`;
  const queue = ids.map(id => ({ id, again: 0 }));
  let pos = 0, flipped = false, stats = { good: 0, hard: 0, again: 0 };
  const dirFor = () => s.cardDir === "mix" ? (Math.random() < 0.5 ? "en-fr" : "fr-en") : s.cardDir;
  let dir = dirFor();
  E.after(() => {
    const box = $("#flashBox");
    const show = () => {
      if (pos >= queue.length) return finish();
      const w = E.WORD.get(queue[pos].id);
      flipped = false;
      const front = dir === "en-fr"
        ? `<div class="f-img">${E.img(w)}</div><div class="f-word">${esc(w.en)}</div><div class="f-hint">Que veut dire ce mot ? Touche la carte pour la retourner.</div>`
        : `<div class="f-img">${E.img(w)}</div><div class="f-word">${esc(w.fr)}</div><div class="f-hint">Comment dit-on ça en anglais ?</div>`;
      const back = `<div class="f-img" style="font-size:2.6rem">${E.img(w)}</div><div class="f-word">${esc(dir === "en-fr" ? w.fr : w.en)}</div>
        <div class="row" style="justify-content:center"><b>${esc(w.en)}</b>${E.sayBtn(w.en)}</div>
        ${s.showExample ? `<div class="f-ex">“${esc(w.ex)}”<i>${esc(w.exFr)}</i></div>` : ""}`;
      const c = E.card(w.id);
      box.innerHTML = `<div class="play-top" style="width:min(560px,100%)"><span>${pos + 1} / ${queue.length}</span><span class="tag ${c ? "accent" : ""}">${c ? `boîte ${c.b}/7` : "nouveau mot"}</span><span>✅ ${stats.good} · 🤔 ${stats.hard} · 🔁 ${stats.again}</span></div>
        <div class="bar" style="width:min(560px,100%)"><i style="width:${pos / queue.length * 100}%"></i></div>
        <div class="flash" id="flash" role="button" tabindex="0" aria-label="Retourner la carte"><div class="flash-in"><div class="flash-face">${front}</div><div class="flash-face back">${back}</div></div></div>
        <div class="rate" id="rate" hidden>
          <button class="btn bad" type="button" data-g="0">🔁 À revoir<small>touche 1</small></button>
          <button class="btn" type="button" data-g="1">🤔 Difficile<small>touche 2</small></button>
          <button class="btn good" type="button" data-g="2">✅ Je savais<small>touche 3</small></button>
        </div>
        <p class="muted" style="font-size:.85rem">Raccourcis : <kbd>Espace</kbd> retourner · <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> noter · <kbd>S</kbd> écouter</p>`;
      if (dir === "en-fr" && s.autoplay) E.say(w.en);
    };
    const flip = () => {
      const f = $("#flash"); if (!f) return;
      flipped = !flipped; f.classList.toggle("flipped", flipped);
      if (flipped) { $("#rate").hidden = false; if (dir === "fr-en" && s.autoplay) E.say(E.WORD.get(queue[pos].id).en); }
    };
    const rate = g => {
      if (!flipped) return;
      const item = queue[pos];
      E.grade(item.id, g);
      if (g === 0) { stats.again++; E.sfx("ko"); if (item.again < 2) queue.push({ id: item.id, again: item.again + 1 }); }
      else if (g === 1) { stats.hard++; E.sfx("tick"); }
      else { stats.good++; E.sfx("ok"); }
      pos++; dir = dirFor(); show();
    };
    const finish = () => {
      E.sfx("win"); if (opt.onFinish) opt.onFinish(stats);
      box.innerHTML = `<div class="card result" style="width:min(560px,100%)"><span class="r-big">🏁</span><h2>Séance terminée !</h2>
        <p>✅ ${stats.good} sus · 🤔 ${stats.hard} difficiles · 🔁 ${stats.again} à revoir</p>
        <p class="muted">Les cartes reviendront au bon moment grâce à la répétition espacée : 1, 2, 4, 8, 16 jours…</p>
        <div class="row" style="justify-content:center">${opt.again ? `<button class="btn primary" type="button" id="againBtn">↻ Recommencer</button>` : ""}<a class="btn" href="#jeux">🎮 Jouer</a><a class="btn ghost" href="#accueil">🏠 Accueil</a></div></div>`;
      $("#againBtn")?.addEventListener("click", () => E.rerender());
    };
    box.addEventListener("click", e => {
      if (e.target.closest("[data-say]")) return;
      if (e.target.closest("#flash")) flip();
      const g = e.target.closest("[data-g]"); if (g) rate(Number(g.dataset.g));
    });
    const key = e => {
      if (e.target.matches("input, textarea, select")) return;
      if (e.key === " " || e.key === "Enter") { if ($("#flash")) { e.preventDefault(); flip(); } }
      else if (["1", "2", "3"].includes(e.key)) rate(Number(e.key) - 1);
      else if (e.key.toLowerCase() === "s" && queue[pos]) E.say(E.WORD.get(queue[pos].id).en);
    };
    document.addEventListener("keydown", key);
    E.onLeave(() => document.removeEventListener("keydown", key));
    show();
  });
  return `<div class="flash-wrap" id="flashBox"></div>`;
};

E.route("cartes", id => {
  let ids, title, back;
  if (id === "fav") { ids = E.state.fav.filter(x => E.WORD.has(x)); title = "⭐ Mes favoris"; back = "favoris"; }
  else { const t = E.THEME.get(id); if (!t) return `<div class="empty">Thème introuvable. <a class="btn" href="#vocabulaire">Retour</a></div>`; ids = t.words.map(w => w.id); title = `${t.emoji} ${esc(t.name)}`; back = `theme-${t.id}`; }
  return `<div class="crumbs"><a href="#vocabulaire">Vocabulaire</a> › <a href="#${back}">${title}</a> › Cartes</div>
  ${E.head("Cartes mémoire", title, "Regarde la carte, essaie de te souvenir, retourne-la, puis sois honnête avec toi-même.")}
  ${E.flashSession(E.shuffle(ids), { again: true, emptyTitle: "Aucun mot ici", emptyText: "Ajoute des favoris avec ☆ dans les thèmes." })}`;
}, "Cartes mémoire");

/* Nouveaux mots du jour */
E.newWordsPick = (themeId, n) => {
  let pool = themeId ? (E.THEME.get(themeId)?.words || []) : [];
  if (!themeId) {
    const plan = E.planToday ? E.planToday() : null;
    const first = plan?.theme ? plan.theme.words : [];
    const lv = E.lvl(E.S().level);
    const rest = [...E.THEMES].sort((a, b) => E.lvl(a.level) - E.lvl(b.level)).filter(t => E.lvl(t.level) <= Math.max(lv, 0) + 0).flatMap(t => t.words);
    pool = [...first, ...rest, ...E.WORDS];
  }
  const seen = new Set();
  return pool.filter(w => !E.started(w.id) && !seen.has(w.id) && seen.add(w.id)).slice(0, n).map(w => w.id);
};
E.route("apprendre", param => {
  const s = E.S(), d = E.day();
  const more = param === "plus";
  const themeId = !more && param ? param : "";
  const left = Math.max(0, s.newWords - (d.learned || 0));
  const n = themeId || more ? s.newWords : left;
  const t = themeId ? E.THEME.get(themeId) : null;
  const ids = n ? E.newWordsPick(themeId, n) : [];
  const opts = [["", "Automatique (selon mon programme et mon niveau)"], ...E.THEMES.map(x => [x.id, `${x.emoji} ${x.name} (${x.level})`])];
  E.after(() => { $("#lt").addEventListener("input", e => E.go(e.target.value ? `apprendre-${e.target.value}` : "apprendre")); });
  return `${E.head("Nouveaux mots", t ? `✨ Apprendre : ${t.emoji} ${esc(t.name)}` : "✨ Tes nouveaux mots du jour", `Objectif : ${s.newWords} nouveaux mots par jour (modifiable dans les réglages). Aujourd’hui : ${d.learned || 0} appris.`)}
  <div class="card toolbar">${E.select("lt", opts, themeId, "Thème")}</div>
  ${E.flashSession(ids, {
    emptyEmoji: left === 0 && !themeId ? "🏆" : "🎉",
    emptyTitle: left === 0 && !themeId ? "Objectif de nouveaux mots atteint !" : "Tous les mots de ce thème sont déjà commencés",
    emptyText: left === 0 && !themeId ? "Tu peux t’arrêter là… ou en apprendre encore quelques-uns." : "Passe en révision ou choisis un autre thème.",
    emptyActions: `<a class="btn primary" href="#apprendre-plus">➕ ${s.newWords} mots de plus</a><a class="btn" href="#revisions">🗂️ Réviser</a><a class="btn ghost" href="#jeux">🎮 Jouer</a>`
  })}`;
}, "Nouveaux mots");

E.route("revisions", () => {
  const due = E.dueIds().slice(0, 80);
  const total = Object.keys(E.state.srs).length;
  return `${E.head("Répétition espacée", "🗂️ Révisions du jour", total ? `${E.plural(E.dueIds().length, "carte")} à revoir aujourd’hui sur ${total} mots commencés. Les mots bien connus reviennent de moins en moins souvent.` : "Commence par apprendre quelques mots : ils reviendront ici au bon moment.")}
  ${E.flashSession(due, {
    emptyEmoji: total ? "🌟" : "🌱",
    emptyTitle: total ? "Tout est révisé pour aujourd’hui !" : "Pas encore de mots à réviser",
    emptyText: total ? "Reviens demain : de nouvelles cartes seront prêtes." : "Apprends tes premiers mots, ils reviendront ici demain.",
    emptyActions: `<a class="btn primary" href="#apprendre">✨ Nouveaux mots</a><a class="btn" href="#jeu-eclair">⚡ Défi éclair</a>`
  })}`;
}, "Révisions");

/* ---------- Recherche ---------- */
E.route("recherche", () => {
  E.after(() => {
    const inp = $("#rq");
    const draw = () => {
      const q = E.norm(inp.value); E.searchQuery = inp.value;
      if (q.length < 2) { $("#res").innerHTML = `<div class="empty"><span class="e-emoji">🔎</span>Tape au moins 2 lettres, en anglais ou en français.</div>`; return; }
      const has = (...xs) => xs.some(x => E.norm(x).includes(q));
      const words = E.WORDS.filter(w => has(w.en, w.fr)).slice(0, 60);
      const verbs = window.IRREGULARS.filter(v => has(v[0], v[1], v[2], v[3])).slice(0, 20);
      const phr = window.PHRASES.flatMap(g => g.items.map(i => ({ ...i, g }))).filter(p => has(p.en, p.fr)).slice(0, 20);
      const pv = window.PHRASALS.filter(p => has(p.en, p.fr)).slice(0, 20);
      const idi = window.IDIOMS.filter(p => has(p.en, p.fr)).slice(0, 20);
      const ff = window.FALSE_FRIENDS.filter(p => has(p.en, p.fr, p.trap)).slice(0, 20);
      const n = words.length + verbs.length + phr.length + pv.length + idi.length + ff.length;
      $("#res").innerHTML = !n ? `<div class="empty"><span class="e-emoji">🤷</span>Aucun résultat pour « ${esc(inp.value)} ».</div>` : `
        ${words.length ? `<section class="stack"><h2>Mots (${words.length})</h2><div class="card word-list">${words.map(w => wordRow(w).replace("</b>", `</b> <a class="tag accent" href="#theme-${w.theme}">${esc(E.THEME.get(w.theme).name)}</a>`)).join("")}</div></section>` : ""}
        ${verbs.length ? `<section class="stack"><h2>Verbes irréguliers</h2><div class="table-wrap"><table class="data"><tbody>${verbs.map(v => `<tr><td class="en">${esc(v[0])}</td><td>${esc(v[1])}</td><td>${esc(v[2])}</td><td>${esc(v[3])}</td><td>${E.sayBtn(`${v[0]}, ${v[1]}, ${v[2]}`)}</td></tr>`).join("")}</tbody></table></div></section>` : ""}
        ${phr.length ? `<section class="stack"><h2>Phrases utiles</h2><div class="card">${phr.map(p => `<div class="phrase">${E.sayBtn(p.en)}<span><b>${esc(p.en)}</b><span class="ph-fr">${esc(p.fr)}</span></span><span class="tag">${p.g.emoji} ${esc(p.g.name)}</span></div>`).join("")}</div></section>` : ""}
        ${pv.length ? `<section class="stack"><h2>Phrasal verbs</h2><div class="card">${pv.map(p => `<div class="phrase">${E.sayBtn(p.en)}<span><b>${esc(p.en)}</b><span class="ph-fr">${esc(p.fr)}</span></span><span class="muted">${esc(p.note)}</span></div>`).join("")}</div></section>` : ""}
        ${idi.length ? `<section class="stack"><h2>Expressions imagées</h2><div class="card">${idi.map(p => `<div class="phrase">${E.sayBtn(p.en)}<span><b>${esc(p.en)}</b><span class="ph-fr">${esc(p.fr)}</span></span><span>${p.note}</span></div>`).join("")}</div></section>` : ""}
        ${ff.length ? `<section class="stack"><h2>Faux amis</h2><div class="card">${ff.map(p => `<div class="phrase">${E.sayBtn(p.en)}<span><b>${esc(p.en)}</b><span class="ph-fr">= ${esc(p.fr)}</span></span><span class="ff-bad">⚠️ ${esc(p.trap)}</span></div>`).join("")}</div></section>` : ""}`;
    };
    inp.addEventListener("input", draw); inp.focus(); draw();
  });
  return `${E.head("Recherche", "🔎 Chercher partout", "Mots, verbes, phrases, phrasal verbs, expressions, faux amis : en anglais ou en français.")}
  <div class="card"><label class="field" for="rq">Ta recherche<input id="rq" type="search" value="${esc(E.searchQuery || "")}" placeholder="ex. maison, run, chance…" autocomplete="off"></label></div>
  <div id="res" class="stack" style="gap:18px"></div>`;
}, "Recherche");

/* ---------- Favoris ---------- */
E.route("favoris", () => {
  const words = E.state.fav.map(id => E.WORD.get(id)).filter(Boolean);
  const others = E.state.fav.filter(id => !E.WORD.has(id));
  return `${E.head("Mis de côté", "⭐ Mes favoris", "Ajoute un mot ou une phrase avec ☆ : tu les retrouves ici, prêts à réviser.", words.length ? `<a class="btn primary" href="#cartes-fav">🃏 Réviser mes favoris</a>` : "")}
  ${words.length ? `<div class="word-grid">${words.map(wordCard).join("")}</div>` : `<div class="card empty"><span class="e-emoji">☆</span><h2>Pas encore de favoris</h2><p>Dans un thème, touche l’étoile d’un mot pour le garder ici.</p><a class="btn primary" href="#vocabulaire">Explorer les thèmes</a></div>`}
  ${others.length ? `<section class="card"><h2>Phrases et expressions</h2>${others.map(id => { const txt = id.split(":").slice(1).join(":"); return `<div class="phrase">${E.sayBtn(txt)}<span><b>${esc(txt)}</b></span>${E.favBtn(id)}</div>`; }).join("")}</section>` : ""}`;
}, "Favoris");
})();
