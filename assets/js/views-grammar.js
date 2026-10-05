/* Anglais Éclair — les 12 temps, grammaire, conjugueur, verbes irréguliers. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;
const TENSES = window.TENSES, LESSONS = window.LESSONS;
E.TENSE = new Map(TENSES.map(t => [t.id, t]));
E.LESSON = new Map(LESSONS.map(l => [l.id, l]));

/* ---------- Moteur de conjugaison ---------- */
const first = f => String(f).split("/")[0].trim();
E.IRR = new Map(window.IRREGULARS.map(v => [v[0].toLowerCase(), { past: first(v[1]), part: first(v[2]), fr: v[3] }]));
const DOUBLE = new Set(["begin", "forget", "regret", "admit", "commit", "occur", "refer", "prefer", "permit", "submit", "omit", "control", "compel", "upset", "equip", "patrol", "travel", "quit", "transfer", "forbid"]);
const vowelGroups = w => (w.match(/[aeiouy]+/g) || []).length;
const doubles = v => DOUBLE.has(v) || (vowelGroups(v.replace(/y$/, "")) === 1 && /[^aeiou][aeiou][bcdfgklmnprstvz]$/.test(v));
E.third = v => v === "be" ? "is" : v === "have" ? "has" : /(s|x|z|ch|sh|o)$/.test(v) ? v + "es" : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + "ies" : v + "s";
E.ing = v => v === "be" ? "being" : /ie$/.test(v) ? v.slice(0, -2) + "ying" : /[^e]e$/.test(v) && !/(ee|ye|oe)$/.test(v) ? v.slice(0, -1) + "ing" : doubles(v) ? v + v.slice(-1) + "ing" : v + "ing";
E.regPast = v => /e$/.test(v) ? v + "d" : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + "ied" : doubles(v) ? v + v.slice(-1) + "ed" : v + "ed";
E.CONJ_TENSES = [
  ...TENSES.map(t => [t.id, `${t.fr} · ${t.en}`]),
  ["going-to", "Futur proche · going to"], ["would", "Conditionnel présent · would"], ["would-have", "Conditionnel passé · would have"], ["used-to", "Habitude passée · used to"]
];
E.PERSONS = [["I", "I", 0], ["you", "you", 1], ["he / she / it", "she", 2], ["we", "we", 3], ["you (pluriel)", "you", 4], ["they", "they", 5]];
E.conjugate = (input, tense) => {
  const verb = String(input).trim().toLowerCase().replace(/^to\s+/, "").replace(/\s+/g, " ");
  if (!/^[a-z]+(?:[ -][a-z]+)*$/.test(verb)) return null;
  const [head, ...rest] = verb.split(" "), tail = rest.length ? " " + rest.join(" ") : "";
  const irr = E.IRR.get(head);
  const past = (irr ? irr.past : E.regPast(head)) + tail, part = (irr ? irr.part : E.regPast(head)) + tail, ing = E.ing(head) + tail, base = verb;
  const beP = ["am", "are", "is", "are", "are", "are"], beS = ["was", "were", "was", "were", "were", "were"];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  return E.PERSONS.map(([label, s, p]) => {
    const has = p === 2 ? "has" : "have", doA = p === 2 ? "does" : "do";
    let a, n, q;
    switch (tense) {
      case "present-simple":
        if (head === "be") { a = `${s} ${beP[p]}${tail}`; n = `${s} ${beP[p]} not${tail}`; q = `${cap(beP[p])} ${s}${tail}?`; }
        else { a = `${s} ${p === 2 ? E.third(head) + tail : base}`; n = `${s} ${doA} not ${base}`; q = `${cap(doA)} ${s} ${base}?`; }
        break;
      case "present-continuous": a = `${s} ${beP[p]} ${ing}`; n = `${s} ${beP[p]} not ${ing}`; q = `${cap(beP[p])} ${s} ${ing}?`; break;
      case "present-perfect": a = `${s} ${has} ${part}`; n = `${s} ${has} not ${part}`; q = `${cap(has)} ${s} ${part}?`; break;
      case "present-perfect-continuous": a = `${s} ${has} been ${ing}`; n = `${s} ${has} not been ${ing}`; q = `${cap(has)} ${s} been ${ing}?`; break;
      case "past-simple":
        if (head === "be") { a = `${s} ${beS[p]}${tail}`; n = `${s} ${beS[p]} not${tail}`; q = `${cap(beS[p])} ${s}${tail}?`; }
        else { a = `${s} ${past}`; n = `${s} did not ${base}`; q = `Did ${s} ${base}?`; }
        break;
      case "past-continuous": a = `${s} ${beS[p]} ${ing}`; n = `${s} ${beS[p]} not ${ing}`; q = `${cap(beS[p])} ${s} ${ing}?`; break;
      case "past-perfect": a = `${s} had ${part}`; n = `${s} had not ${part}`; q = `Had ${s} ${part}?`; break;
      case "past-perfect-continuous": a = `${s} had been ${ing}`; n = `${s} had not been ${ing}`; q = `Had ${s} been ${ing}?`; break;
      case "future-simple": a = `${s} will ${base}`; n = `${s} will not ${base}`; q = `Will ${s} ${base}?`; break;
      case "future-continuous": a = `${s} will be ${ing}`; n = `${s} will not be ${ing}`; q = `Will ${s} be ${ing}?`; break;
      case "future-perfect": a = `${s} will have ${part}`; n = `${s} will not have ${part}`; q = `Will ${s} have ${part}?`; break;
      case "future-perfect-continuous": a = `${s} will have been ${ing}`; n = `${s} will not have been ${ing}`; q = `Will ${s} have been ${ing}?`; break;
      case "going-to": a = `${s} ${beP[p]} going to ${base}`; n = `${s} ${beP[p]} not going to ${base}`; q = `${cap(beP[p])} ${s} going to ${base}?`; break;
      case "would": a = `${s} would ${base}`; n = `${s} would not ${base}`; q = `Would ${s} ${base}?`; break;
      case "would-have": a = `${s} would have ${part}`; n = `${s} would not have ${part}`; q = `Would ${s} have ${part}?`; break;
      case "used-to": a = `${s} used to ${base}`; n = `${s} did not use to ${base}`; q = `Did ${s} use to ${base}?`; break;
      default: return null;
    }
    return { label, a, n, q };
  });
};
E.conjTable = (verb, tense) => {
  const rows = E.conjugate(verb, tense);
  if (!rows) return `<div class="empty">Écris un verbe en lettres anglaises (ex. <b>work</b>, <b>go</b>, <b>give up</b>).</div>`;
  return `<div class="table-wrap"><table class="data"><thead><tr><th>Personne</th><th>Affirmative</th><th>Négative</th><th>Question</th></tr></thead><tbody>
  ${rows.map(r => `<tr><td class="muted">${esc(r.label)}</td><td><span class="row" style="gap:6px;flex-wrap:nowrap">${E.sayBtn(r.a)}<b>${esc(r.a)}</b></span></td><td>${esc(r.n)}</td><td>${esc(r.q)}</td></tr>`).join("")}</tbody></table></div>`;
};

/* ---------- Frises du temps (SVG) ---------- */
const wave = (x1, x2, y) => { let d = `M${x1} ${y}`; for (let x = x1; x < x2; x += 20) d += ` q5 -9 10 0 t10 0`; return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>`; };
const cross = (x, y, label, color = "var(--accent)") => `<path d="M${x - 8} ${y - 8} l16 16 m0 -16 l-16 16" stroke="${color}" stroke-width="4" stroke-linecap="round"/>${label ? `<text x="${x}" y="${y - 16}" text-anchor="middle" style="fill:var(--ink);font-weight:700">${label}</text>` : ""}`;
const flag = (x, label) => `<line x1="${x}" y1="38" x2="${x}" y2="96" stroke="var(--spark)" stroke-width="3" stroke-dasharray="5 4"/><text x="${x}" y="30" text-anchor="middle" style="fill:var(--ink);font-weight:700">${label}</text>`;
const arrow = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2 - 8}" y2="${y}" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/><path d="M${x2} ${y} l-12 -7 v14 z" style="fill:var(--accent)"/>`;
E.timeline = type => {
  const y = 70;
  let g = "";
  switch (type) {
    case "habit": g = [90, 160, 230, 300, 370, 440, 510].map(x => cross(x, y)).join("") + `<text x="300" y="110" text-anchor="middle">encore et encore</text>`; break;
    case "now": g = wave(250, 370, y - 2) + `<text x="310" y="110" text-anchor="middle">en train de se passer</text>`; break;
    case "past-to-now": g = `<circle cx="150" cy="${y}" r="7" style="fill:var(--accent)"/>` + arrow(150, 318, y) + `<text x="230" y="110" text-anchor="middle">du passé jusqu’à maintenant</text>`; break;
    case "past-to-now-cont": g = wave(140, 310, y - 2) + `<text x="230" y="110" text-anchor="middle">ça dure depuis… et ça continue</text>`; break;
    case "point-past": g = cross(170, y, "yesterday") + `<text x="170" y="110" text-anchor="middle">terminé, daté</text>`; break;
    case "interrupted": g = wave(100, 240, y - 2) + cross(190, y, "", "var(--bad)") + `<text x="190" y="44" text-anchor="middle" style="fill:var(--ink);font-weight:700">BAM !</text><text x="170" y="110" text-anchor="middle">action longue interrompue</text>`; break;
    case "before-past": g = cross(110, y, "①") + flag(220, "② repère passé") + `<text x="165" y="110" text-anchor="middle">① avant ②</text>`; break;
    case "before-past-cont": g = wave(70, 210, y - 2) + flag(220, "repère passé") + `<text x="140" y="110" text-anchor="middle">durée avant le repère</text>`; break;
    case "point-future": g = cross(470, y, "tomorrow") + `<text x="470" y="110" text-anchor="middle">décision, promesse</text>`; break;
    case "future-ongoing": g = wave(410, 540, y - 2) + flag(470, "20 h demain") + `<text x="475" y="110" text-anchor="middle">en cours à ce moment-là</text>`; break;
    case "before-future": g = cross(420, y, "") + flag(520, "by Friday") + `<text x="470" y="110" text-anchor="middle">fini avant le repère</text>`; break;
    case "before-future-cont": g = wave(350, 510, y - 2) + flag(520, "by June") + `<text x="430" y="110" text-anchor="middle">durée jusqu’au repère</text>`; break;
  }
  return `<svg class="timeline" viewBox="0 0 620 124" role="img" aria-label="Frise du temps">
    <line x1="20" y1="${y}" x2="596" y2="${y}" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/><path d="M606 ${y} l-14 -8 v16 z" style="fill:var(--line)"/>
    <line x1="320" y1="40" x2="320" y2="98" stroke="var(--muted)" stroke-width="2"/><text x="320" y="122" text-anchor="middle" style="font-weight:700;fill:var(--ink)">maintenant</text>
    <text x="30" y="122">passé</text><text x="590" y="122" text-anchor="end">futur</text>${g}</svg>`;
};

/* ---------- Exercices (phrases à trous) ---------- */
E.checkAnswer = (given, expected) => {
  const opts = String(expected).split("/").map(x => x.trim());
  const g = E.S().strict ? given.trim().toLowerCase().replace(/[’]/g, "'") : E.norm(given);
  return opts.some(o => {
    const e = E.S().strict ? o.toLowerCase().replace(/[’]/g, "'") : E.norm(o);
    if (["-", "ø", ""].includes(e)) return ["", "-", "ø", "rien", "nothing"].includes(g);
    return g === e || g.replace(/'/g, "") === e.replace(/'/g, "");
  });
};
const exercises = (list, key) => {
  E.after(() => {
    const box = $(`#exo-${key}`); if (!box) return;
    const check = row => {
      const inp = $("input", row), fb = $(".fb", row), i = Number(row.dataset.i);
      if (!inp.value.trim() && !["-", "Ø"].some(x => list[i][1].includes(x))) return null;
      const ok = E.checkAnswer(inp.value, list[i][1]);
      inp.classList.toggle("ok", ok); inp.classList.toggle("ko", !ok);
      fb.innerHTML = ok ? `✅ Bravo ! <span class="muted">${esc(list[i][2] || "")}</span>` : `❌ Réponse : <b>${esc(list[i][1].split("/")[0] || "(rien)")}</b> <span class="muted">· ${esc(list[i][2] || "")}</span>`;
      return ok;
    };
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-check]");
      if (b) { const ok = check(b.closest(".exo-row")); if (ok !== null) { E.sfx(ok ? "ok" : "ko"); E.addXp(ok ? 8 : 1, ok ? "correct" : "wrong"); } }
      if (e.target.closest("[data-all]")) {
        let good = 0, done = 0;
        $$(".exo-row", box).forEach(r => { const ok = check(r); if (ok !== null) { done++; if (ok) good++; } });
        if (done) { E.addXp(good * 8, "correct"); E.sfx(good === done ? "win" : "tick"); E.toast(`${good} / ${done} bonnes réponses`); }
      }
      if (e.target.closest("[data-show]")) $$(".exo-row", box).forEach(r => { const i = Number(r.dataset.i); $(".fb", r).innerHTML = `💡 <b>${esc(list[i][1].split("/")[0] || "(rien)")}</b> <span class="muted">· ${esc(list[i][2] || "")}</span>`; });
    });
    box.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches("input")) { e.preventDefault(); $("[data-check]", e.target.closest(".exo-row")).click(); } });
  });
  return `<section class="card" id="exo-${key}"><div class="card-title"><h2>✍️ À toi de jouer</h2><span class="muted">${list.length} phrases · Entrée pour valider</span></div>
  <div class="exo">${list.map(([q], i) => `<div class="exo-row" data-i="${i}"><span>${esc(q).replace("___", "<b>_____</b>")}</span><input type="text" aria-label="Réponse ${i + 1}" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn small" type="button" data-check>Vérifier</button><div class="fb"></div></div>`).join("")}</div>
  <div class="row" style="margin-top:12px"><button class="btn primary" type="button" data-all>Tout corriger</button><button class="btn ghost" type="button" data-show>Voir les réponses</button></div></section>`;
};
const markLesson = id => {
  const L = E.state.lessons[id];
  if (!L || L.day !== E.today()) { E.state.lessons[id] = { day: E.today(), n: (L?.n || 0) + 1 }; E.addXp(15, "lessons"); }
};

/* ---------- Les 12 temps ---------- */
const TIMES = [["Passé", "past"], ["Présent", "present"], ["Futur", "future"]];
const ASPECTS = ["Simple", "Continu", "Parfait", "Parfait continu"];
E.route("temps", id => id ? tenseDetail(id) : hubTemps(), id => id ? (E.TENSE.get(id)?.fr || "Temps") : "Les 12 temps");
function hubTemps() {
  const cells = TIMES.map(([time, cls]) => `<div class="th">${time}</div>` + ASPECTS.map(asp => {
    const t = TENSES.find(x => x.time === time && x.aspect === asp);
    const seen = E.state.lessons[t.id];
    return `<a class="tense-cell ${cls}" href="#temps-${t.id}"><small>${t.level}${seen ? " · ✓ vu" : ""}</small><b>${esc(t.fr)}</b><small>${esc(t.en)}</small><code>${esc(t.form.aff.split("·")[0])}</code></a>`;
  }).join("")).join("");
  return `${E.head("Les temps de l’anglais", "Les 12 temps, enfin clairs ⏳", "3 moments (passé, présent, futur) × 4 aspects (simple, continu, parfait, parfait continu). Chaque case ouvre une fiche avec une frise, la construction, des exemples à écouter et des exercices.",
    `<div class="row"><a class="btn primary" href="#jeu-temps">🎯 Quiz des temps</a><a class="btn" href="#conjugueur">🧩 Conjugueur</a></div>`)}
  <div class="card" style="overflow-x:auto"><div class="tense-table"><div></div>${ASPECTS.map(a => `<div class="th col">${a}</div>`).join("")}${cells}</div></div>
  <div class="grid g3">
    <div class="callout accent"><b>🧱 Simple</b><span>Le fait brut : une habitude, un événement, une décision.</span></div>
    <div class="callout accent"><b>🎥 Continu (be + -ing)</b><span>L’action vue en plein déroulement, comme dans une vidéo.</span></div>
    <div class="callout accent"><b>🌉 Parfait (have + participe)</b><span>Un lien avec un moment de référence : avant, jusqu’à, déjà.</span></div>
  </div>
  <p class="muted" style="font-size:.88rem">📝 Note : les « 12 temps » sont une présentation pédagogique. En grammaire anglaise, seuls le présent et le prétérit sont des temps au sens strict ; le futur se construit avec <i>will</i>, <i>going to</i> ou le présent, et les aspects (continu, parfait) s’y ajoutent.</p>
  <section class="stack"><h2>Et aussi pour le futur et les hypothèses</h2><div class="grid auto-fill">
    ${["going-to", "present-future", "first-conditional", "second-conditional", "third-conditional", "wish", "used-to"].map(id => { const l = E.LESSON.get(id); return `<a class="lesson-link" href="#lecon-${id}"><span class="tag lvl" style="justify-self:start">${l.level}</span><b>${esc(l.name)}</b><small class="muted">${esc(l.lead)}</small></a>`; }).join("")}
  </div></section>`;
}
const COMMON_VERBS = ["work", "play", "go", "be", "have", "do", "eat", "see", "make", "take", "come", "write", "read", "speak", "live", "study", "travel", "stop", "swim", "run", "buy", "learn", "watch", "try"];
function tenseDetail(id) {
  const t = E.TENSE.get(id);
  if (!t) return `<div class="empty">Ce temps n’existe pas. <a class="btn" href="#temps">Les 12 temps</a></div>`;
  const i = TENSES.indexOf(t), prev = TENSES[i - 1], next = TENSES[i + 1];
  markLesson(t.id);
  E.after(() => {
    const draw = () => { $("#tconj").innerHTML = E.conjTable($("#tverb").value, t.id); };
    $("#tverb").addEventListener("input", draw); draw();
  });
  return `<div class="crumbs"><a href="#temps">Les 12 temps</a> › ${esc(t.time)} › ${esc(t.aspect)}</div>
  ${E.head(`${t.time} · ${t.aspect} · niveau ${t.level}`, esc(t.fr), `<b>${esc(t.en)}</b> — ${esc(t.lead)}`)}
  <section class="card">${E.timeline(t.timeline)}</section>
  <div class="grid g2">
    <section class="card"><h2 style="margin-bottom:10px">🧱 La construction</h2><table class="form-table"><tbody>
      <tr><th>✅ Affirmative</th><td>${esc(t.form.aff)}</td></tr><tr><th>❌ Négative</th><td>${esc(t.form.neg)}</td></tr><tr><th>❓ Question</th><td>${esc(t.form.q)}</td></tr></tbody></table>
      <div class="stack" style="margin-top:14px"><b>🔑 Mots-repères</b><div class="chips">${t.signals.map(s => `<button class="chip" type="button" data-say="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>
    </section>
    <section class="card stack"><h2>🎯 Quand l’utiliser ?</h2><ul class="list-clean">${t.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul>
      <div class="callout bad"><b>⚠️ Le piège</b><span>${esc(t.trap)}</span></div>
      <div class="callout"><b>💡 Pour retenir</b><span>${esc(t.memory)}</span></div></section>
  </div>
  <section class="card"><h2 style="margin-bottom:6px">🎧 Exemples à écouter</h2>${t.examples.map(([en, fr]) => `<div class="example">${E.sayBtn(en)}<span><b>${esc(en)}</b><i>${esc(fr)}</i></span></div>`).join("")}</section>
  <section class="card stack"><div class="card-title" style="margin:0"><h2>🧩 Conjugue un verbe à ce temps</h2>${E.select("tverb", COMMON_VERBS.map(v => [v, `to ${v}${E.IRR.has(v) ? " (irrégulier)" : ""}`]), "work", "")}</div><div id="tconj"></div></section>
  ${exercises(t.ex, t.id)}
  <div class="row between">${prev ? `<a class="btn ghost" href="#temps-${prev.id}">← ${esc(prev.fr)}</a>` : `<a class="btn ghost" href="#temps">← Tableau</a>`}<a class="btn primary" href="#jeu-temps">🎯 Quiz des temps</a>${next ? `<a class="btn ghost" href="#temps-${next.id}">${esc(next.fr)} →</a>` : `<a class="btn ghost" href="#grammaire">Grammaire →</a>`}</div>`;
}

/* ---------- Grammaire : autres leçons ---------- */
const LCATS = [...new Set(LESSONS.map(l => l.cat))];
E.route("grammaire", () => {
  const ui = E.state.ui;
  E.after(() => {
    const draw = () => {
      const c = $("#gc").value, lv = $("#gl").value; ui.gc = c; ui.gl = lv; E.save();
      const list = LESSONS.filter(l => (c === "all" || l.cat === c) && (lv === "all" || l.level === lv));
      const cats = LCATS.filter(x => list.some(l => l.cat === x));
      $("#glist").innerHTML = cats.map(x => `<section class="stack"><h2>${esc(x)}</h2><div class="grid auto-fill">${list.filter(l => l.cat === x).map(l => `<a class="lesson-link" href="#lecon-${l.id}"><div class="row between"><span class="tag lvl">${l.level}</span>${E.state.lessons[l.id] ? '<span class="seen">✓ étudiée</span>' : ""}</div><b>${esc(l.name)}</b><small class="muted">${esc(l.lead)}</small></a>`).join("")}</div></section>`).join("") || `<div class="empty">Aucune leçon pour ce filtre.</div>`;
    };
    $("#gc").addEventListener("input", draw); $("#gl").addEventListener("input", draw); draw();
  });
  return `${E.head("Grammaire", "Toutes les règles utiles 📐", `${LESSONS.length} leçons courtes, chacune avec ses exemples à écouter, son piège et ses exercices corrigés.`, `<a class="btn primary" href="#temps">⏳ Les 12 temps</a>`)}
  <div class="card toolbar">${E.select("gc", [["all", "Toutes les catégories"], ...LCATS.map(c => [c, c])], ui.gc || "all", "Catégorie")}${E.select("gl", [["all", "Tous les niveaux"], ...E.LEVELS.map(l => [l, `${l} · ${E.LEVEL_NAMES[l]}`])], ui.gl || "all", "Niveau")}</div>
  <div id="glist" class="stack" style="gap:20px"></div>`;
}, "Grammaire");
E.route("lecon", id => {
  const l = E.LESSON.get(id);
  if (!l) return `<div class="empty">Leçon introuvable. <a class="btn" href="#grammaire">Grammaire</a></div>`;
  markLesson(l.id);
  const i = LESSONS.indexOf(l), prev = LESSONS[i - 1], next = LESSONS[i + 1];
  return `<div class="crumbs"><a href="#grammaire">Grammaire</a> › ${esc(l.cat)}</div>
  ${E.head(`${l.cat} · niveau ${l.level}`, esc(l.name), esc(l.lead))}
  <section class="card"><span class="eyebrow">La formule</span><p class="mono" style="font-size:1.05rem;margin-top:6px">${esc(l.form)}</p></section>
  <div class="grid g2">
    <section class="card stack"><h2>🎯 Comment ça marche</h2><ul class="list-clean">${l.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul></section>
    <section class="card stack"><div class="callout bad"><b>⚠️ Le piège</b><span>${esc(l.trap)}</span></div><div class="callout"><b>💡 Pour retenir</b><span>${esc(l.memory)}</span></div></section>
  </div>
  <section class="card"><h2 style="margin-bottom:6px">🎧 Exemples</h2>${l.examples.map(([en, fr]) => `<div class="example">${E.sayBtn(en)}<span><b>${esc(en)}</b><i>${esc(fr)}</i></span></div>`).join("")}</section>
  ${exercises(l.ex, l.id)}
  <div class="row between">${prev ? `<a class="btn ghost" href="#lecon-${prev.id}">← ${esc(prev.name)}</a>` : "<span></span>"}${next ? `<a class="btn ghost" href="#lecon-${next.id}">${esc(next.name)} →</a>` : ""}</div>`;
}, id => E.LESSON.get(id)?.name || "Leçon");

/* ---------- Conjugueur ---------- */
E.route("conjugueur", () => {
  const ui = E.state.ui;
  E.after(() => {
    const draw = () => {
      const v = $("#cv").value, tn = $("#ct").value; ui.cv = v; ui.ct = tn; E.save();
      const head = v.trim().toLowerCase().replace(/^to\s+/, "").split(" ")[0];
      const irr = E.IRR.get(head);
      $("#cinfo").innerHTML = head ? (irr ? `🔁 <b>${esc(head)}</b> est irrégulier : ${esc(head)} – ${esc(irr.past)} – ${esc(irr.part)} (${esc(irr.fr)})` : `✅ <b>${esc(head)}</b> suit les règles des verbes réguliers : ${esc(E.regPast(head))}, ${esc(E.ing(head))}.`) : "";
      $("#cout").innerHTML = tn === "all" ? E.CONJ_TENSES.map(([id, name]) => `<section class="stack"><h3>${esc(name)}</h3>${E.conjTable(v, id)}</section>`).join("") : E.conjTable(v, tn);
    };
    $("#cv").addEventListener("input", draw); $("#ct").addEventListener("input", draw);
    $("#cquick").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (b) { $("#cv").value = b.dataset.v; draw(); } });
    draw();
  });
  return `${E.head("Conjugueur", "Un verbe, tous les temps 🧩", "Tape n’importe quel verbe anglais : réguliers, irréguliers (190 connus) et même les phrasal verbs comme give up.")}
  <div class="card stack">
    <div class="toolbar"><label class="field grow" for="cv">Verbe<input id="cv" type="text" value="${esc(ui.cv || "go")}" placeholder="ex. work, eat, give up" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
    ${E.select("ct", [["all", "Tous les temps"], ...E.CONJ_TENSES], ui.ct || "present-simple", "Temps")}</div>
    <div class="chips" id="cquick">${["be", "have", "do", "go", "work", "study", "stop", "swim", "eat", "give up", "travel", "lie"].map(v => `<button class="chip" type="button" data-v="${v}">${v}</button>`).join("")}</div>
    <p id="cinfo"></p>
  </div>
  <div id="cout" class="stack" style="gap:18px"></div>`;
}, "Conjugueur");

/* ---------- Verbes irréguliers ---------- */
E.route("verbes", () => {
  const ui = E.state.ui;
  const known = new Set(E.state.verbs);
  E.after(() => {
    const draw = () => {
      const q = E.norm($("#vbq").value), g = $("#vbg").value, show = $("#vbs").value, hide = $("#vbh").value;
      ui.vbg = g; ui.vbs = show; ui.vbh = hide; E.save();
      const course = g.startsWith("course:") ? new Set(window.COURSE_GROUPS.find(c => c.id === g.slice(7))?.verbs || []) : null;
      const list = window.IRREGULARS.filter(v => (g === "all" || (course ? course.has(v[0]) : v[4] === g)) && (!q || [v[0], v[1], v[2], v[3]].some(x => E.norm(x).includes(q))) &&
        (show === "all" || (show === "known") === known.has(v[0])));
      const mask = (txt, col) => (hide === col || hide === "both") && col !== "none" ? `<button class="chip" type="button" data-reveal="${esc(txt)}">👁 voir</button>` : esc(txt);
      $("#vbrows").innerHTML = list.map(v => `<tr class="${known.has(v[0]) ? "known" : ""}"><td class="en">${esc(v[0])}</td><td>${mask(v[1], "past")}</td><td>${mask(v[2], "part")}</td><td>${hide === "fr" ? `<button class="chip" type="button" data-reveal="${esc(v[3])}">👁 voir</button>` : esc(v[3])}</td>
        <td>${E.sayBtn(`${v[0]}, ${first(v[1])}, ${first(v[2])}`)}</td><td><button class="chip${known.has(v[0]) ? " on" : ""}" type="button" data-know="${esc(v[0])}">${known.has(v[0]) ? "✓ su" : "je sais"}</button></td></tr>`).join("") ||
        `<tr><td colspan="6" class="muted">Aucun verbe ne correspond.</td></tr>`;
      $("#vbcount").textContent = `${list.length} verbes affichés · ${known.size} / ${window.IRREGULARS.length} marqués comme sus`;
    };
    ["#vbq", "#vbg", "#vbs", "#vbh"].forEach(s => $(s).addEventListener("input", draw));
    $("#app > .view").addEventListener("click", e => {
      const cs = e.target.closest("[data-course-say]"), cq = e.target.closest("[data-course-quiz]"), cd = e.target.closest("[data-course-show]");
      const grp = id => window.COURSE_GROUPS.find(c => c.id === id);
      if (cs) { const c = grp(cs.dataset.courseSay); E.sayQueue(c.verbs.map(b => { const v = window.IRREGULARS.find(x => x[0] === b); return `${v[0]}, ${first(v[1])}, ${first(v[2])}`; })); }
      if (cq) { E.state.ui.vSource = "course:" + cq.dataset.courseQuiz; E.save(); E.go("jeu-verbes"); }
      if (cd) { $("#vbg").value = "course:" + cd.dataset.courseShow; draw(); $("#allVerbs").scrollIntoView({ behavior: "smooth" }); }
    });
    $("#vbrows").addEventListener("click", e => {
      const r = e.target.closest("[data-reveal]"); if (r) { r.outerHTML = esc(r.dataset.reveal); return; }
      const k = e.target.closest("[data-know]");
      if (k) { const v = k.dataset.know; if (known.has(v)) known.delete(v); else { known.add(v); E.addXp(2); } E.state.verbs = [...known]; E.save(); draw(); }
    });
    draw();
  });
  return `${E.head("Formes · sens · écoute", "Verbes irréguliers 🔁", `${window.IRREGULARS.length} verbes, classés par familles pour les retenir plus vite. Cache une colonne pour te tester, clique sur 🔊 pour entendre les trois formes.`,
    `<div class="row"><a class="btn primary" href="#jeu-verbes">🎯 Quiz verbes</a><a class="btn" href="#conjugueur">🧩 Conjugueur</a></div>`)}
  <section class="stack">
    <div class="row between"><h2>📌 La fiche du cours : 6 catégories</h2><span class="row"><button class="btn small ghost no-print" type="button" onclick="window.print()">🖨️ Imprimer</button><span class="muted">${window.COURSE_GROUPS.reduce((a, c) => a + c.verbs.length, 0)} verbes essentiels</span></span></div>
    <div class="grid auto-fill course-grid">${window.COURSE_GROUPS.map(c => {
      const rows = c.verbs.map(b => window.IRREGULARS.find(v => v[0] === b)).filter(Boolean);
      return `<article class="card course-card"><div class="row between"><h3>${c.emoji} ${esc(c.name)}</h3><span class="tag accent">${rows.length}</span></div>
        <p class="muted" style="font-size:.86rem">${esc(c.desc)}</p>
        <table class="mini"><thead><tr><th>Base</th><th>Prétérit</th><th>Participe</th></tr></thead><tbody>${rows.map(v => `<tr><td><b>${esc(v[0])}</b></td><td>${esc(v[1])}</td><td>${esc(v[2])}</td></tr>`).join("")}</tbody></table>
        <div class="row"><button class="btn small" type="button" data-course-say="${c.id}">🔊 Écouter</button><button class="btn small primary" type="button" data-course-quiz="${c.id}">🎯 Quiz</button><button class="btn small ghost" type="button" data-course-show="${c.id}">☰ Détail</button></div></article>`;
    }).join("")}</div>
  </section>
  <h2 id="allVerbs">Tous les verbes</h2>
  <div class="card toolbar">
    <label class="field grow" for="vbq">Chercher<input id="vbq" type="search" placeholder="ex. go, went, dormir…" autocomplete="off"></label>
    ${E.select("vbg", [["all", "Tous les verbes"], ...window.COURSE_GROUPS.map(c => ["course:" + c.id, `📌 Fiche : ${c.name}`]), ...Object.entries(window.VERB_GROUPS)], ui.vbg || "all", "Catégorie")}
    ${E.select("vbs", [["all", "Tous"], ["todo", "À apprendre"], ["known", "Déjà sus"]], ui.vbs || "all", "Afficher")}
    ${E.select("vbh", [["none", "Tout montrer"], ["past", "Cacher le prétérit"], ["part", "Cacher le participe"], ["both", "Cacher les deux"], ["fr", "Cacher le sens"]], ui.vbh || "none", "Mode test")}
  </div>
  <div class="table-wrap"><table class="data"><thead><tr><th>Base</th><th>Prétérit</th><th>Participe passé</th><th>Sens</th><th>🔊</th><th>Su ?</th></tr></thead><tbody id="vbrows"></tbody></table></div>
  <p class="muted" id="vbcount"></p>
  <div class="grid g3">
    <div class="callout"><b>🗣️ Astuce de prononciation</b><span>read – read – read s’écrit pareil, mais se prononce /riːd/ – /red/ – /red/.</span></div>
    <div class="callout"><b>🇬🇧 / 🇺🇸 Deux formes ?</b><span>learnt, dreamt, smelt sont britanniques ; learned, dreamed, smelled sont américains. Les deux sont justes.</span></div>
    <div class="callout"><b>🎵 i – a – u</b><span>sing – sang – sung · drink – drank – drunk · swim – swam – swum</span></div>
    <div class="callout"><b>🛍️ -ought / -aught</b><span>buy – bought · think – thought · teach – taught · catch – caught</span></div>
    <div class="callout"><b>✂️ Trois fois pareil</b><span>cut – cut – cut · put – put – put · let – let – let</span></div>
  </div>`;
}, "Verbes irréguliers");
})();
