/* Anglais Éclair — programme jour par jour, statistiques, réglages. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;

/* ---------- Programme ---------- */
const GAME_ROTATION = ["image", "fren", "ecoute", "memory", "ecrire", "pendu", "verbes", "enfr", "lettres", "dictee", "vraifaux", "temps", "phrasal", "idiomes"];
const themeOrder = () => {
  const lv = E.lvl(E.S().level);
  return [...E.THEMES].map((t, k) => ({ t, k })).sort((a, b) => (Math.abs(E.lvl(a.t.level) - lv) - Math.abs(E.lvl(b.t.level) - lv)) || (E.lvl(a.t.level) - E.lvl(b.t.level)) || a.k - b.k).map(x => x.t);
};
const lessonOrder = () => [
  ...window.TENSES.map(t => ({ id: t.id, name: t.fr, level: t.level, href: `temps-${t.id}` })),
  ...window.LESSONS.map(l => ({ id: l.id, name: l.name, level: l.level, href: `lecon-${l.id}` }))
].sort((a, b) => E.lvl(a.level) - E.lvl(b.level));
E.planDays = () => {
  const s = E.S(), start = E.dayNum(s.planStart || E.dayKey()), out = [];
  if (!s.studyDays.length) return out;
  for (let n = start; out.length < s.planLength && n < start + s.planLength * 7 + 7; n++) if (E.isStudyDay(n)) out.push(n);
  return out;
};
E.planItem = idx => {
  const themes = themeOrder(), lessons = lessonOrder();
  const review = idx % 7 === 6;
  const learnIdx = idx - Math.floor((idx + 1) / 7);
  const theme = review ? null : themes[learnIdx % themes.length];
  const lesson = lessons[learnIdx % lessons.length];
  const game = E.GAME.get(review ? "eclair" : GAME_ROTATION[idx % GAME_ROTATION.length]);
  return { index: idx, review, theme, lesson, game };
};
E.planDayIndexFor = num => { if (!E.S().useDays) return null; const i = E.planDays().indexOf(num); return i >= 0 ? i : null; };
E.nextLesson = () => { const all = lessonOrder(), lv = E.lvl(E.S().level); return all.find(l => !E.state.lessons[l.id] && E.lvl(l.level) <= Math.max(lv, 1)) || all.find(l => !E.state.lessons[l.id]) || all[E.today() % all.length]; };
E.gameOfDay = () => E.GAME.get(GAME_ROTATION[E.today() % GAME_ROTATION.length]);
E.planToday = () => { const i = E.planDayIndexFor(E.today()); return i === null ? null : E.planItem(i); };

E.route("programme", param => {
  const s = E.S();
  if (!s.useDays) {
    E.after(() => $("#enableDays").addEventListener("click", () => { s.useDays = true; s.planStart = E.dayKey(); E.state.plan.done = []; E.save(); E.toast("Programme activé 📅"); E.rerender(); }));
    return `${E.head("Facultatif", "Programme jour par jour 📅", "Par défaut, Anglais Éclair n’impose aucun jour : tu apprends quand tu veux, autant que tu veux. Si tu aimes être guidé, tu peux activer un programme.")}
    <section class="card stack">
      <h2>Comment ça marche ?</h2>
      <ul class="list-clean"><li>Tu choisis tes jours d’étude (par exemple lundi, mercredi et samedi) et une durée de 7 à 180 jours.</li><li>Chaque jour d’étude te propose un thème de vocabulaire, une leçon de grammaire et un jeu.</li><li>Un jour sur sept est consacré aux révisions.</li><li>Les jours de repos ne cassent pas ta série. Tu peux tout désactiver à tout moment.</li></ul>
      <div class="row"><button class="btn primary big" type="button" id="enableDays">📅 Activer un programme</button><a class="btn ghost" href="#accueil">Non merci, je reste libre</a></div>
    </section>`;
  }
  const days = E.planDays(), t = E.today();
  const done = new Set(E.state.plan.done);
  const sel = param !== "" && !isNaN(param) ? Number(param) : (E.planDayIndexFor(t) ?? days.findIndex(n => n >= t));
  const end = days[days.length - 1];
  const detail = i => {
    if (i < 0 || i >= days.length) return "";
    const it = E.planItem(i), n = days[i];
    return `<section class="card stack" id="planDetail"><div class="card-title" style="margin:0"><div><span class="eyebrow">${E.fmtDay(n, true)}</span><h2>Jour ${i + 1} ${it.review ? "· Révisions 🔁" : `· ${it.theme.emoji} ${esc(it.theme.name)}`}</h2></div>
      <button class="btn ${done.has(i) ? "good" : ""}" type="button" data-toggle-done="${i}">${done.has(i) ? "✅ Fait" : "Marquer comme fait"}</button></div>
      <div class="todo">
        ${it.review ? `<a href="#revisions"><span class="t-ico">🗂️</span><span><b>Grande révision</b><small>Toutes les cartes à revoir</small></span><span>→</span></a>`
          : `<a href="#apprendre-${it.theme.id}"><span class="t-ico">${it.theme.emoji}</span><span><b>Apprendre ${s.newWords} mots</b><small>${esc(it.theme.name)} · ${it.theme.level}</small></span><span>→</span></a>
             <a href="#revisions"><span class="t-ico">🗂️</span><span><b>Révisions</b><small>Les cartes du jour</small></span><span>→</span></a>`}
        <a href="#${it.lesson.href}"><span class="t-ico">📐</span><span><b>Leçon</b><small>${esc(it.lesson.name)} · ${it.lesson.level}</small></span><span>→</span></a>
        <a href="#jeu-${it.game.id}"><span class="t-ico">${it.game.emoji}</span><span><b>Jeu</b><small>${esc(it.game.name)}</small></span><span>→</span></a>
      </div></section>`;
  };
  E.after(() => {
    const view = $("#app > .view");
    view.addEventListener("click", e => {
      const d = e.target.closest("[data-pd]"); if (d) { E.keepScroll = true; E.go("programme-" + d.dataset.pd); return; }
      const tg = e.target.closest("[data-toggle-done]");
      if (tg) { const i = Number(tg.dataset.toggleDone), arr = E.state.plan.done, k = arr.indexOf(i); if (k >= 0) arr.splice(k, 1); else { arr.push(i); E.addXp(5); E.sfx("ok"); } E.save(); E.rerender(); }
      const dp = e.target.closest("[data-day]");
      if (dp) { const d2 = Number(dp.dataset.day), sd = s.studyDays, k = sd.indexOf(d2); if (k >= 0) { if (sd.length > 1) sd.splice(k, 1); } else sd.push(d2); E.save(); E.rerender(); }
    });
    ["#pl", "#pxp", "#pnw"].forEach(id => $(id).addEventListener("input", e => { s[{ "#pl": "planLength", "#pxp": "dailyXp", "#pnw": "newWords" }[id]] = Number(e.target.value); E.save(); E.rerender(); }));
    $("#pst").addEventListener("change", e => { if (e.target.value) { s.planStart = e.target.value; E.state.plan.done = []; E.save(); E.rerender(); } });
    $("#disableDays").addEventListener("click", () => { s.useDays = false; E.save(); E.toast("Programme désactivé : tu apprends librement."); E.rerender(); });
    $("#prestart").addEventListener("click", () => { s.planStart = E.dayKey(); E.state.plan.done = []; E.save(); E.toast("Programme relancé à partir d’aujourd’hui 🚀"); E.rerender(); });
  });
  const order = [1, 2, 3, 4, 5, 6, 0];
  return `${E.head("Ton plan d’entraînement", `Programme ${s.planLength} jours 📅`, `Chaque jour d’étude : un thème de vocabulaire, une leçon de grammaire et un jeu. Un jour sur sept est consacré aux révisions. Tu choisis tes jours, ta durée et ton rythme.`)}
  <section class="card stack">
    <div class="grid g4">
      ${E.select("pl", [7, 14, 21, 30, 45, 60, 90, 120, 180].map(n => [n, `${n} jours`]), s.planLength, "Durée du programme")}
      <label class="field" for="pst">Date de début<input type="date" id="pst" value="${esc(s.planStart)}"></label>
      ${E.select("pxp", [[30, "30 points · 5 min"], [50, "50 points · 8 min"], [100, "100 points · 15 min"], [150, "150 points · 20 min"], [200, "200 points · 30 min"], [300, "300 points · 45 min"], [500, "500 points · 1 h et plus"]], s.dailyXp, "Objectif par jour")}
      ${E.select("pnw", [3, 5, 8, 10, 15, 20, 30, 50].map(n => [n, `${n} nouveaux mots`]), s.newWords, "Nouveaux mots par jour")}
    </div>
    <div class="field">Mes jours d’étude <small>Touche un jour pour l’activer ou le désactiver</small><div class="daypick">${order.map(d => `<button type="button" data-day="${d}" class="${s.studyDays.includes(d) ? "on" : ""}" aria-pressed="${s.studyDays.includes(d)}">${E.DAYS_SHORT[d]}</button>`).join("")}</div></div>
    <div class="row between"><span class="muted">${E.plural(s.studyDays.length, "jour")} d’étude par semaine · fin prévue le <b>${end ? E.fmtDay(end, true) : "—"}</b></span><span class="row"><button class="btn small ghost" type="button" id="prestart">↻ Recommencer aujourd’hui</button><button class="btn small ghost" type="button" id="disableDays">✕ Désactiver le programme</button></span></div>
    <div class="row between"><b>${done.size} / ${days.length} jours faits</b><span class="muted">${Math.round(done.size / Math.max(1, days.length) * 100)} %</span></div>
    <div class="bar spark"><i style="width:${done.size / Math.max(1, days.length) * 100}%"></i></div>
  </section>
  ${detail(sel)}
  <div class="plan-grid">${days.map((n, i) => {
    const it = E.planItem(i), cls = done.has(i) ? "done" : n === t ? "today" : n < t ? "late" : "future";
    return `<button type="button" class="plan-day ${cls}" data-pd="${i}" ${i === sel ? 'aria-current="true" style="outline:3px solid var(--spark)"' : ""}><span class="row between"><span class="pd-n">J${i + 1}</span><span class="pd-emoji">${done.has(i) ? "✅" : it.review ? "🔁" : it.theme.emoji}</span></span>
      <span class="pd-date">${E.DAYS_SHORT[E.dow(n)]} ${E.fmtDay(n)}</span><small>${it.review ? "Révisions + défi éclair" : esc(it.theme.name)}</small></button>`;
  }).join("")}</div>`;
}, "Programme");

/* ---------- Statistiques ---------- */
E.route("stats", () => {
  const s = E.S(), t = E.today(), days = E.state.days;
  const all = Object.values(days);
  const totalXp = all.reduce((a, d) => a + d.xp, 0);
  const correct = all.reduce((a, d) => a + (d.correct || 0), 0), wrong = all.reduce((a, d) => a + (d.wrong || 0), 0);
  const ids = Object.keys(E.state.srs), mastered = ids.filter(E.mastered).length;
  const studied = all.filter(d => d.xp > 0).length;
  const last = Array.from({ length: 30 }, (_, k) => t - 29 + k);
  const max = Math.max(s.dailyXp, ...last.map(n => days[E.keyOf(n)]?.xp || 0));
  const bars = last.map(n => { const x = days[E.keyOf(n)]?.xp || 0; return `<div class="${x >= s.dailyXp ? "goal" : x === 0 ? "zero" : ""}" style="height:${Math.max(2, x / max * 100)}%" title="${E.fmtDay(n, true)} : ${x} points"></div>`; }).join("");
  const weeks = 18, startHeat = t - ((E.dow(t) + 6) % 7) - (weeks - 1) * 7;
  const heat = Array.from({ length: weeks * 7 }, (_, k) => { const n = startHeat + k; if (n > t) return `<i style="visibility:hidden"></i>`; const x = days[E.keyOf(n)]?.xp || 0; const l = x === 0 ? "" : x < s.dailyXp / 2 ? "l1" : x < s.dailyXp ? "l2" : "l3"; return `<i class="${l}" title="${E.fmtDay(n, true)} : ${x} points"></i>`; }).join("");
  const boxes = [1, 2, 3, 4, 5, 6, 7].map(b => ids.filter(id => E.state.srs[id].b === b).length);
  const bmax = Math.max(1, ...boxes);
  const themes = E.THEMES.map(th => ({ th, p: E.themeProgress(th) })).sort((a, b) => b.p.pct - a.p.pct || b.p.started - a.p.started);
  return `${E.head("Tableau de bord", "Mes progrès 📊", "Tout est calculé sur cet appareil. Rien n’est envoyé sur internet.")}
  <div class="stat-row">
    <div class="stat"><span class="s-ico">⚡</span><b>${totalXp.toLocaleString("fr-FR")}</b><span>points au total</span></div>
    <div class="stat"><span class="s-ico">🔥</span><b>${E.streak()}</b><span>jours de suite · record ${E.bestStreak()}</span></div>
    <div class="stat"><span class="s-ico">🧠</span><b>${mastered}</b><span>mots maîtrisés sur ${ids.length} vus</span></div>
    <div class="stat"><span class="s-ico">🎯</span><b>${correct + wrong ? Math.round(correct / (correct + wrong) * 100) : 0} %</b><span>de bonnes réponses (${correct})</span></div>
  </div>
  <div class="grid g2">
    <section class="card"><div class="card-title"><h2>Points des 30 derniers jours</h2><span class="tag good">vert = objectif atteint</span></div><div class="bars">${bars}</div><div class="bars-x"><span>${E.fmtDay(last[0])}</span><span>aujourd’hui</span></div></section>
    <section class="card"><div class="card-title"><h2>Calendrier d’activité</h2><span class="muted">${E.plural(studied, "jour")} d’étude</span></div><div class="heat">${heat}</div>
      <p class="muted" style="margin-top:10px;font-size:.85rem">Chaque case = un jour. Plus c’est foncé, plus tu as gagné de points.</p></section>
  </div>
  <div class="grid g2">
    <section class="card"><div class="card-title"><h2>Tes cartes par boîte</h2><span class="muted">boîte 4 et plus = maîtrisé</span></div>
      ${boxes.map((n, k) => `<div class="mastery-row"><b>B${k + 1}</b><div class="bar ${k >= 3 ? "good" : ""}"><i style="width:${n / bmax * 100}%"></i></div><span class="n">${n}</span></div>`).join("")}
      <p class="muted" style="font-size:.85rem;margin-top:8px">Une carte revient après 1, 2, 4, 8, 16, 32 puis 64 jours si tu la connais.</p></section>
    <section class="card"><div class="card-title"><h2>Maîtrise par thème</h2><a class="btn small" href="#vocabulaire">Tous les thèmes</a></div>
      <div style="max-height:360px;overflow-y:auto">${themes.map(({ th, p }) => `<a class="mastery-row" href="#theme-${th.id}"><span>${th.emoji}</span><span class="stack" style="gap:3px"><small>${esc(th.name)}</small><span class="bar good"><i style="width:${p.pct}%"></i></span></span><span class="n">${p.mastered}/${p.total}</span></a>`).join("")}</div></section>
  </div>
  <section class="card"><div class="card-title"><h2>Records des jeux</h2></div><div class="grid auto-fill-sm">${E.GAMES.map(g => `<a class="tile" href="#jeu-${g.id}"><span class="t-emoji">${g.emoji}</span><b>${esc(g.name)}</b><small>${E.state.best[g.id] === undefined ? "—" : g.timed ? `${E.state.best[g.id]} bonnes réponses` : `${E.state.best[g.id]} %`}</small></a>`).join("")}</div></section>`;
}, "Mes progrès");

/* ---------- Réglages ---------- */
const sw = (key, label, sub) => `<label class="switch"><span><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span><input class="toggle" type="checkbox" data-set="${key}" ${E.S()[key] ? "checked" : ""}></label>`;
const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-seg="${key}" data-v="${esc(v)}" class="${String(E.S()[key]) === String(v) ? "on" : ""}">${l}</button>`).join("")}</div>`;
const sel = (key, opts, label, sub) => `<label class="field" for="set-${key}">${label}${sub ? ` <small>${sub}</small>` : ""}<select id="set-${key}" data-set="${key}">${opts.map(([v, t]) => `<option value="${esc(v)}"${String(E.S()[key]) === String(v) ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
E.route("reglages", anchor => {
  const s = E.S();
  E.onVoices = () => { if (E.current === "reglages") E.rerender(); };
  const order = [1, 2, 3, 4, 5, 6, 0];
  const voiceOpts = [["", "Automatique (selon l’accent)"], ...E.voices.map(v => [v.name, `${v.name} · ${v.lang}`])];
  E.after(() => {
    const view = $("#app > .view");
    const apply = () => { E.save(); E.applySettings(); E.updatePills(); };
    view.addEventListener("input", e => {
      const el = e.target.closest("[data-set]"); if (!el) return;
      const k = el.dataset.set, d = E.DEFAULTS[k];
      s[k] = el.type === "checkbox" ? el.checked : typeof d === "number" ? Number(el.value) : el.value;
      apply();
      if (k === "useDays") { if (s.useDays) { s.planStart = E.dayKey(); E.state.plan.done = []; E.save(); } E.rerender(); return; }
      if (k === "rate") $("#rateVal").textContent = `${Number(el.value).toFixed(2)}×`;
    });
    view.addEventListener("click", e => {
      const sg = e.target.closest("[data-seg]");
      if (sg && sg.dataset.seg === "mode") { E.setMode(sg.dataset.v); return; }
      if (sg) { const k = sg.dataset.seg, d = E.DEFAULTS[k]; s[k] = typeof d === "number" ? Number(sg.dataset.v) : sg.dataset.v; if (k === "theme" && s.bg !== "auto") { s.bg = "auto"; apply(); E.rerender(); return; } $$(`[data-seg="${k}"]`).forEach(b => b.classList.toggle("on", b === sg)); apply(); return; }
      const bp = e.target.closest("[data-bgpick]");
      if (bp) { s.bg = bp.dataset.bgpick; apply(); E.rerender(); return; }
      const ac = e.target.closest("[data-swatch]");
      if (ac) { s.accent = ac.dataset.swatch; $$("[data-swatch]").forEach(b => b.classList.toggle("on", b === ac)); apply(); return; }
      const dp = e.target.closest("[data-day]");
      if (dp) { const d = Number(dp.dataset.day), k = s.studyDays.indexOf(d); if (k >= 0) { if (s.studyDays.length > 1) s.studyDays.splice(k, 1); else E.toast("Garde au moins un jour d’étude 😉"); } else s.studyDays.push(d); dp.classList.toggle("on", s.studyDays.includes(d)); apply(); return; }
      if (e.target.closest("#resetHelp")) { E.state.ui.helpSeen = {}; E.state.ui.welcomed = 0; s.showHelp = true; E.save(); E.toast("Les aides réapparaîtront sur chaque page 💡"); E.rerender(); return; }
      if (e.target.closest("#testVoice")) { E.say("Hello! Welcome to Anglais Éclair. Let's learn English together."); return; }
      if (e.target.closest("#copyData")) {
        const ta = $("#exportBox"); ta.value = E.exportData();
        const done = () => E.toast("Sauvegarde copiée 📋 Colle-la dans une note ou un e-mail.");
        try { navigator.clipboard.writeText(ta.value).then(done, () => { ta.select(); E.toast("Sélectionne le texte et copie-le (Ctrl + C)."); }); } catch { ta.select(); }
        return;
      }
      if (e.target.closest("#importData")) {
        try { E.importData($("#importBox").value.trim()); E.toast("Sauvegarde importée ✅"); E.rerender(); } catch { E.toast("Ce texte n’est pas une sauvegarde valide."); }
        return;
      }
      if (e.target.closest("#askReset")) { $("#resetBox").hidden = false; return; }
      if (e.target.closest("#cancelReset")) { $("#resetBox").hidden = true; return; }
      if (e.target.closest("#doReset")) { E.resetAll(); E.toast("Tout a été remis à zéro."); E.go("accueil"); return; }
    });
    $("#set-bgCustom").addEventListener("input", e => { s.bgCustom = e.target.value; s.bg = "perso"; E.save(); E.applySettings(); });
    $("#set-bgCustom").addEventListener("change", () => E.rerender());
    $("#set-name").addEventListener("input", e => { s.name = e.target.value.slice(0, 30); E.save(); });
    $("#set-reminder")?.addEventListener("input", e => { s.reminder = e.target.value; E.save(); });
    if (anchor) { const el = $("#s-" + anchor); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60); }
  });
  return `${E.head("Personnalise tout", "Réglages ⚙️", "Tes jours, ton rythme, tes couleurs, ta voix. Les changements sont enregistrés tout de suite sur cet appareil.")}
  <div class="settings">
    <nav class="settings-nav" aria-label="Sections des réglages">
      <a href="#reglages-profil">👤 Profil</a><a href="#reglages-rythme">📅 Jours & rythme</a><a href="#reglages-apparence">🎨 Apparence</a>
      <a href="#reglages-apprentissage">🧠 Apprentissage</a><a href="#reglages-voix">🔊 Voix & sons</a><a href="#reglages-donnees">💾 Mes données</a>
    </nav>
    <div class="stack" style="gap:18px">
      <section class="card stack" id="s-profil"><h2>👤 Profil</h2>
        <div class="field">Je suis${seg("mode", [["eleve", "🎒 Élève"], ["prof", "🍎 Enseignant(e)"]])}<small>Le mode enseignant affiche un espace prof à l’accueil (tableau, fiches, corrigés).</small></div>
        <div class="grid g3">
          <label class="field" for="set-name">Ton prénom<input id="set-name" type="text" value="${esc(s.name)}" placeholder="ex. Tom" maxlength="30" autocomplete="given-name"></label>
          ${sel("level", E.LEVELS.map(l => [l, `${l} · ${E.LEVEL_NAMES[l]}`]), "Ton niveau", "Adapte les mots proposés")}
          ${sel("goal", [["tout", "Un peu de tout"], ["voyage", "Voyager"], ["travail", "Le travail"], ["examen", "Un examen (TOEIC, bac…)"], ["series", "Comprendre les séries"], ["enfants", "Aider mes enfants"]], "Ton objectif")}
        </div></section>

      <section class="card stack" id="s-rythme"><h2>📅 Jours & rythme</h2>
        ${sw("useDays", "Programme avec des jours d’étude (facultatif)", "Désactivé : tu apprends quand tu veux, sans calendrier. Activé : un plan guidé selon tes jours.")}
        ${s.useDays ? `<div class="field">Mes jours d’étude<div class="daypick">${order.map(d => `<button type="button" data-day="${d}" class="${s.studyDays.includes(d) ? "on" : ""}">${E.DAYS_SHORT[d]}</button>`).join("")}</div></div>
        <div class="grid g3">
          ${sel("dailyXp", [[30, "30 points · 5 min"], [50, "50 points · 8 min"], [100, "100 points · 15 min"], [150, "150 points · 20 min"], [200, "200 points · 30 min"], [300, "300 points · 45 min"], [500, "500 points · 1 h et plus"]], "Objectif quotidien")}
          ${sel("newWords", [3, 5, 8, 10, 15, 20, 30, 50].map(n => [n, `${n} mots`]), "Nouveaux mots par jour")}
          ${sel("planLength", [7, 14, 21, 30, 45, 60, 90, 120, 180].map(n => [n, `${n} jours`]), "Durée du programme")}
          <label class="field" for="set-planStart">Début du programme<input type="date" id="set-planStart" data-set="planStart" value="${esc(s.planStart)}"></label>
          <label class="field" for="set-reminder">Mon heure de rendez-vous<input type="time" id="set-reminder" value="${esc(s.reminder)}"></label>
        </div>
        ${sw("restKeepsStreak", "Les jours de repos ne cassent pas ma série", "Seuls tes jours d’étude comptent pour la série 🔥")}` : `<div class="grid g2">
          ${sel("dailyXp", [[30, "30 points · 5 min"], [50, "50 points · 8 min"], [100, "100 points · 15 min"], [150, "150 points · 20 min"], [200, "200 points · 30 min"], [300, "300 points · 45 min"], [500, "500 points · 1 h et plus"]], "Objectif quotidien (indicatif)")}
          ${sel("newWords", [3, 5, 8, 10, 15, 20, 30, 50].map(n => [n, `${n} mots`]), "Nouveaux mots par jour")}
        </div>`}
      </section>

      <section class="card stack" id="s-apparence"><h2>🎨 Apparence</h2>
        <div class="field">Couleurs<div class="swatches">${E.ACCENTS.map(([id, name, a, b]) => `<button type="button" class="swatch${s.accent === id ? " on" : ""}" data-swatch="${id}"><span class="sw-dots"><i style="background:${a}"></i><i style="background:${b}"></i></span>${name}</button>`).join("")}</div></div>
        <div class="field">Couleur du fond <small>Les fonds sombres passent automatiquement le texte en clair.</small><div class="swatches bg-swatches">${E.BACKGROUNDS.map(([id, name, v]) => {
          const c = v === "custom" ? E.customBackground(s.bgCustom) : v;
          const look = c ? `background:${c.bg};color:${c.ink || (c.dark ? "#eef0ff" : "#12142b")};border-color:${s.bg === id ? "var(--accent)" : c.line}` : "";
          return `<button type="button" class="swatch bg-swatch${s.bg === id ? " on" : ""}" data-bgpick="${id}" style="${look}">${id === "auto" ? "🖥️ " : id === "perso" ? "🎨 " : c?.dark ? "🌙 " : ""}${name}</button>`;
        }).join("")}</div></div>
        <div class="grid g2">
          <label class="field" for="set-bgCustom">Ma couleur de fond <small>Choisis n’importe quelle couleur</small><input type="color" id="set-bgCustom" value="${esc(s.bgCustom)}" style="height:46px;padding:4px"></label>
          <div class="field">Motif de fond${seg("pattern", [["none", "Aucun"], ["points", "• Points"], ["carreaux", "▦ Carreaux"], ["lignes", "☰ Lignes"], ["cahier", "📓 Cahier"]])}</div>
        </div>
        <div class="grid g2">
          <div class="field">Mode${seg("theme", [["auto", "🖥️ Auto"], ["light", "☀️ Clair"], ["dark", "🌙 Sombre"]])}<small>${s.bg !== "auto" ? "Le mode est décidé par la couleur de fond choisie." : "Auto suit le réglage de ton appareil."}</small></div>
          <div class="field">Taille du texte${seg("size", [["s", "A-"], ["m", "A"], ["l", "A+"], ["xl", "A++"]])}</div>
          <div class="field">Forme des cartes${seg("shape", [["carre", "▢ Carrées"], ["arrondi", "▢ Arrondies"], ["bulle", "◯ Bulles"]])}</div>
          <div class="field">Taille des images${seg("imgSize", [["s", "Petites"], ["m", "Moyennes"], ["l", "Grandes"]])}</div>
        </div>
        ${sel("font", [["moderne", "Moderne (Figtree)"], ["lisible", "Très lisible (Atkinson, aide la dyslexie)"], ["ronde", "Ronde (Nunito)"], ["machine", "Machine à écrire"], ["systeme", "Police du système"]], "Police")}
        ${sw("showImages", "Afficher les images", "Les petites illustrations à côté des mots")}
        ${sw("motion", "Animations", "Cartes qui se retournent, confettis…")}
      </section>

      <section class="card stack" id="s-apprentissage"><h2>🧠 Apprentissage</h2>
        <div class="grid g3">
          ${sel("cardDir", [["en-fr", "Anglais → français"], ["fr-en", "Français → anglais"], ["mix", "Mélangé"]], "Sens des cartes mémoire")}
          ${sel("quizLen", [5, 10, 15, 20, 30, 50].map(n => [n, `${n} questions`]), "Longueur des quiz")}
          ${sel("flashTime", [30, 60, 90, 120, 180].map(n => [n, `${n} secondes`]), "Chrono des jeux rapides")}
          ${sel("quizLevel", [["all", "Tous les verbes"], ["common", "Sans les verbes rares"]], "Verbes irréguliers en quiz")}
        </div>
        ${sw("showHelp", "Afficher les aides sur chaque page", "L’encadré « 💡 Comment ça marche ? » en haut des pages")}
        <div class="row"><button class="btn small ghost" type="button" id="resetHelp">↻ Réafficher toutes les aides et le message de bienvenue</button></div>
        ${sw("showExample", "Montrer les phrases d’exemple", "Sous chaque mot et au dos des cartes")}
        ${sw("autoplay", "Lecture audio automatique", "Les mots sont prononcés dès qu’ils apparaissent")}
        ${sw("strict", "Correction stricte", "Sinon, les accents, majuscules et ponctuation sont ignorés")}
      </section>

      <section class="card stack" id="s-voix"><h2>🔊 Voix & sons</h2>
        <div class="grid g2">
          ${sel("voiceAccent", [["en-GB", "🇬🇧 Britannique"], ["en-US", "🇺🇸 Américain"], ["en-AU", "🇦🇺 Australien"], ["en-IE", "🇮🇪 Irlandais"], ["en-IN", "🇮🇳 Indien"], ["en-CA", "🇨🇦 Canadien"], ["en-ZA", "🇿🇦 Sud-africain"]], "Accent")}
          ${sel("voiceName", voiceOpts, "Voix", E.voices.length ? `${E.voices.length} voix anglaises trouvées` : "aucune voix trouvée pour l’instant")}
        </div>
        <label class="field" for="set-rate">Vitesse de lecture : <b id="rateVal">${Number(s.rate).toFixed(2)}×</b><input type="range" id="set-rate" data-set="rate" min="0.5" max="1.4" step="0.05" value="${s.rate}"></label>
        <div class="row"><button class="btn primary" type="button" id="testVoice">🔊 Tester la voix</button>${E.speechOk ? "" : '<span class="tag">La synthèse vocale n’est pas disponible sur ce navigateur</span>'}</div>
        ${sw("sfx", "Effets sonores", "Petits sons pour les bonnes et mauvaises réponses")}
        <p class="muted" style="font-size:.88rem">Les voix viennent de ton appareil : elles sont gratuites et marchent sans connexion. Sur téléphone, tu peux en télécharger d’autres dans les réglages du système (Accessibilité → Contenu énoncé sur iPhone, Synthèse vocale sur Android).</p>
      </section>

      <section class="card stack" id="s-donnees"><h2>💾 Mes données</h2>
        <p class="muted">Tes progrès sont enregistrés dans ce navigateur, sans compte. Pour les transférer sur un autre appareil : copie ta sauvegarde, puis colle-la de l’autre côté.</p>
        <div class="grid g2">
          <div class="stack"><button class="btn" type="button" id="copyData">📋 Copier ma sauvegarde</button><textarea id="exportBox" rows="3" readonly placeholder="Ta sauvegarde apparaîtra ici"></textarea></div>
          <div class="stack"><textarea id="importBox" rows="3" placeholder="Colle ici une sauvegarde…"></textarea><button class="btn" type="button" id="importData">📥 Importer cette sauvegarde</button></div>
        </div>
        <button class="btn bad" type="button" id="askReset">🗑️ Tout remettre à zéro</button>
        <div class="confirm-box" id="resetBox" hidden><b>Effacer tous tes progrès, favoris et réglages ?</b><span>Cette action est définitive sur cet appareil.</span><div class="row"><button class="btn bad" type="button" id="doReset">Oui, tout effacer</button><button class="btn" type="button" id="cancelReset">Annuler</button></div></div>
      </section>

      <section class="card stack"><h2>📲 Installer l’appli</h2><p>Sur iPhone : bouton Partager → <b>Sur l’écran d’accueil</b>. Sur Android : menu ⋮ → <b>Installer l’application</b>. Anglais Éclair s’ouvre alors comme une vraie appli et marche même hors connexion.</p></section>
    </div>
  </div>`;
}, "Réglages");
})();
