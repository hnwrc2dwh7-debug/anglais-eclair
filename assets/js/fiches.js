/* Anglais Éclair — fiches d'exercices générées (des milliers), mode tableau, espace enseignant. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;

/* ---------- Hasard reproductible : la fiche n° X donne toujours les mêmes phrases ---------- */
const hashStr = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rngFor = seed => { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const pickR = (r, arr) => arr[Math.floor(r() * arr.length)];
const shuffleR = (r, arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- Données ---------- */
const FRAMES = window.SENTENCE_FRAMES.trim().split("\n").map(l => {
  const [verb, comp, opts = ""] = l.split("|");
  const subj = (opts.match(/@(.+)$/) || [])[1];
  const fl = opts.replace(/@.+$/, "").split(/\s+/);
  return { verb: verb.trim(), comp: (comp || "").trim(), stative: fl.includes("s"), durative: fl.includes("d"), once: fl.includes("o"), result: fl.includes("r"), subj };
});
const RAW = new Map(window.IRREGULARS.map(v => [v[0], v]));
const forms = s => String(s).split("/").map(x => x.trim()).filter(Boolean);
const SUBJECTS = [["I", 0], ["You", 1], ["He", 2], ["She", 2], ["We", 3], ["They", 5], ["Tom", 2], ["Anna", 2], ["My parents", 5], ["The children", 5], ["My best friend", 2], ["Our teacher", 2]];
const PRON = ["I", "you", "she", "we", "you", "they"];
const TENSE_NAME = Object.fromEntries(E.CONJ_TENSES.map(([id, n]) => [id, n.split(" · ")[0]]));
TENSE_NAME["going-to"] = "Futur proche (going to)";

/* Variantes acceptées : formes longues et contractées. */
const CONTR = [["do not", "don't"], ["does not", "doesn't"], ["did not", "didn't"], ["is not", "isn't"], ["are not", "aren't"], ["was not", "wasn't"], ["were not", "weren't"], ["have not", "haven't"], ["has not", "hasn't"], ["had not", "hadn't"], ["will not", "won't"], ["would not", "wouldn't"], ["cannot", "can't"]];
const variants = txt => {
  const out = new Set([txt]);
  CONTR.forEach(([l, s]) => { if (txt.includes(l)) out.add(txt.replace(l, s)); if (txt.includes(s)) out.add(txt.replace(s, l)); });
  return [...out];
};
const contracted = txt => CONTR.reduce((t, [l, s]) => t.replace(l, s), txt);
const cap = s => s[0].toUpperCase() + s.slice(1);
const midSubj = s => /^(I|Tom|Anna)$/.test(s) ? s : s[0].toLowerCase() + s.slice(1);

/* Construit une phrase conjuguée (sujet, groupe verbal, complément, repère de temps). */
const conj = (frame, tense, person) => {
  const rows = E.conjugate(frame.verb, tense);
  return rows ? rows[person] : null;
};
const vpOf = (form, person) => form.slice(PRON[person].length + 1);
const insertAdverb = (vp, adv) => { const i = vp.indexOf(" "); return i < 0 ? vp : `${vp.slice(0, i)} ${adv} ${vp.slice(i + 1)}`; };
const buildSentence = (r, frame, tense, negative) => {
  const [subj, person] = frame.subj ? [frame.subj, 2] : pickR(r, SUBJECTS);
  const row = conj(frame, tense, person);
  if (!row) return null;
  let vp = vpOf(negative ? row.n : row.a, person);
  let adv = "", end = "", start = "";
  const markers = window.TIME_MARKERS[tense] || [""];
  let m = pickR(r, markers);
  if (tense === "present-perfect") {
    if (negative) end = "yet";
    else adv = perfectAdverb(r, frame);
  } else if (tense === "past-perfect") {
    const [a, e] = m.split("|"); end = e;
    if (!negative) adv = a;
  } else if (tense === "future-continuous") { start = m; }
  else if (!(tense === "present-simple" && frame.stative)) end = m;
  if (adv) vp = insertAdverb(vp, adv);
  const tail = [frame.comp, end].filter(Boolean).join(" ");
  const subjTxt = start ? `${cap(start)}, ${midSubj(subj)}` : subj;
  const hintVerb = `${negative ? "not / " : ""}${tense === "going-to" ? "going to / " : ""}${adv ? adv + " / " : ""}${frame.verb}`;
  return {
    q: `${subjTxt} ___ (${hintVerb})${tail ? " " + tail : ""}.`,
    answers: variants(vp), show: negative ? contracted(vp) : vp,
    full: `${subjTxt} ${vp}${tail ? " " + tail : ""}.`, tense, key: `${frame.verb}|${frame.comp}|${subj}|${tense}|${negative}`
  };
};
/* Règles de sens : chaque temps ne reçoit que des phrases naturelles. */
const perfectAdverb = (r, f) => (f.result || f.once) ? pickR(r, f.stative ? ["never"] : ["just", "already", "never"]) : "never";
const okFor = (frame, tense, negative) => {
  const f = frame;
  if (f.verb === "be" && /perfect/.test(tense)) return false;
  if (tense === "present-simple") return !f.once;
  if (tense === "present-continuous") return !f.stative && !f.once;
  if (/continuous/.test(tense)) return f.durative && !f.stative;
  if (tense === "present-perfect") return negative ? f.result : !f.stative;
  if (tense === "past-perfect") return (f.result || f.once) && !f.stative;
  if (tense === "future-perfect") return f.result;
  return true;
};

/* ---------- Types de fiches ---------- */
const COURSE_OPTS = () => [["courants", "Tous les verbes courants"], ["fiche", "📌 Les 62 verbes de la fiche"], ...window.COURSE_GROUPS.map(c => [c.id, `📌 ${c.name}`]), ["composes", "Verbes composés"]];
const verbPool = opt => {
  if (opt === "fiche") return new Set(window.COURSE_GROUPS.flatMap(c => c.verbs));
  const g = window.COURSE_GROUPS.find(c => c.id === opt); if (g) return new Set(g.verbs);
  if (opt === "composes") return new Set(window.IRREGULARS.filter(v => v[4] === "compose").map(v => v[0]));
  return new Set(window.IRREGULARS.filter(v => v[4] !== "rare").map(v => v[0]));
};
const TENSE_OPTS = [...E.CONJ_TENSES.filter(([id]) => !["would", "would-have", "used-to"].includes(id)).map(([id, n]) => [id, n])];
const MIX_SETS = { debutant: ["present-simple", "present-continuous", "past-simple", "future-simple"], intermediaire: ["present-simple", "present-continuous", "past-simple", "past-continuous", "present-perfect", "future-simple", "going-to"], avance: ["present-simple", "present-continuous", "past-simple", "past-continuous", "present-perfect", "present-perfect-continuous", "past-perfect", "future-simple", "future-continuous", "future-perfect"] };

const uniqueItems = (r, n, make, tries = 400) => {
  const out = [], seen = new Set();
  for (let i = 0; out.length < n && i < tries; i++) { const it = make(); if (it && !seen.has(it.key)) { seen.add(it.key); out.push(it); } }
  return out;
};

E.FICHES = [
  { id: "preterit", emoji: "⏪", name: "Prétérit des verbes irréguliers", desc: "Compléter des phrases au passé : went, saw, bought…", instr: "Conjugue le verbe entre parenthèses au prétérit (past simple).", opts: COURSE_OPTS, def: "fiche",
    make: (r, n, opt) => { const pool = verbPool(opt); const fr = FRAMES.filter(f => pool.has(f.verb)); const src = fr.length ? fr : FRAMES.filter(f => RAW.has(f.verb));
      return uniqueItems(r, n, () => { const f = pickR(r, src); const it = buildSentence(r, f, "past-simple", false); if (it) { const raw = RAW.get(f.verb); if (raw && !f.subj && f.verb !== "be") it.answers = [...new Set([...it.answers, ...forms(raw[1])])]; } return it; }); } },
  { id: "participe", emoji: "✅", name: "Participe passé (present perfect)", desc: "has gone, have eaten, has written… dans des phrases.", instr: "Complète avec le participe passé du verbe : l’auxiliaire have / has est déjà là.", opts: COURSE_OPTS, def: "fiche",
    make: (r, n, opt) => { const pool = verbPool(opt); const src = FRAMES.filter(f => pool.has(f.verb) && f.verb !== "be" && !f.stative); const list = src.length ? src : FRAMES.filter(f => RAW.has(f.verb) && f.verb !== "be" && !f.stative);
      return uniqueItems(r, n, () => {
        const f = pickR(r, list); const [subj, person] = f.subj ? [f.subj, 2] : pickR(r, SUBJECTS);
        const aux = person === 2 ? "has" : "have", adv = perfectAdverb(r, f);
        const raw = RAW.get(f.verb), part = raw ? forms(raw[2]) : [E.regPast(f.verb)];
        const pre = `${subj} ${aux}${adv ? " " + adv : ""}`;
        return { q: `${pre} ___ (${f.verb})${f.comp ? " " + f.comp : ""}.`, answers: part, show: part[0], full: `${pre} ${part[0]}${f.comp ? " " + f.comp : ""}.`, key: f.verb + f.comp + subj };
      }); } },
  { id: "temps", emoji: "⏳", name: "Conjuguer à un temps donné", desc: "Choisis un temps : phrases affirmatives et négatives.", instr: "Conjugue le verbe au temps indiqué. « not » = forme négative.", opts: () => TENSE_OPTS, def: "present-simple",
    make: (r, n, opt) => uniqueItems(r, n, () => { const neg = r() < 0.3; const pool = FRAMES.filter(x => okFor(x, opt, neg)); return pool.length ? buildSentence(r, pickR(r, pool), opt, neg) : null; }) },
  { id: "melange", emoji: "🔀", name: "Quel temps choisir ?", desc: "Les repères (yesterday, now, every day…) indiquent le temps.", instr: "Lis bien les repères de temps (yesterday, now, already…) et conjugue le verbe au bon temps.", opts: () => [["debutant", "Débutant (4 temps)"], ["intermediaire", "Intermédiaire (7 temps)"], ["avance", "Avancé (10 temps)"]], def: "intermediaire",
    make: (r, n, opt) => uniqueItems(r, n, () => { const t = pickR(r, MIX_SETS[opt] || MIX_SETS.intermediaire); const neg = r() < 0.2; const pool = FRAMES.filter(x => okFor(x, t, neg)); if (!pool.length) return null; const it = buildSentence(r, pickR(r, pool), t, neg); if (it) it.note = TENSE_NAME[t]; return it; }) },
  { id: "transfo", emoji: "🔁", name: "Forme négative & question", desc: "Transformer une phrase à la forme négative ou interrogative.", instr: "Réécris la phrase à la forme demandée (négative ou question).", opts: () => [["tous", "Présent, prétérit, be + -ing, will"], ["present-simple", "Présent simple"], ["past-simple", "Prétérit"], ["present-continuous", "Présent continu"], ["future-simple", "Futur (will)"]], def: "tous",
    make: (r, n, opt) => uniqueItems(r, n, () => {
      const t = opt === "tous" ? pickR(r, ["present-simple", "past-simple", "present-continuous", "future-simple"]) : opt;
      const f = pickR(r, FRAMES.filter(x => okFor(x, t, false))); const [subj, person] = f.subj ? [f.subj, 2] : pickR(r, SUBJECTS);
      const row = conj(f, t, person); if (!row) return null;
      const end = pickR(r, window.TIME_MARKERS[t]); const tail = [f.comp, end].filter(Boolean).join(" ");
      const aff = `${subj} ${vpOf(row.a, person)}${tail ? " " + tail : ""}.`;
      const neg = r() < 0.5;
      let ans;
      if (neg) ans = `${subj} ${vpOf(row.n, person)}${tail ? " " + tail : ""}`;
      else { const q = row.q.replace(new RegExp(`\\b${PRON[person]}\\b`), midSubj(subj)); ans = q.replace(/\?$/, `${tail ? " " + tail : ""}?`); ans = cap(ans); }
      return { q: aff, line: true, task: neg ? "→ forme négative" : "→ question", answers: variants(ans.replace(/[?.]$/, "")).map(x => x), show: neg ? contracted(ans) + "." : ans, full: neg ? contracted(ans) + "." : ans, key: aff + neg };
    }) },
  { id: "tableau", emoji: "🔤", name: "Tableau des verbes irréguliers", desc: "Compléter base, prétérit et participe passé.", instr: "Complète le tableau : base verbale, prétérit, participe passé.", opts: COURSE_OPTS, def: "fiche",
    make: (r, n, opt) => { const pool = [...verbPool(opt)].filter(v => RAW.has(v)); return shuffleR(r, pool).slice(0, n).map(v => {
      const raw = RAW.get(v); const hideBase = r() < 0.2; const hide = hideBase ? [0, pickR(r, [1, 2])] : r() < 0.5 ? [1, 2] : [pickR(r, [1, 2])];
      return { table: true, raw, hide, key: v, answers: hide.map(i => forms(raw[i])), full: `${raw[0]} – ${raw[1]} – ${raw[2]} (${raw[3]})` };
    }); } },
  { id: "vocabulaire", emoji: "🧠", name: "Vocabulaire en contexte", desc: "Retrouver le mot anglais dans une phrase, avec un indice.", instr: "Complète chaque phrase avec le mot anglais qui correspond à l’indice.", opts: () => [["niveau", "Mon niveau"], ...E.LEVELS.map(l => ["lvl:" + l, `Niveau ${l}`]), ...E.THEMES.map(t => [t.id, `${t.emoji} ${t.name}`])], def: "niveau",
    make: (r, n, opt) => {
      const pool = opt === "niveau" ? E.wordsForLevel() : opt.startsWith("lvl:") ? E.WORDS.filter(w => w.level === opt.slice(4)) : (E.THEME.get(opt)?.words || E.WORDS);
      const items = [];
      for (const w of shuffleR(r, pool)) {
        if (items.length >= n) break;
        const forms2 = w.en.split(" / ").map(x => x.replace(/\s*\(.*?\)/g, "").replace(/^(to|a|an|the)\s+/i, "").trim()).filter(x => x.length > 1);
        for (const f of forms2) {
          const re = new RegExp(`\\b(${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\w{0,3})\\b`, "i"); const m = w.ex.match(re);
          if (m) { items.push({ q: w.ex.replace(m[0], "___") + ` (${w.fr.split(" / ")[0]})`, img: E.img(w), answers: [m[0]], show: m[0], full: w.ex, key: w.id }); break; }
        }
      }
      return items;
    } },
  { id: "grammaire", emoji: "📐", name: "Grammaire : exercices des leçons", desc: "Les exercices des 12 temps et des leçons, mélangés ou par leçon.", instr: "Complète chaque phrase (verbe entre parenthèses ou mot manquant).", opts: () => [["tout", "Toutes les leçons"], ...window.TENSES.map(t => [t.id, `⏳ ${t.fr}`]), ...window.LESSONS.map(l => [l.id, `📐 ${l.name}`])], def: "tout",
    make: (r, n, opt) => {
      const src = opt === "tout" ? [...window.TENSES, ...window.LESSONS] : [...window.TENSES, ...window.LESSONS].filter(t => t.id === opt);
      const all = src.flatMap(t => t.ex.map(e => ({ t, e })));
      return shuffleR(r, all).slice(0, n).map(({ t, e }) => {
        const ans = e[1].split("/").map(x => x.trim());
        const show = ans[0] && !["-", "Ø"].includes(ans[0]) ? ans[0] : "(rien)";
        return { q: e[0], answers: ans, show, full: e[0].replace("___", show === "(rien)" ? "" : show).replace(/\s+/g, " "), note: t.fr || t.name, hint: e[2], key: e[0] };
      });
    } }
];
E.FICHE = new Map(E.FICHES.map(f => [f.id, f]));
E.makeFiche = (type, opt, n, seed) => {
  const f = E.FICHE.get(type); if (!f) return null;
  const r = rngFor(seed * 7919 + hashStr(type + "|" + opt));
  return { f, opt, n, seed, items: f.make(r, n, opt) };
};

/* ---------- Correction ---------- */
const checkOne = (given, answers) => answers.some(a => E.checkAnswer(given, String(a).replace(/\//g, " ")));

/* ---------- Mode tableau (projection) ---------- */
E.openBoard = (title, items) => {
  if (!items.length) return;
  let i = 0, shown = false, all = false;
  const el = document.createElement("div");
  el.className = "board"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Mode tableau");
  const blankHtml = (it, reveal) => {
    if (it.table) {
      const cells = [0, 1, 2].map(k => it.hide.includes(k) ? (reveal ? `<b class="chalk-ans">${esc(it.raw[k])}</b>` : `<span class="chalk-blank">______</span>`) : esc(it.raw[k]));
      return `${cells.join(" – ")} <small>(${esc(it.raw[3])})</small>`;
    }
    if (it.line) return `${esc(it.q)}<br><small>${esc(it.task)}</small>${reveal ? `<br><b class="chalk-ans">${esc(it.show)}</b>` : ""}`;
    const [a, b = ""] = esc(it.q).split("___");
    return `${a}${reveal ? `<b class="chalk-ans">${esc(it.show)}</b>` : `<span class="chalk-blank">______</span>`}${b}`;
  };
  const draw = () => {
    const it = items[i];
    el.innerHTML = `<div class="board-top"><b>${esc(title)}</b><span>${all ? `${items.length} phrases` : `${i + 1} / ${items.length}`}</span>
      <span class="board-actions"><button type="button" data-b="list">${all ? "▶ Une par une" : "📋 Toute la fiche"}</button><button type="button" data-b="full">⛶ Plein écran</button><button type="button" data-b="close">✕ Quitter</button></span></div>
      ${all ? `<ol class="board-list">${items.map(x => `<li>${blankHtml(x, shown)}</li>`).join("")}</ol>`
        : `<div class="board-main">${it.img ? `<div class="board-img">${it.img}</div>` : ""}${it.note ? `<div class="board-note">${esc(it.note)}</div>` : ""}<div class="board-q">${blankHtml(it, shown)}</div></div>`}
      <div class="board-bottom">${all ? "" : `<button type="button" data-b="prev" ${i === 0 ? "disabled" : ""}>◀ Précédente</button>`}
        <button type="button" data-b="show" class="board-reveal">${shown ? "🙈 Cacher" : all ? "👁 Afficher le corrigé" : "👁 Réponse"}</button>
        ${shown && !all && it.full ? `<button type="button" data-b="say">🔊 Écouter</button>` : ""}
        ${all ? "" : `<button type="button" data-b="next" ${i === items.length - 1 ? "disabled" : ""}>Suivante ▶</button>`}</div>
      <p class="board-help">Espace : réponse · ← → : phrase précédente / suivante · Échap : quitter</p>`;
  };
  const close = () => { document.removeEventListener("keydown", key); el.remove(); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  const go = d => { const n2 = i + d; if (n2 >= 0 && n2 < items.length) { i = n2; shown = false; draw(); } };
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-b]")?.dataset.b; if (!b) return;
    if (b === "close") close();
    if (b === "next") go(1);
    if (b === "prev") go(-1);
    if (b === "show") { shown = !shown; draw(); }
    if (b === "list") { all = !all; shown = false; draw(); }
    if (b === "say") E.say(items[i].full);
    if (b === "full") { try { document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen(); } catch { E.toast("Plein écran indisponible ici : utilise F11."); } }
  });
  const key = e => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); shown = !shown; draw(); }
  };
  document.addEventListener("keydown", key);
  E.onLeave(close);
  document.body.appendChild(el); draw();
};

/* ---------- Impression ---------- */
const printFiche = (fx, withKey) => {
  const area = document.createElement("div"); area.id = "printArea";
  const rows = fx.items.map((it, k) => {
    if (it.table) return `<tr><td>${k + 1}</td>${[0, 1, 2].map(c => `<td>${it.hide.includes(c) ? (withKey ? `<b>${esc(it.raw[c])}</b>` : "") : esc(it.raw[c])}</td>`).join("")}<td>${esc(it.raw[3])}</td></tr>`;
    if (it.line) return `<li>${esc(it.q)} <i>${esc(it.task)}</i><br>${withKey ? `<b>${esc(it.show)}</b>` : "<span class='pline'></span>"}</li>`;
    const [a, b = ""] = esc(it.q).split("___");
    return `<li>${a}${withKey ? `<b>${esc(it.show)}</b>` : "<span class='pblank'></span>"}${b}</li>`;
  });
  const isTable = fx.items[0]?.table;
  area.innerHTML = `<h1>${withKey ? "Corrigé — " : ""}${esc(fx.f.name)}</h1><p>Fiche n° ${fx.seed} · ${fx.items.length} questions · Anglais Éclair</p>
    ${withKey ? "" : `<p>Nom : ____________________ &nbsp; Classe : ________ &nbsp; Date : __________</p>`}<p><b>Consigne :</b> ${esc(fx.f.instr)}</p>
    ${isTable ? `<table><thead><tr><th>#</th><th>Base verbale</th><th>Prétérit</th><th>Participe passé</th><th>Sens</th></tr></thead><tbody>${rows.join("")}</tbody></table>` : `<ol>${rows.join("")}</ol>`}`;
  document.body.appendChild(area); document.body.classList.add("printing");
  const done = () => { area.remove(); document.body.classList.remove("printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  try { window.print(); } catch {}
  setTimeout(() => { if (!window.matchMedia("print").matches) done(); }, 1500);
};

/* ---------- Pages ---------- */
const prof = () => E.S().mode === "prof";
E.route("fiches", () => {
  const ui = E.state.ui;
  E.after(() => {
    $("#ftype").addEventListener("input", e => { ui.ftype = e.target.value; ui.fopt = ""; E.save(); E.rerender(); });
    $("#fopt").addEventListener("input", e => { ui.fopt = e.target.value; E.save(); });
    $("#fcount").addEventListener("input", e => { ui.fcount = Number(e.target.value); E.save(); });
    const open = seed => { const f = E.FICHE.get($("#ftype").value); E.go(`fiche-${f.id}-${$("#fopt").value}-${$("#fcount").value}-${seed}`); };
    $("#fgo").addEventListener("click", () => open(Math.max(1, Math.min(9999, Number($("#fseed").value) || 1))));
    $("#frand").addEventListener("click", () => open(1 + Math.floor(Math.random() * 9999)));
    $("#fseed").addEventListener("keydown", e => { if (e.key === "Enter") $("#fgo").click(); });
    $$("[data-quick]").forEach(b => b.addEventListener("click", () => { const f = E.FICHE.get(b.dataset.quick); E.go(`fiche-${f.id}-${f.def}-10-${1 + Math.floor(Math.random() * 9999)}`); }));
  });
  const type = E.FICHE.get(ui.ftype) || E.FICHES[0];
  const opts = type.opts();
  return `${E.head(prof() ? "Pour la classe" : "S’entraîner à l’écrit", "Fiches d’exercices 📝", `Des phrases à compléter, puis la correction. ${E.FICHES.length} types de fiches et 9 999 numéros par type : la fiche n° 1234 redonne toujours les mêmes phrases, pratique pour travailler à plusieurs.`)}
  <section class="card stack"><h2>🛠️ Créer une fiche</h2>
    <div class="grid g4">
      ${E.select("ftype", E.FICHES.map(f => [f.id, `${f.emoji} ${f.name}`]), type.id, "Type d’exercice")}
      ${E.select("fopt", opts, ui.fopt && opts.some(o => o[0] === ui.fopt) ? ui.fopt : type.def, "Choix")}
      ${E.select("fcount", [5, 8, 10, 12, 15, 20, 25, 30].map(n => [n, `${n} questions`]), ui.fcount || 10, "Longueur")}
      <label class="field" for="fseed">Numéro de fiche <small>de 1 à 9 999</small><input id="fseed" type="number" min="1" max="9999" value="${ui.fseed || 1}" inputmode="numeric"></label>
    </div>
    <div class="row"><button class="btn primary" type="button" id="fgo">📄 Ouvrir cette fiche</button><button class="btn spark" type="button" id="frand">🎲 Une fiche au hasard</button></div>
  </section>
  <section class="stack"><h2>Ou en un clic</h2><div class="grid auto-fill">
    ${E.FICHES.map(f => `<button class="game-card" type="button" data-quick="${f.id}"><span class="g-emoji">${f.emoji}</span><b>${esc(f.name)}</b><small>${esc(f.desc)}</small><span class="best">Fiche au hasard →</span></button>`).join("")}
  </div></section>`;
}, "Fiches d’exercices");

E.route("fiche", param => {
  const parts = param.split("-");
  const seed = Number(parts.pop()), n = Number(parts.pop());
  const type = parts.shift(), opt = parts.join("-");
  const fx = E.FICHE.has(type) ? E.makeFiche(type, opt, Math.max(1, Math.min(30, n || 10)), Math.max(1, Math.min(9999, seed || 1))) : null;
  if (!fx || !fx.items.length) return `<div class="empty"><span class="e-emoji">🤷</span>Cette fiche n’existe pas ou ne contient aucune phrase. <a class="btn" href="#fiches">Retour aux fiches</a></div>`;
  E.state.ui.fseed = fx.seed; E.save();
  const optName = (fx.f.opts().find(o => o[0] === opt) || [, ""])[1];
  const key = `fiche:${type}:${opt}`;
  const showKey = prof() && E.state.ui.profKey;
  E.after(() => {
    const view = $("#app > .view");
    const rowsEl = $$(".sheet-item", view);
    const correct = () => {
      let good = 0, total = 0;
      rowsEl.forEach(row => {
        const it = fx.items[Number(row.dataset.i)];
        $$("input", row).forEach((inp, k) => {
          total++;
          const answers = it.table ? it.answers[k] : it.answers;
          const ok = checkOne(inp.value, answers);
          if (ok) good++;
          inp.classList.toggle("ok", ok); inp.classList.toggle("ko", !ok);
        });
        const fb = $(".sheet-fb", row);
        const allOk = $$("input", row).every(x => x.classList.contains("ok"));
        fb.innerHTML = allOk ? "✅" : `❌ <b>${esc(it.table ? it.hide.map(h => it.raw[h]).join(" / ") : it.show)}</b>${it.hint ? ` <span class="muted">· ${esc(it.hint)}</span>` : ""}`;
      });
      const pct = Math.round(good / total * 100);
      $("#sheetScore").innerHTML = `<div class="feedback ${pct >= 50 ? "ok" : "ko"}"><b>${good} / ${total}</b> bonnes réponses (${pct} %). ${pct === 100 ? "Parfait ! 🌟" : pct >= 70 ? "Très bien ! 👏" : "Regarde les corrections en rouge, puis réessaie. 💪"}</div>`;
      E.addXp(good * 5, "games"); E.sfx(pct >= 70 ? "win" : "tick");
      if (pct === 100) E.burst();
      const best = E.state.best[key]; if (best === undefined || pct > best) { E.state.best[key] = pct; E.save(); }
    };
    const fillKey = on => rowsEl.forEach(row => {
      const it = fx.items[Number(row.dataset.i)];
      $$("input", row).forEach((inp, k) => { inp.value = on ? (it.table ? forms(it.raw[it.hide[k]])[0] : it.show) : ""; inp.classList.remove("ok", "ko"); });
      $(".sheet-fb", row).innerHTML = "";
    });
    view.addEventListener("click", e => {
      const b = e.target.closest("[data-act]")?.dataset.act; if (!b) return;
      if (b === "check") correct();
      if (b === "key") { const on = e.target.closest("[data-act]").dataset.on !== "1"; fillKey(on); e.target.closest("[data-act]").dataset.on = on ? "1" : ""; e.target.closest("[data-act]").textContent = on ? "🙈 Cacher le corrigé" : "👁 Afficher le corrigé"; $("#sheetScore").innerHTML = ""; }
      if (b === "reset") { fillKey(false); $("#sheetScore").innerHTML = ""; }
      if (b === "board") E.openBoard(`${fx.f.name} · n° ${fx.seed}`, fx.items);
      if (b === "print") printFiche(fx, false);
      if (b === "printkey") printFiche(fx, true);
      if (b === "next") E.go(`fiche-${type}-${opt}-${fx.items.length}-${fx.seed % 9999 + 1}`);
      if (b === "rand") E.go(`fiche-${type}-${opt}-${fx.items.length}-${1 + Math.floor(Math.random() * 9999)}`);
    });
    view.addEventListener("keydown", e => {
      if (e.key !== "Enter" || !e.target.matches(".sheet-item input")) return;
      e.preventDefault(); const ins = $$(".sheet-item input", view); const k = ins.indexOf(e.target); (ins[k + 1] || $("[data-act=check]", view)).focus();
    });
    if (showKey) fillKey(true);
  });
  const isTable = fx.items[0].table;
  const inp = (w, k) => `<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Réponse ${k}" style="width:${Math.max(6, Math.min(26, w + 2))}ch">`;
  const items = isTable
    ? `<div class="table-wrap"><table class="data sheet-table"><thead><tr><th>#</th><th>Base verbale</th><th>Prétérit</th><th>Participe passé</th><th>Sens</th><th></th></tr></thead><tbody>
        ${fx.items.map((it, k) => `<tr class="sheet-item" data-i="${k}"><td>${k + 1}</td>${[0, 1, 2].map(c => `<td>${it.hide.includes(c) ? inp(forms(it.raw[c])[0].length, k + 1) : `<b>${esc(it.raw[c])}</b>`}</td>`).join("")}<td class="muted">${esc(it.raw[3])}</td><td class="sheet-fb"></td></tr>`).join("")}</tbody></table></div>`
    : `<ol class="sheet">${fx.items.map((it, k) => {
        const [a, b = ""] = esc(it.q).split("___");
        const body = it.line ? `<span>${esc(it.q)} <i class="muted">${esc(it.task)}</i></span><br><input type="text" class="line-input" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Réponse ${k + 1}">`
          : `<span>${a}</span>${inp(it.show.length, k + 1)}<span>${b}</span>`;
        return `<li class="sheet-item" data-i="${k}">${it.img ? `<span class="sheet-img">${it.img}</span>` : ""}${it.note && prof() ? `<span class="tag">${esc(it.note)}</span> ` : ""}${body}<div class="sheet-fb"></div></li>`;
      }).join("")}</ol>`;
  return `<div class="crumbs"><a href="#fiches">Fiches d’exercices</a> › ${esc(fx.f.name)}</div>
  ${E.head(`Fiche n° ${fx.seed} · ${fx.items.length} questions${optName ? " · " + esc(optName) : ""}`, `${fx.f.emoji} ${esc(fx.f.name)}`, `<b>Consigne :</b> ${esc(fx.f.instr)}`,
    `<div class="row"><button class="btn spark" type="button" data-act="board">🧑‍🏫 Mode tableau</button><button class="btn ghost" type="button" data-act="next">Fiche suivante →</button></div>`)}
  <section class="card">${items}</section>
  <div id="sheetScore"></div>
  <div class="row">
    <button class="btn primary big" type="button" data-act="check">✅ Corriger ma fiche</button>
    <button class="btn" type="button" data-act="key">${showKey ? "🙈 Cacher le corrigé" : "👁 Afficher le corrigé"}</button>
    <button class="btn ghost" type="button" data-act="reset">↺ Effacer</button>
    <button class="btn ghost" type="button" data-act="rand">🎲 Autre fiche</button>
  </div>
  <div class="row"><button class="btn small ghost" type="button" data-act="print">🖨️ Imprimer la fiche</button><button class="btn small ghost" type="button" data-act="printkey">🖨️ Imprimer le corrigé</button>
    <span class="muted" style="font-size:.85rem">Astuce : note le numéro (${fx.seed}) pour retrouver exactement cette fiche.</span></div>`;
}, () => "Fiche d’exercices");

/* ---------- Espace enseignant (accueil en mode prof) ---------- */
E.teacherHome = () => {
  E.after(() => {
    $$("[data-tq]").forEach(b => b.addEventListener("click", () => { const f = E.FICHE.get(b.dataset.tq); const fx = E.makeFiche(f.id, f.def, 10, 1 + Math.floor(Math.random() * 9999)); E.openBoard(`${f.name} · n° ${fx.seed}`, fx.items); }));
    $("#profKey")?.addEventListener("input", e => { E.state.ui.profKey = e.target.checked; E.save(); });
  });
  return `<section class="hero prof-hero"><div class="stack" style="gap:12px"><span class="eyebrow">Mode enseignant</span><h1>Espace enseignant 🍎</h1>
    <p>Projetez des exercices au tableau, imprimez des fiches et leurs corrigés, ou présentez le vocabulaire en images. Pour revenir à la vue élève : bouton « 🍎 Prof » en haut de l’écran.</p>
    <div class="row"><a class="btn spark big" href="#fiches">📝 Fiches d’exercices</a><a class="btn ghost" href="#enseignants">ℹ️ Présentation du site</a></div></div></section>
  <section class="stack"><h2>🧑‍🏫 Au tableau, tout de suite</h2><p class="muted">Une fiche au hasard s’ouvre en grand : la classe répond, puis vous révélez la correction (barre d’espace).</p>
    <div class="grid auto-fill">${E.FICHES.map(f => `<button class="game-card" type="button" data-tq="${f.id}"><span class="g-emoji">${f.emoji}</span><b>${esc(f.name)}</b><small>${esc(f.desc)}</small><span class="best">Projeter →</span></button>`).join("")}</div></section>
  <div class="grid g2">
    <section class="card stack"><h2>📝 Fiches à imprimer</h2><p>Chaque type de fiche existe en 9 999 versions numérotées, de 5 à 30 questions, avec son corrigé imprimable. Les élèves peuvent aussi faire la même fiche en ligne (même numéro) et la corriger seuls.</p>
      <label class="switch" style="border:0"><span><b>Afficher les corrigés directement</b><small>Les réponses apparaissent dès l’ouverture d’une fiche</small></span><input class="toggle" type="checkbox" id="profKey" ${E.state.ui.profKey ? "checked" : ""}></label>
      <a class="btn primary" href="#fiches" style="justify-self:start">Créer une fiche →</a></section>
    <section class="card stack"><h2>📚 Ressources pour la classe</h2>
      <div class="todo">
        <a href="#verbes"><span class="t-ico">🔁</span><span><b>Fiche des verbes irréguliers</b><small>6 catégories, écoute, quiz, impression</small></span><span>→</span></a>
        <a href="#temps"><span class="t-ico">⏳</span><span><b>Les 12 temps</b><small>Frises à projeter, exercices corrigés</small></span><span>→</span></a>
        <a href="#vocabulaire"><span class="t-ico">🧠</span><span><b>Vocabulaire en images</b><small>${E.THEMES.length} thèmes à projeter et écouter</small></span><span>→</span></a>
        <a href="#histoires"><span class="t-ico">📖</span><span><b>Compréhension orale</b><small>Histoires lues à voix haute + questions</small></span><span>→</span></a>
        <a href="#jeu-eclair"><span class="t-ico">⚡</span><span><b>Défi éclair</b><small>Rituel de début de cours (60 s)</small></span><span>→</span></a>
        <a href="#partager"><span class="t-ico">📲</span><span><b>Donner le site aux élèves</b><small>QR code à projeter</small></span><span>→</span></a>
      </div></section>
  </div>`;
};

/* ---------- Bascule élève / enseignant ---------- */
E.setMode = mode => {
  E.S().mode = mode; E.save(); E.applySettings(); E.updateModeBtn();
  E.toast(mode === "prof" ? "🍎 Mode enseignant activé" : "🎒 Mode élève activé");
  E.rerender();
};
E.updateModeBtn = () => {
  const b = $("#modeBtn"); if (!b) return;
  const p = prof();
  b.innerHTML = p ? "🍎 <span>Prof</span>" : "🎒 <span>Élève</span>";
  b.title = p ? "Mode enseignant (toucher pour passer en mode élève)" : "Mode élève (toucher pour passer en mode enseignant)";
  b.setAttribute("aria-label", b.title);
};
document.addEventListener("click", e => {
  if (e.target.closest("#modeBtn")) E.setMode(prof() ? "eleve" : "prof");
  const m = e.target.closest("[data-setmode]"); if (m) E.setMode(m.dataset.setmode);
});
})();
