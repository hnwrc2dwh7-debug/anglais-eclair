/* Anglais Éclair — noyau : outils, sauvegarde, voix, sons, navigation, menus. */
(() => {
"use strict";
const E = window.Eclair = {};

/* ---------- Outils ---------- */
E.$ = (s, r = document) => r.querySelector(s);
E.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
E.esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
E.slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
E.shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
E.pick = arr => arr[Math.floor(Math.random() * arr.length)];
E.plural = (n, one, many) => `${n} ${n > 1 ? (many || one + "s") : one}`;
E.norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[’‘`]/g, "'").replace(/[.!?,;:]+$/g, "").replace(/\s+/g, " ").trim();

/* Jours : clé « AAAA-MM-JJ » en heure locale, numéro de jour pour les calculs. */
E.dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
E.dayNum = key => { const [y, m, d] = key.split("-").map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
E.keyOf = num => { const d = new Date(num * 864e5); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`; };
E.today = () => E.dayNum(E.dayKey());
E.dow = num => new Date(num * 864e5).getUTCDay(); /* 0 = dimanche */
E.DAYS_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
E.DAYS_LONG = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
E.MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
E.fmtDay = (num, long) => { const d = new Date(num * 864e5); return long ? `${E.DAYS_LONG[d.getUTCDay()]} ${d.getUTCDate()} ${E.MONTHS[d.getUTCMonth()]}` : `${d.getUTCDate()}/${d.getUTCMonth() + 1}`; };

/* ---------- Données ---------- */
E.LEVELS = ["A1", "A2", "B1", "B2", "C1"];
E.LEVEL_NAMES = { A1: "Débutant", A2: "Élémentaire", B1: "Intermédiaire", B2: "Avancé", C1: "Expert" };
E.lvl = l => E.LEVELS.indexOf(l);
E.THEMES = (window.VOCAB || []).map(t => ({ ...t, words: t.words.map(w => ({ ...w, id: `${t.id}/${E.slug(w.en)}`, theme: t.id, level: t.level })) }));
E.THEME = new Map(E.THEMES.map(t => [t.id, t]));
E.WORDS = E.THEMES.flatMap(t => t.words);
E.WORD = new Map(E.WORDS.map(w => [w.id, w]));
E.CATS = [...new Set(E.THEMES.map(t => t.cat))];

/* ---------- Sauvegarde ---------- */
const KEY = "anglais-eclair-v1";
E.DEFAULTS = {
  name: "", level: "A1", goal: "tout",
  mode: "eleve", bg: "auto", bgCustom: "#e8f3fd", pattern: "none", showHelp: true, useDays: false, studyDays: [1, 2, 3, 4, 5, 6], restKeepsStreak: true,
  dailyXp: 100, newWords: 10, planLength: 30, planStart: E.dayKey(), reminder: "19:00",
  accent: "eclair", theme: "auto", size: "m", font: "moderne", shape: "arrondi", motion: true, imgSize: "m", showImages: true,
  cardDir: "en-fr", showExample: true, quizLen: 10, flashTime: 60, quizLevel: "all", autoplay: true, strict: false, blurFr: false,
  voiceAccent: "en-GB", voiceName: "", rate: 0.95, sfx: true, vocabView: "cartes"
};
const fresh = () => ({ v: 1, settings: { ...E.DEFAULTS }, srs: {}, fav: [], days: {}, lessons: {}, verbs: [], plan: { done: [] }, best: {}, ui: {}, created: E.dayKey() });
E.state = fresh();
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "null");
  if (saved && typeof saved === "object") E.state = { ...fresh(), ...saved, settings: { ...E.DEFAULTS, ...(saved.settings || {}) }, plan: { done: [], ...(saved.plan || {}) }, ui: { ...(saved.ui || {}) } };
} catch { /* stockage indisponible : on garde l'état neuf */ }
E.S = () => E.state.settings;
let saveTimer;
E.save = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(E.state)); } catch { /* navigation privée */ } }, 120);
};
E.resetAll = () => { E.state = fresh(); try { localStorage.removeItem(KEY); } catch {} E.applySettings(); E.updatePills(); };
E.exportData = () => JSON.stringify(E.state);
E.importData = txt => {
  const data = JSON.parse(txt);
  if (!data || typeof data !== "object" || !data.settings) throw new Error("format");
  const clean = {};
  for (const [k, v] of Object.entries(data.settings)) if (k in E.DEFAULTS && typeof v === typeof E.DEFAULTS[k] && Array.isArray(v) === Array.isArray(E.DEFAULTS[k])) clean[k] = v;
  if (Array.isArray(clean.studyDays)) clean.studyDays = clean.studyDays.filter(d => Number.isInteger(d) && d >= 0 && d <= 6);
  E.state = { ...fresh(), ...data, settings: { ...E.DEFAULTS, ...clean } };
  E.save(); E.applySettings(); E.updatePills();
};

/* ---------- Journée, points, série ---------- */
E.day = (key = E.dayKey()) => (E.state.days[key] ||= { xp: 0, learned: 0, reviewed: 0, correct: 0, wrong: 0, games: 0, lessons: 0 });
E.addXp = (n, kind) => {
  const d = E.day(), goal = E.S().dailyXp, before = d.xp;
  d.xp += n;
  if (kind) d[kind] = (d[kind] || 0) + 1;
  if (before < goal && d.xp >= goal) {
    E.toast(`🎉 Objectif du jour atteint : ${goal} points !`);
    E.burst();
    const pd = E.planDayIndexFor(E.today());
    if (pd !== null && !E.state.plan.done.includes(pd)) E.state.plan.done.push(pd);
  }
  E.save(); E.updatePills();
};
/* Sans programme par jours (option par défaut), tous les jours se valent. */
E.isStudyDay = num => !E.S().useDays || E.S().studyDays.includes(E.dow(num));
E.streak = () => {
  const has = num => (E.state.days[E.keyOf(num)]?.xp || 0) > 0;
  const start = E.dayNum(E.state.created) - 1;
  let num = E.today(), n = 0;
  if (!has(num)) num--;
  for (; num >= start; num--) {
    if (has(num)) n++;
    else if (E.S().restKeepsStreak && !E.isStudyDay(num)) continue;
    else break;
  }
  return n;
};
E.bestStreak = () => {
  const keys = Object.keys(E.state.days).filter(k => E.state.days[k].xp > 0).map(E.dayNum).sort((a, b) => a - b);
  let best = 0, cur = 0, prev = null;
  for (const k of keys) {
    let gapOk = prev !== null;
    if (gapOk) for (let x = prev + 1; x < k; x++) if (!(E.S().restKeepsStreak && !E.isStudyDay(x))) { gapOk = false; break; }
    cur = gapOk ? cur + 1 : 1; best = Math.max(best, cur); prev = k;
  }
  return best;
};

/* ---------- Répétition espacée (boîtes de Leitner) ---------- */
E.INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64];
E.card = id => E.state.srs[id];
E.grade = (id, g) => {
  const t = E.today();
  const c = E.state.srs[id] || { b: 0, d: t, n: 0, ok: 0, ko: 0 };
  const isNew = !E.state.srs[id];
  if (g === 0) { c.b = 1; c.d = t + 1; c.ko++; }
  else if (g === 1) { c.b = Math.max(1, c.b); c.d = t + 1; c.ok++; }
  else { c.b = Math.min(7, c.b + 1); c.d = t + E.INTERVALS[c.b]; c.ok++; }
  c.n++; c.last = t;
  E.state.srs[id] = c;
  E.addXp(g === 2 ? 6 : 3, isNew ? "learned" : "reviewed");
};
E.quizTouch = (id, ok) => {
  const c = E.state.srs[id];
  if (!c) return;
  if (ok) { c.ok++; if (c.d <= E.today()) { c.b = Math.min(7, c.b + 1); c.d = E.today() + E.INTERVALS[c.b]; } }
  else { c.ko++; c.b = 1; c.d = E.today(); }
  E.save();
};
E.mastered = id => (E.state.srs[id]?.b || 0) >= 4;
E.started = id => !!E.state.srs[id];
E.dueIds = () => Object.entries(E.state.srs).filter(([id, c]) => c.d <= E.today() && E.WORD.has(id)).sort((a, b) => a[1].b - b[1].b).map(([id]) => id);
E.themeProgress = t => { const ids = t.words.map(w => w.id); const m = ids.filter(E.mastered).length, s = ids.filter(E.started).length; return { total: ids.length, mastered: m, started: s, pct: Math.round(m / ids.length * 100) }; };
E.isFav = id => E.state.fav.includes(id);
E.toggleFav = id => { const f = E.state.fav; const i = f.indexOf(id); if (i >= 0) f.splice(i, 1); else f.push(id); E.save(); return i < 0; };
E.wordsForLevel = () => { const max = E.lvl(E.S().level); return E.WORDS.filter(w => E.lvl(w.level) <= max); };

/* ---------- Voix (synthèse vocale du navigateur, gratuite et hors ligne) ---------- */
E.voices = [];
E.speechOk = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const loadVoices = () => { try { E.voices = speechSynthesis.getVoices().filter(v => /^en(-|_|$)/i.test(v.lang)); } catch { E.voices = []; } };
if (E.speechOk) { loadVoices(); try { speechSynthesis.onvoiceschanged = () => { loadVoices(); E.onVoices && E.onVoices(); }; } catch {} }
E.pickVoice = () => {
  const s = E.S();
  return E.voices.find(v => v.name === s.voiceName)
    || E.voices.find(v => v.lang.replace("_", "-") === s.voiceAccent)
    || E.voices.find(v => v.lang.replace("_", "-").startsWith(s.voiceAccent.slice(0, 2)))
    || null;
};
E.say = (text, rate) => {
  if (!E.speechOk) { E.toast("La lecture audio n’est pas disponible sur ce navigateur."); return; }
  const clean = String(text).replace(/\s*\/\s*/g, ", ").replace(/[()]/g, ", ").replace(/…/g, "").replace(/___/g, "blank");
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    const v = E.pickVoice();
    if (v) u.voice = v;
    u.lang = v ? v.lang : E.S().voiceAccent;
    u.rate = rate || E.S().rate;
    speechSynthesis.speak(u);
  } catch { /* rien */ }
};

/* ---------- Petits sons (générés, aucun fichier) ---------- */
let audioCtx;
E.sfx = type => {
  if (!E.S().sfx) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [660, 880], ko: [220, 160], win: [523, 659, 784, 1047], tick: [880] }[type] || [440];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime + i * 0.09;
      o.type = type === "ko" ? "sawtooth" : "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(type === "ko" ? 0.06 : 0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + 0.2);
    });
  } catch { /* audio indisponible */ }
};

/* ---------- Retours visuels ---------- */
E.toast = msg => {
  const t = E.$("#toast"); if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(E.toast.timer); E.toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
};
E.burst = () => {
  if (!E.S().motion || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const b = document.createElement("div"); b.className = "burst";
  const bits = ["⚡", "⭐", "🎉", "✨", "💛", "🔥"];
  b.innerHTML = Array.from({ length: 28 }, () => `<i style="left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.6}s">${E.pick(bits)}</i>`).join("");
  document.body.appendChild(b); setTimeout(() => b.remove(), 2600);
};

/* ---------- Apparence ---------- */
E.ACCENTS = [
  ["eclair", "Éclair", "#3d5afe", "#ffc930"], ["tomate", "Tomate", "#e2463a", "#ffb547"], ["menthe", "Menthe", "#0e9a78", "#ffd166"],
  ["lavande", "Lavande", "#7653ff", "#ff8fb1"], ["ocean", "Océan", "#0a86ab", "#ffcf5c"], ["soleil", "Soleil", "#e07a00", "#5c7cff"],
  ["bonbon", "Bonbon", "#d83c86", "#5ad1ff"], ["foret", "Forêt", "#2e7d32", "#f2c14e"], ["graphite", "Graphite", "#3b4256", "#f5a524"],
  ["neon", "Néon", "#00a596", "#ff4fd8"], ["cerise", "Cerise", "#b0174a", "#ffd23f"], ["nuit", "Nuit", "#1f3a93", "#ffdd57"]
];
/* Couleurs de fond : clairs, sombres, ou couleur personnalisée. */
E.BACKGROUNDS = [
  ["auto", "Automatique", null],
  ["blanc", "Blanc", { bg: "#ffffff", surface: "#ffffff", s2: "#f0f1f6", line: "#dfe1ea" }],
  ["papier", "Papier crème", { bg: "#fbf7ee", surface: "#fffdf8", s2: "#f1ead9", line: "#e4d9c2", ink: "#2a2418", muted: "#6b604e" }],
  ["ciel", "Bleu ciel", { bg: "#e6f2fd", surface: "#f7fbff", s2: "#d7e8f8", line: "#c3dbf0" }],
  ["menthe", "Vert menthe", { bg: "#e5f6ee", surface: "#f6fcf9", s2: "#d3eedf", line: "#bfe2cf" }],
  ["rose", "Rose poudré", { bg: "#fceaf1", surface: "#fff8fb", s2: "#f6d8e4", line: "#ecc3d3" }],
  ["lavande", "Lavande", { bg: "#efeafc", surface: "#faf8ff", s2: "#e1d8f8", line: "#d0c4f0" }],
  ["peche", "Pêche", { bg: "#fff0e5", surface: "#fffaf6", s2: "#fde0cb", line: "#f3cdb2" }],
  ["citron", "Citron", { bg: "#fdf8dc", surface: "#fffdf0", s2: "#f6edb9", line: "#eadf9c" }],
  ["gris", "Gris perle", { bg: "#eceef2", surface: "#f8f9fb", s2: "#e0e3e9", line: "#cfd3dc" }],
  ["nuit", "Nuit bleue", { dark: true, bg: "#0d0f22", surface: "#161a35", s2: "#1f2447", line: "#2c3263" }],
  ["noir", "Noir", { dark: true, bg: "#000000", surface: "#121212", s2: "#1d1d1d", line: "#2e2e2e", ink: "#f2f2f2", muted: "#a9a9a9" }],
  ["ardoise", "Ardoise", { dark: true, bg: "#1d2329", surface: "#262e35", s2: "#303a43", line: "#3d4954", ink: "#eef2f5", muted: "#a8b4bf" }],
  ["prune", "Prune", { dark: true, bg: "#1f1326", surface: "#2a1b33", s2: "#362342", line: "#4a3157", ink: "#f6eefa", muted: "#c3aed0" }],
  ["sapin", "Sapin", { dark: true, bg: "#0f1d17", surface: "#172a21", s2: "#1f372b", line: "#2b4a3a", ink: "#eaf6ef", muted: "#a5c4b3" }],
  ["perso", "Ma couleur", "custom"]
];
const hex = h => { const m = String(h).replace("#", ""); const n = parseInt(m.length === 3 ? m.split("").map(x => x + x).join("") : m, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const toHex = rgb => "#" + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const lum = h => { const [r, g, b] = hex(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
E.customBackground = color => {
  const dark = lum(color) < 0.18;
  return dark
    ? { dark, bg: color, surface: mix(color, "#ffffff", 0.07), s2: mix(color, "#ffffff", 0.13), line: mix(color, "#ffffff", 0.22), ink: "#f3f4ff", muted: mix(color, "#ffffff", 0.7) }
    : { dark, bg: color, surface: mix(color, "#ffffff", 0.75), s2: mix(color, "#000000", 0.05), line: mix(color, "#000000", 0.13), ink: "#12142b", muted: "#4f546d" };
};
const root = document.documentElement;
const hostTheme = root.getAttribute("data-theme");
E.applySettings = () => {
  const s = E.S();
  const set = (k, v, def) => { if (v === def || v === true && def === undefined) root.removeAttribute("data-" + k); else root.setAttribute("data-" + k, v); };
  set("accent", s.accent, "eclair");
  const preset = E.BACKGROUNDS.find(b => b[0] === s.bg);
  if (!/^#[0-9a-f]{6}$/i.test(s.bgCustom || "")) s.bgCustom = "#e8f3fd";
  const bg = !preset || !preset[2] ? null : preset[2] === "custom" ? E.customBackground(s.bgCustom || "#e8f3fd") : preset[2];
  ["--bg", "--surface", "--surface-2", "--line", "--ink", "--muted"].forEach(p => root.style.removeProperty(p));
  if (bg) {
    /* Un fond choisi impose son mode clair ou sombre. */
    root.setAttribute("data-theme", bg.dark ? "dark" : "light");
    root.style.setProperty("--bg", bg.bg); root.style.setProperty("--surface", bg.surface); root.style.setProperty("--surface-2", bg.s2); root.style.setProperty("--line", bg.line);
    if (bg.ink) root.style.setProperty("--ink", bg.ink);
    if (bg.muted) root.style.setProperty("--muted", bg.muted);
  } else if (s.theme === "auto") { if (hostTheme) root.setAttribute("data-theme", hostTheme); else root.removeAttribute("data-theme"); }
  else root.setAttribute("data-theme", s.theme);
  set("pattern", s.pattern, "none");
  root.setAttribute("data-mode", s.mode === "prof" ? "prof" : "eleve");
  set("size", s.size, "m"); set("font", s.font, "moderne"); set("shape", s.shape, "arrondi"); set("img", s.imgSize, "m");
  if (s.motion) root.removeAttribute("data-motion"); else root.setAttribute("data-motion", "off");
  const acc = E.ACCENTS.find(a => a[0] === s.accent) || E.ACCENTS[0];
  const meta = E.$('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", acc[2]);
};
E.img = w => E.S().showImages ? (w.img || "") : "";

/* ---------- Menus ---------- */
E.MENU = [
  { label: "Apprendre", items: [
    ["vocabulaire", "🧠", "Vocabulaire en images", `${E.THEMES.length} thèmes, ${E.WORDS.length.toLocaleString("fr-FR")} mots`],
    ["temps", "⏳", "Les 12 temps", "Tableau, frises, exercices"],
    ["grammaire", "📐", "Grammaire", "Conditionnels, modaux, passif…"],
    ["verbes", "🔁", "Verbes irréguliers", `${(window.IRREGULARS || []).length} verbes + la fiche du cours`],
    ["conjugueur", "🧩", "Conjugueur", "Un verbe, tous les temps"],
    ["histoires", "📖", "Petites histoires", "Lire et écouter, A1 → B2"]] },
  { label: "S’entraîner", items: [
    ["revisions", "🗂️", "Révisions du jour", "Les mots à revoir aujourd’hui"],
    ["apprendre", "✨", "Nouveaux mots du jour", "Ta dose quotidienne"],
    ["fiches", "📝", "Fiches d’exercices", "Phrases à compléter + corrigé, mode tableau"],
    ["jeux", "🎮", "Jeux & quiz", "17 façons de s’entraîner"],
    ["jeu-eclair", "⚡", "Défi éclair", "Un max de points en 60 s"],
    ["jeu-dictee", "🎧", "Dictée", "Écoute, puis écris"]] },
  { label: "Expressions", items: [
    ["phrases", "💬", "Phrases utiles", "11 situations de la vie"],
    ["phrasal", "🧲", "Phrasal verbs", "get up, give up, look after…"],
    ["idiomes", "🦄", "Expressions imagées", "It’s raining cats and dogs"],
    ["fauxamis", "🪤", "Faux amis", "actually ≠ actuellement"],
    ["familier", "😎", "Anglais familier", "gonna, mate, LOL…"],
    ["prononciation", "👄", "Prononciation", "Sons, accent, paires de mots"]] },
  { label: "Mon parcours", items: [
    ["test", "🎓", "Test de niveau", "3 minutes pour savoir où tu en es"],
    ["programme", "📅", "Programme par jours", "Facultatif · de 7 à 180 jours"],
    ["stats", "📊", "Mes progrès", "Série, points, maîtrise"],
    ["favoris", "⭐", "Mes favoris", "Tes mots mis de côté"],
    ["reglages", "⚙️", "Réglages", "Couleurs, voix, rythme…"],
    ["partager", "📲", "Partager le site", "QR code et lien à envoyer"],
    ["aide", "❓", "Aide", "Mode d’emploi et questions fréquentes"],
    ["enseignants", "🍎", "Pour les enseignants", "Contenus, méthode, confidentialité"]] }
];
const menuItem = ([href, ico, title, sub]) => `<a class="menu-item" href="#${href}" data-href="${href}"><span class="mi-ico" aria-hidden="true">${ico}</span><span><b>${E.esc(title)}</b><small>${E.esc(sub)}</small></span></a>`;
E.renderMenus = () => {
  E.$("#menus").innerHTML = E.MENU.map((m, i) => `<div class="menu" data-menu="${i}">
    <button class="menu-btn" type="button" aria-expanded="false" aria-haspopup="true">${E.esc(m.label)} <span class="chev" aria-hidden="true">▼</span></button>
    <div class="menu-panel" role="menu">${m.items.map(menuItem).join("")}</div></div>`).join("");
  E.$("#drawerMenus").innerHTML = `<a class="menu-item" href="#accueil" data-href="accueil"><span class="mi-ico">🏠</span><span><b>Accueil</b><small>Ta séance du jour</small></span></a>` +
    E.MENU.map((m, i) => `<details ${i < 2 ? "open" : ""}><summary>${E.esc(m.label)}</summary>${m.items.map(menuItem).join("")}</details>`).join("");
};
const closeMenus = except => E.$$(".menu.open").forEach(m => { if (m !== except) { m.classList.remove("open"); E.$(".menu-btn", m).setAttribute("aria-expanded", "false"); } });
document.addEventListener("click", e => {
  const btn = e.target.closest(".menu-btn");
  if (btn) { const m = btn.parentElement; const open = !m.classList.contains("open"); closeMenus(m); m.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); return; }
  if (!e.target.closest(".menu-panel")) closeMenus();
  if (e.target.closest(".menu-item")) { closeMenus(); E.closeDrawer(); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeMenus(); E.closeDrawer(); } });
E.openDrawer = () => { document.body.classList.add("drawer-open"); E.$("#burger").setAttribute("aria-expanded", "true"); };
E.closeDrawer = () => { document.body.classList.remove("drawer-open"); E.$("#burger")?.setAttribute("aria-expanded", "false"); };

E.updatePills = () => {
  const xp = E.$("#xpPill"), st = E.$("#streakPill");
  if (xp) xp.textContent = `⚡ ${E.day().xp} / ${E.S().dailyXp}`;
  if (st) st.textContent = `🔥 ${E.streak()}`;
};

/* ---------- Navigation ---------- */
const routes = {};
E.route = (name, fn, title) => { routes[name] = { fn, title }; };
E.cleanups = [];
E.onLeave = fn => E.cleanups.push(fn);
E.current = "accueil";
E.go = hash => { if (location.hash === "#" + hash) E.render(); else location.hash = hash; };
E.render = () => {
  E.cleanups.splice(0).forEach(fn => { try { fn(); } catch {} });
  try { speechSynthesis.cancel(); } catch {}
  const h = decodeURIComponent(location.hash.slice(1)) || "accueil";
  const dash = h.indexOf("-");
  let name = dash > 0 ? h.slice(0, dash) : h, param = dash > 0 ? h.slice(dash + 1) : "";
  if (!routes[name]) { name = "accueil"; param = ""; }
  E.current = name;
  const app = E.$("#app");
  const help = E.helpBox ? E.helpBox(name, param) : "";
  app.innerHTML = `<div class="view">${help}${routes[name].fn(param) || ""}</div>`;
  document.title = routes[name].title ? `${typeof routes[name].title === "function" ? routes[name].title(param) : routes[name].title} · Anglais Éclair` : "Anglais Éclair";
  E.$$("[data-href]").forEach(a => a.classList.toggle("current", a.dataset.href === h || a.dataset.href === name));
  E.$$("[data-tab]").forEach(a => a.classList.toggle("current", a.dataset.tab === name || (name === "theme" && a.dataset.tab === "vocabulaire") || (["jeu"].includes(name) && a.dataset.tab === "jeux")));
  E.afterRender.splice(0).forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
  if (!E.keepScroll) window.scrollTo({ top: 0 });
  E.keepScroll = false;
  E.updatePills();
};
E.afterRender = [];
E.after = fn => E.afterRender.push(fn);
E.rerender = () => { E.keepScroll = true; E.render(); };

/* Clics globaux : écoute, favoris. */
document.addEventListener("click", e => {
  const say = e.target.closest("[data-say]");
  if (say) { e.preventDefault(); E.say(say.dataset.say); return; }
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    e.preventDefault();
    const on = E.toggleFav(fav.dataset.fav);
    fav.classList.toggle("on", on); fav.textContent = on ? "★" : "☆";
    fav.setAttribute("aria-pressed", String(on));
    E.toast(on ? "Ajouté à tes favoris ⭐" : "Retiré des favoris");
  }
});
E.sayBtn = (text, big) => `<button class="say${big ? " big" : ""}" type="button" data-say="${E.esc(text)}" aria-label="Écouter « ${E.esc(text)} »" title="Écouter">🔊</button>`;
E.favBtn = id => { const on = E.isFav(id); return `<button class="star${on ? " on" : ""}" type="button" data-fav="${E.esc(id)}" aria-pressed="${on}" aria-label="Favori" title="Favori">${on ? "★" : "☆"}</button>`; };
E.head = (eyebrow, title, sub, side = "") => `<div class="head"><div>${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>${side}</div>`;
E.select = (id, options, value, label) => `<label class="field" for="${id}">${label ? E.esc(label) : ""}<select id="${id}">${options.map(([v, t]) => `<option value="${E.esc(v)}"${String(v) === String(value) ? " selected" : ""}>${E.esc(t)}</option>`).join("")}</select></label>`;

/* Plan : défini plus loin, valeur par défaut sûre. */
E.planDayIndexFor = () => null;

E.start = () => {
  E.applySettings();
  E.renderMenus();
  E.updateModeBtn && E.updateModeBtn();
  E.$("#burger").addEventListener("click", E.openDrawer);
  E.$("#drawerClose").addEventListener("click", E.closeDrawer);
  E.$("#drawerBackdrop").addEventListener("click", E.closeDrawer);
  const doSearch = (e, input) => { e.preventDefault(); E.searchQuery = input.value.trim(); E.closeDrawer(); E.go("recherche"); };
  E.$("#topSearch").addEventListener("submit", e => doSearch(e, E.$("#searchInput")));
  E.$("#drawerSearch").addEventListener("submit", e => doSearch(e, E.$("#drawerSearchInput")));
  window.addEventListener("hashchange", E.render);
  E.render();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !/claude|claudeusercontent/.test(location.hostname)) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
};
})();
