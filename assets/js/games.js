/* Anglais Éclair — jeux & quiz. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;

E.GAMES = [
  { id: "image", emoji: "🖼️", name: "Image → mot", desc: "Une image, quatre mots anglais.", words: true },
  { id: "fren", emoji: "🇫🇷", name: "Français → anglais", desc: "Trouve le mot anglais.", words: true },
  { id: "enfr", emoji: "🇬🇧", name: "Anglais → français", desc: "Trouve la bonne traduction.", words: true },
  { id: "ecoute", emoji: "👂", name: "Écoute & choisis", desc: "Écoute un mot, trouve son image.", words: true },
  { id: "ecrire", emoji: "✍️", name: "Écris le mot", desc: "Image + français → tape l’anglais.", words: true },
  { id: "dictee", emoji: "🎧", name: "Dictée", desc: "Écoute, puis écris le mot.", words: true },
  { id: "eclair", emoji: "⚡", name: "Défi éclair", desc: "Un max de bonnes réponses avant la fin du chrono.", words: true, timed: true },
  { id: "vraifaux", emoji: "✅", name: "Vrai ou faux", desc: "La traduction est-elle juste ? Vite !", words: true, timed: true },
  { id: "memory", emoji: "🧩", name: "Memory", desc: "Retrouve les paires image ↔ mot.", words: true },
  { id: "pendu", emoji: "🪢", name: "Le pendu", desc: "Devine le mot lettre par lettre.", words: true },
  { id: "lettres", emoji: "🔤", name: "Mot mélangé", desc: "Remets les lettres dans l’ordre.", words: true },
  { id: "verbes", emoji: "🔁", name: "Verbes irréguliers", desc: "Prétérit et participe passé." },
  { id: "temps", emoji: "⏳", name: "Quiz des temps", desc: "Choisis ou écris la bonne forme." },
  { id: "phrasal", emoji: "🧲", name: "Phrasal verbs", desc: "give up, look after… ça veut dire quoi ?" },
  { id: "idiomes", emoji: "🦄", name: "Expressions imagées", desc: "Raining cats and dogs ?" },
  { id: "fauxamis", emoji: "🪤", name: "Faux amis", desc: "Ne tombe pas dans le piège." },
  { id: "phrases", emoji: "💬", name: "Phrases utiles", desc: "La bonne phrase pour chaque situation." }
];
E.GAME = new Map(E.GAMES.map(g => [g.id, g]));

/* ---------- Réservoir de mots ---------- */
E.SOURCES = () => [
  ["level", `Mon niveau (${E.S().level} et en dessous)`], ["all", "Tous les mots (A1 → C1)"], ["seen", "Mots déjà vus"], ["due", "Mots à revoir aujourd’hui"], ["fav", "Mes favoris ⭐"],
  ...E.LEVELS.map(l => ["lvl:" + l, `Niveau ${l} uniquement`]),
  ...E.THEMES.map(t => ["theme:" + t.id, `${t.emoji} ${t.name}`])
];
const pool = () => {
  const src = E.state.ui.gSource || "level";
  let list;
  if (src.startsWith("theme:")) list = E.THEME.get(src.slice(6))?.words || [];
  else if (src.startsWith("lvl:")) list = E.WORDS.filter(w => w.level === src.slice(4));
  else if (src === "all") list = E.WORDS;
  else if (src === "seen") list = E.WORDS.filter(w => E.started(w.id));
  else if (src === "due") list = E.dueIds().map(id => E.WORD.get(id));
  else if (src === "fav") list = E.state.fav.map(id => E.WORD.get(id)).filter(Boolean);
  else list = E.wordsForLevel();
  if (list.length < 6) { list = E.wordsForLevel(); E.after(() => E.toast("Pas assez de mots dans cette sélection : je prends ceux de ton niveau.")); }
  return list;
};
const distractors = (w, key, n, extraFilter = () => true) => {
  const theme = E.THEME.get(w.theme)?.words || [];
  const seen = new Set([E.norm(w[key])]);
  const out = [];
  for (const c of [...E.shuffle(theme), ...E.shuffle(E.WORDS)]) {
    if (out.length >= n) break;
    const k = E.norm(c[key]);
    if (c.id === w.id || seen.has(k) || !extraFilter(c)) continue;
    seen.add(k); out.push(c);
  }
  return out;
};
const simpleWord = w => /^[a-z]{3,10}$/i.test(w.en);
const firstFr = fr => fr.split(" / ")[0];
const nQ = () => Number(E.S().quizLen) || 10;

/* ---------- Générateurs de questions ---------- */
const wordQ = {
  image: w => ({ word: w, img: E.img(w) || "❓", prompt: "", sub: "Quel est ce mot en anglais ?", options: E.shuffle([w, ...distractors(w, "en", 3, c => c.img !== w.img)]).map(x => x.en), answers: [w.en], after: w.en }),
  fren: w => ({ word: w, img: E.img(w), prompt: w.fr, sub: "En anglais, ça se dit…", options: E.shuffle([w, ...distractors(w, "en", 3)]).map(x => x.en), answers: [w.en], after: w.en }),
  enfr: w => ({ word: w, img: "", prompt: w.en, say: w.en, sub: "Ça veut dire…", options: E.shuffle([w, ...distractors(w, "fr", 3)]).map(x => x.fr), answers: [w.fr] }),
  ecoute: w => ({ word: w, img: "", prompt: "🔊", say: w.en, sub: "Écoute, puis choisis.", replay: true, options: E.shuffle([w, ...distractors(w, "fr", 3, c => c.img !== w.img)]).map(x => `${E.img(x)} ${x.fr}`), answers: [`${E.img(w)} ${w.fr}`], after: w.en }),
  ecrire: w => ({ word: w, img: E.img(w), prompt: w.fr, sub: "Écris le mot anglais.", input: true, answers: w.en.split(" / "), after: w.en }),
  dictee: w => ({ word: w, img: "", prompt: "🎧", say: w.en, sub: "Écoute et écris ce que tu entends.", replay: true, hint: `${E.img(w)} ${w.fr}`, input: true, answers: w.en.split(" / ") }),
  vraifaux: w => { const t = Math.random() < 0.5, other = distractors(w, "fr", 1)[0]; return { word: t ? w : null, img: E.img(w), prompt: `${w.en} = ${t ? w.fr : other.fr} ?`, sub: "Vrai ou faux ?", options: ["Vrai", "Faux"], answers: [t ? "Vrai" : "Faux"], fixedOrder: true, explain: `${w.en} = ${w.fr}` }; }
};
const verbQ = v => {
  const part = Math.random() < 0.5;
  const ans = (part ? v[2] : v[1]).split("/").map(x => x.trim());
  if (Math.random() < 0.5) {
    const others = E.shuffle(window.IRREGULARS.filter(x => x[0] !== v[0])).slice(0, 3).map(x => (part ? x[2] : x[1]).split("/")[0].trim());
    return { img: "🔁", prompt: `to ${v[0]}`, sub: `${part ? "Participe passé" : "Prétérit"} de « ${v[3]} » ?`, options: E.shuffle([ans[0], ...others.filter(o => !ans.includes(o))]).slice(0, 4), answers: ans, explain: `${v[0]} – ${v[1]} – ${v[2]}`, sayAfter: `${v[0]}, ${v[1].split("/")[0]}, ${v[2].split("/")[0]}` };
  }
  return { img: "🔁", prompt: `to ${v[0]}`, sub: `Écris le ${part ? "participe passé" : "prétérit"} (${v[3]})`, input: true, answers: ans, explain: `${v[0]} – ${v[1]} – ${v[2]}`, sayAfter: `${v[0]}, ${v[1].split("/")[0]}, ${v[2].split("/")[0]}` };
};
const listQ = (list, enKey = "en", frKey = "fr", emoji = () => "") => {
  const it = E.pick(list), reverse = Math.random() < 0.35;
  const others = E.shuffle(list.filter(x => x !== it)).slice(0, 3);
  return reverse
    ? { img: emoji(it), prompt: it[frKey], sub: "En anglais ?", options: E.shuffle([it, ...others]).map(x => x[enKey]), answers: [it[enKey]], sayAfter: it[enKey] }
    : { img: emoji(it), prompt: it[enKey], say: it[enKey], sub: "Ça veut dire…", options: E.shuffle([it, ...others]).map(x => x[frKey]), answers: [it[frKey]] };
};
const tenseQ = () => {
  if (Math.random() < 0.6) { const q = E.pick(window.GRAMMAR_QCM); return { img: "⏳", prompt: q.q, sub: "Choisis la bonne réponse.", options: E.shuffle(q.o), answers: [q.a], explain: q.why, sayAfter: q.q.includes("___") ? q.q.replace("___", q.a) : "" }; }
  const src = E.pick([...window.TENSES, ...window.LESSONS]), ex = E.pick(src.ex);
  return { img: "✍️", prompt: ex[0], sub: `${src.fr || src.name} · écris la réponse`, input: true, answers: ex[1].split("/"), explain: ex[2], sayAfter: ex[0].replace("___", ex[1].split("/")[0]).replace(/\s*\(.*?\)/g, "") };
};
const makeGen = id => {
  const g = E.GAME.get(id);
  if (g.words) {
    let list = pool();
    if (["pendu", "lettres"].includes(id)) { const s = list.filter(simpleWord); list = s.length >= 5 ? s : E.WORDS.filter(simpleWord); }
    if (["image", "ecoute", "memory"].includes(id)) {
      const ABSTRACT = new Set(["verbs", "adjectives", "adverbs", "places", "advanced", "time", "essentials", "society", "personality", "numbers"]);
      const count = new Map(); E.WORDS.forEach(w => count.set(w.img, (count.get(w.img) || 0) + 1));
      const concrete = w => !ABSTRACT.has(w.theme) && count.get(w.img) <= 2;
      const c = list.filter(concrete);
      list = c.length >= 6 ? c : E.WORDS.filter(concrete);
    }
    const kind = id === "eclair" ? null : id;
    let bag = [];
    return () => {
      if (!bag.length) bag = E.shuffle(list);
      const w = bag.pop();
      const k = kind || E.pick(["image", "fren", "enfr"]);
      return wordQ[k](w);
    };
  }
  if (id === "verbes") { const lv = E.S().quizLevel === "all" ? window.IRREGULARS : window.IRREGULARS.filter(v => v[4] !== "rare"); return () => verbQ(E.pick(lv)); }
  if (id === "temps") return tenseQ;
  if (id === "phrasal") return () => listQ(window.PHRASALS, "en", "fr", () => "🧲");
  if (id === "idiomes") return () => listQ(window.IDIOMS, "en", "fr", x => x.note);
  if (id === "fauxamis") return () => { const q = listQ(window.FALSE_FRIENDS, "en", "fr", () => "🪤"); q.explain = window.FALSE_FRIENDS.find(f => f.en === q.answers[0] || f.fr === q.answers[0])?.trap; return q; };
  if (id === "phrases") { const all = window.PHRASES.flatMap(g2 => g2.items.map(i => ({ ...i, emoji: g2.emoji }))); return () => listQ(all, "en", "fr", x => x.emoji); }
  return () => null;
};

/* ---------- Moteur de quiz ---------- */
const runQuiz = (gameId, opt) => {
  const g = E.GAME.get(gameId), timed = !!g.timed, seconds = Number(E.S().flashTime) || 60;
  const total = timed ? Infinity : nQ();
  const gen = makeGen(gameId);
  let i = 0, score = 0, streak = 0, bestStreak = 0, q = null, locked = false, timeLeft = seconds, timer = null, recent = [], ended = false;
  const box = () => $("#play");
  const finish = () => {
    if (ended || !box()) return;
    ended = true;
    clearInterval(timer);
    const n = i, pct = n ? Math.round(score / n * 100) : 0;
    const key = gameId, prev = E.state.best[key];
    const val = timed ? score : pct, isBest = prev === undefined || val > prev;
    if (isBest) E.state.best[key] = val;
    E.addXp(10, "games"); E.sfx("win");
    if ((timed ? score >= 10 : pct >= 80)) E.burst();
    box().innerHTML = `<div class="card result"><span class="r-big">${timed ? "⚡" : pct >= 80 ? "🌟" : pct >= 50 ? "👏" : "🌱"}</span>
      <div class="score">${score}${timed ? "" : ` / ${n}`}</div>
      <p>${timed ? `bonnes réponses en ${seconds} secondes` : `${pct} % de réussite`} · meilleure série : ${bestStreak} 🔥</p>
      <p class="muted">${isBest ? "🏆 Nouveau record personnel !" : `Ton record : ${prev}${timed ? "" : " %"}`}</p>
      ${recent.filter(r => !r.ok).length ? `<div class="card" style="text-align:left;width:100%"><b>À revoir :</b>${recent.filter(r => !r.ok).slice(0, 12).map(r => `<div class="example">${r.say ? E.sayBtn(r.say) : "<span></span>"}<span><b>${esc(r.q)}</b><i>→ ${esc(r.a)}</i></span></div>`).join("")}</div>` : ""}
      <div class="row" style="justify-content:center"><button class="btn primary big" type="button" id="replay">↻ Rejouer</button><a class="btn" href="#jeux">🎮 Autres jeux</a><a class="btn ghost" href="#accueil">🏠 Accueil</a></div></div>`;
    $("#replay").addEventListener("click", () => E.rerender());
  };
  const render = () => {
    if (ended || !box()) return;
    if (i >= total) return finish();
    q = gen(); locked = false;
    if (!q) return finish();
    const top = timed ? `<span class="timer${timeLeft <= 10 ? " low" : ""}" id="timer">⏱ ${timeLeft}s</span>` : `<span>Question ${i + 1} / ${total}</span>`;
    box().innerHTML = `<div class="play-top">${top}<span>✅ ${score} · 🔥 ${streak}</span><button class="btn small ghost" type="button" id="quit">Arrêter</button></div>
      ${timed ? "" : `<div class="bar"><i style="width:${i / total * 100}%"></i></div>`}
      <div class="q-box">
        ${q.img ? `<div class="q-img">${q.img}</div>` : ""}
        ${q.prompt ? `<div class="q-prompt">${esc(q.prompt)}</div>` : ""}
        <div class="q-sub">${esc(q.sub || "")}</div>
        ${q.replay || q.say ? `<div class="row" style="justify-content:center">${E.sayBtn(q.say, !!q.replay)}${q.replay ? `<button class="btn small ghost" type="button" data-slow>🐢 Lent</button>` : ""}${q.hint ? `<button class="btn small ghost" type="button" data-hint>💡 Indice</button>` : ""}</div><div id="hint" class="muted"></div>` : ""}
        ${q.input ? `<form class="answer-input" id="ansForm"><input id="ans" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ta réponse" placeholder="Ta réponse…"><button class="btn primary" type="submit">OK</button></form><button class="btn small ghost" type="button" id="dunno">Je ne sais pas</button>`
          : `<div class="opts">${q.options.map((o, k) => `<button class="opt" type="button" data-k="${k}">${esc(o)}</button>`).join("")}</div>`}
        <div id="fb" class="feedback" hidden></div>
      </div>`;
    if (q.say && (q.replay || E.S().autoplay)) setTimeout(() => E.say(q.say), 200);
    $("#ans")?.focus();
  };
  const answer = given => {
    if (locked) return;
    locked = true;
    const ok = q.input ? q.answers.some(a => E.checkAnswer(given, a)) : q.answers.includes(given);
    i++;
    if (ok) { score++; streak++; bestStreak = Math.max(bestStreak, streak); E.sfx("ok"); E.addXp(timed ? 5 : 10, "correct"); }
    else { streak = 0; E.sfx("ko"); E.day().wrong = (E.day().wrong || 0) + 1; }
    if (q.word) E.quizTouch(q.word.id, ok);
    recent.push({ ok, q: q.prompt || q.say || "", a: q.answers[0], say: q.after || q.sayAfter || q.say });
    if (!q.input) $$(".opt", box()).forEach(b => { b.disabled = true; const t = q.options[Number(b.dataset.k)]; if (q.answers.includes(t)) b.classList.add("ok"); else if (t === given) b.classList.add("ko"); });
    else { const inp = $("#ans"); inp.disabled = true; inp.style.borderColor = ok ? "var(--good)" : "var(--bad)"; }
    const fb = $("#fb");
    fb.hidden = false; fb.className = "feedback " + (ok ? "ok" : "ko");
    fb.innerHTML = `${ok ? "✅ <b>Bien joué !</b>" : `❌ <b>Réponse :</b> ${esc(q.answers[0])}`}${q.explain ? ` <span class="muted">· ${esc(q.explain)}</span>` : ""}
      ${!timed && !ok ? `<div style="margin-top:10px"><button class="btn primary" type="button" id="next">Suivant → <kbd>Entrée</kbd></button></div>` : ""}`;
    const sayIt = q.after || q.sayAfter;
    if (sayIt && !timed && E.S().autoplay) E.say(sayIt);
    if (timed) setTimeout(render, ok ? 380 : 900);
    else if (ok) setTimeout(() => { if (box() && locked) render(); }, 1100);
  };
  E.after(() => {
    const b = box();
    b.addEventListener("click", e => {
      if (e.target.closest("#quit")) return finish();
      if (e.target.closest("#next")) return render();
      if (e.target.closest("[data-slow]")) return E.say(q.say, 0.6);
      if (e.target.closest("[data-hint]")) { $("#hint").textContent = q.hint; return; }
      if (e.target.closest("#dunno")) return answer("");
      const o = e.target.closest(".opt[data-k]"); if (o && !o.disabled) answer(q.options[Number(o.dataset.k)]);
    });
    b.addEventListener("submit", e => { e.preventDefault(); const v = $("#ans").value; if (v.trim()) answer(v); });
    const key = e => {
      if (!box()) return;
      if (e.key === "Enter" && locked && $("#next")) { e.preventDefault(); render(); return; }
      if (e.target.matches("input")) return;
      const k = Number(e.key);
      if (!locked && q && !q.input && k >= 1 && k <= q.options.length) answer(q.options[k - 1]);
    };
    document.addEventListener("keydown", key);
    E.onLeave(() => { document.removeEventListener("keydown", key); clearInterval(timer); });
    render();
    if (timed) timer = setInterval(() => {
      timeLeft--;
      const t = $("#timer"); if (t) { t.textContent = `⏱ ${timeLeft}s`; t.classList.toggle("low", timeLeft <= 10); }
      if (timeLeft <= 5 && timeLeft > 0) E.sfx("tick");
      if (timeLeft <= 0) finish();
    }, 1000);
  });
  return `<div class="play" id="play"></div>`;
};

/* ---------- Memory ---------- */
const runMemory = () => {
  const ABSTRACT = new Set(["verbs", "adjectives", "adverbs", "places", "advanced", "time", "essentials", "society", "personality", "numbers"]);
  let base = pool().filter(w => !ABSTRACT.has(w.theme)); if (base.length < 6) base = E.WORDS.filter(w => !ABSTRACT.has(w.theme));
  const words = E.shuffle(base).filter((w, k, a) => a.findIndex(x => x.img === w.img) === k).slice(0, 6);
  const cards = E.shuffle(words.flatMap(w => [{ id: w.id, face: `<span class="m-emoji">${w.img}</span>` }, { id: w.id, face: esc(w.en), say: w.en }]));
  let open = [], found = 0, moves = 0, t0 = Date.now(), lock = false;
  E.after(() => {
    const grid = $("#mem");
    const paint = () => { grid.innerHTML = cards.map((c, k) => `<button class="mem${c.up || c.found ? " up" : ""}${c.found ? " found" : ""}${c.miss ? " miss" : ""}" type="button" data-k="${k}" aria-label="Carte ${k + 1}">${c.up || c.found ? c.face : "⚡"}</button>`).join(""); $("#memInfo").textContent = `Paires : ${found} / ${words.length} · coups : ${moves}`; };
    grid.addEventListener("click", e => {
      const b = e.target.closest("[data-k]"); if (!b || lock) return;
      const c = cards[Number(b.dataset.k)]; if (c.up || c.found) return;
      c.up = true; if (c.say) E.say(c.say); open.push(c); paint();
      if (open.length === 2) {
        moves++; lock = true;
        const [a, b2] = open;
        if (a.id === b2.id) {
          a.found = b2.found = true; found++; E.sfx("ok"); E.addXp(5, "correct"); E.quizTouch(a.id, true); open = []; lock = false; paint();
          if (found === words.length) {
            const secs = Math.round((Date.now() - t0) / 1000), val = Math.max(0, 100 - (moves - words.length) * 8);
            if (E.state.best.memory === undefined || val > E.state.best.memory) E.state.best.memory = val;
            E.addXp(15, "games"); E.sfx("win"); E.burst();
            $("#memInfo").innerHTML = `🏆 Gagné en ${moves} coups et ${secs} s ! <button class="btn small primary" type="button" id="replay">↻ Rejouer</button>`;
            $("#replay").addEventListener("click", () => E.rerender());
          }
        } else {
          a.miss = b2.miss = true; E.sfx("ko"); paint();
          setTimeout(() => { a.up = b2.up = a.miss = b2.miss = false; open = []; lock = false; paint(); }, 900);
        }
      }
    });
    paint();
  });
  return `<div class="play"><p class="muted" style="text-align:center">Associe chaque image à son mot anglais. Chaque mot est lu à voix haute.</p><div class="memory-grid" id="mem"></div><p id="memInfo" style="text-align:center;font-weight:700"></p></div>`;
};

/* ---------- Pendu ---------- */
const runHangman = () => {
  const list = (() => { const s = pool().filter(simpleWord); return s.length >= 5 ? s : E.WORDS.filter(simpleWord); })();
  let bag = E.shuffle(list), w, guessed, lives, won = 0, played = 0;
  const ROUNDS = 5;
  E.after(() => {
    const box = $("#hang");
    const start = () => {
      if (played >= ROUNDS) {
        E.addXp(10, "games"); E.sfx("win");
        if (E.state.best.pendu === undefined || won * 20 > E.state.best.pendu) E.state.best.pendu = won * 20;
        box.innerHTML = `<div class="card result"><span class="r-big">🪢</span><div class="score">${won} / ${ROUNDS}</div><p>mots trouvés</p><div class="row" style="justify-content:center"><button class="btn primary" type="button" id="replay">↻ Rejouer</button><a class="btn" href="#jeux">🎮 Autres jeux</a></div></div>`;
        $("#replay").addEventListener("click", () => E.rerender()); return;
      }
      w = bag.pop() || E.pick(list); guessed = new Set(); lives = 7; draw();
    };
    const solved = () => [...w.en.toLowerCase()].every(c => guessed.has(c));
    const draw = (msg = "") => {
      const word = [...w.en.toLowerCase()].map(c => guessed.has(c) || lives <= 0 ? c : "_").join("");
      box.innerHTML = `<div class="play-top"><span>Mot ${played + 1} / ${ROUNDS}</span><span class="lives">${"❤️".repeat(Math.max(0, lives))}${"🤍".repeat(7 - Math.max(0, lives))}</span></div>
        <div class="q-box"><div class="q-img">${E.img(w)}</div><div class="q-sub">Indice : ${esc(firstFr(w.fr))}</div><div class="hangman">${esc(word)}</div>
        ${msg ? `<div class="feedback ${solved() ? "ok" : "ko"}">${msg}</div>` : ""}
        ${lives > 0 && !solved() ? `<div class="keys">${"abcdefghijklmnopqrstuvwxyz".split("").map(c => `<button type="button" data-l="${c}" class="${guessed.has(c) ? (w.en.toLowerCase().includes(c) ? "hit" : "miss") : ""}" ${guessed.has(c) ? "disabled" : ""}>${c}</button>`).join("")}</div>` : `<button class="btn primary" type="button" id="nextWord">Mot suivant →</button>`}</div>`;
    };
    const guess = c => {
      if (!w || guessed.has(c) || lives <= 0 || solved()) return;
      guessed.add(c);
      if (!w.en.toLowerCase().includes(c)) { lives--; E.sfx("ko"); } else E.sfx("tick");
      if (solved()) { won++; played++; E.addXp(10, "correct"); E.sfx("ok"); E.say(w.en); E.quizTouch(w.id, true); draw(`✅ Bravo : <b>${esc(w.en)}</b> = ${esc(w.fr)}`); }
      else if (lives <= 0) { played++; E.say(w.en); E.quizTouch(w.id, false); draw(`❌ C’était <b>${esc(w.en)}</b> = ${esc(w.fr)}`); }
      else draw();
    };
    box.addEventListener("click", e => { const b = e.target.closest("[data-l]"); if (b) guess(b.dataset.l); if (e.target.closest("#nextWord")) start(); });
    const key = e => { if (/^[a-z]$/i.test(e.key) && !e.target.matches("input")) guess(e.key.toLowerCase()); else if (e.key === "Enter" && $("#nextWord")) start(); };
    document.addEventListener("keydown", key); E.onLeave(() => document.removeEventListener("keydown", key));
    start();
  });
  return `<div class="play" id="hang"></div>`;
};

/* ---------- Mot mélangé ---------- */
const runScramble = () => {
  const list = (() => { const s = pool().filter(simpleWord); return s.length >= 5 ? s : E.WORDS.filter(simpleWord); })();
  const total = Math.min(nQ(), 15);
  let bag = E.shuffle(list), n = 0, score = 0, w, letters, built;
  E.after(() => {
    const box = $("#scr");
    const next = () => {
      if (n >= total) {
        E.addXp(10, "games"); E.sfx("win");
        const pct = Math.round(score / total * 100);
        if (E.state.best.lettres === undefined || pct > E.state.best.lettres) E.state.best.lettres = pct;
        box.innerHTML = `<div class="card result"><span class="r-big">🔤</span><div class="score">${score} / ${total}</div><div class="row" style="justify-content:center"><button class="btn primary" type="button" id="replay">↻ Rejouer</button><a class="btn" href="#jeux">🎮 Autres jeux</a></div></div>`;
        $("#replay").addEventListener("click", () => E.rerender()); return;
      }
      w = bag.pop() || E.pick(list);
      let mixed = E.shuffle([...w.en.toLowerCase()]);
      if (mixed.join("") === w.en.toLowerCase() && w.en.length > 1) mixed = mixed.reverse();
      letters = mixed.map((c, k) => ({ c, k, used: false })); built = [];
      draw();
    };
    const draw = (msg = "") => {
      box.innerHTML = `<div class="play-top"><span>Mot ${n + 1} / ${total}</span><span>✅ ${score}</span></div>
      <div class="q-box"><div class="q-img">${E.img(w)}</div><div class="q-sub">${esc(firstFr(w.fr))}</div>
      <div class="built">${esc(built.map(b => b.c).join("")) || "&nbsp;"}</div>
      <div class="letters">${letters.map(l => `<button type="button" data-k="${l.k}" ${l.used || msg ? "disabled" : ""}>${esc(l.c)}</button>`).join("")}</div>
      ${msg ? `<div class="feedback ${msg.startsWith("✅") ? "ok" : "ko"}">${msg}</div><button class="btn primary" type="button" id="nextScr">Suivant →</button>` : `<div class="row" style="justify-content:center"><button class="btn small" type="button" id="undo">⌫ Effacer</button><button class="btn small ghost" type="button" id="skip">Passer</button></div>`}</div>`;
    };
    const check = () => {
      if (built.length < letters.length) return draw();
      n++;
      const ok = built.map(b => b.c).join("") === w.en.toLowerCase();
      if (ok) { score++; E.addXp(10, "correct"); E.sfx("ok"); E.quizTouch(w.id, true); } else { E.sfx("ko"); E.quizTouch(w.id, false); }
      E.say(w.en);
      draw(ok ? `✅ <b>${esc(w.en)}</b> = ${esc(w.fr)}` : `❌ C’était <b>${esc(w.en)}</b> = ${esc(w.fr)}`);
    };
    box.addEventListener("click", e => {
      const b = e.target.closest("[data-k]");
      if (b) { const l = letters.find(x => x.k === Number(b.dataset.k)); if (l && !l.used) { l.used = true; built.push(l); check(); } }
      if (e.target.closest("#undo")) { const l = built.pop(); if (l) l.used = false; draw(); }
      if (e.target.closest("#skip")) { n++; E.quizTouch(w.id, false); E.say(w.en); draw(`❌ C’était <b>${esc(w.en)}</b> = ${esc(w.fr)}`); }
      if (e.target.closest("#nextScr")) next();
    });
    const key = e => {
      if (e.target.matches("input")) return;
      if (e.key === "Backspace") { const l = built.pop(); if (l) { l.used = false; draw(); } return; }
      if (e.key === "Enter" && $("#nextScr")) { next(); return; }
      const l = letters.find(x => !x.used && x.c === e.key.toLowerCase());
      if (l && !$("#nextScr")) { l.used = true; built.push(l); check(); }
    };
    document.addEventListener("keydown", key); E.onLeave(() => document.removeEventListener("keydown", key));
    next();
  });
  return `<div class="play" id="scr"></div>`;
};

/* ---------- Pages ---------- */
const bestLabel = g => { const b = E.state.best[g.id]; return b === undefined ? "Pas encore joué" : g.timed ? `Record : ${b} bonnes réponses` : `Record : ${b} %`; };
E.route("jeux", () => {
  const s = E.S();
  E.after(() => {
    $("#gsrc").addEventListener("input", e => { E.state.ui.gSource = e.target.value; E.save(); });
    $("#glen").addEventListener("input", e => { s.quizLen = Number(e.target.value); E.save(); });
    $("#gtime").addEventListener("input", e => { s.flashTime = Number(e.target.value); E.save(); });
  });
  return `${E.head("Jouer pour retenir", "Jeux & quiz 🎮", `${E.GAMES.length} jeux pour ancrer le vocabulaire, les temps et les verbes. Choisis tes réglages, puis lance un jeu.`)}
  <div class="card toolbar">
    ${E.select("gsrc", E.SOURCES(), E.state.ui.gSource || "level", "Mots utilisés")}
    ${E.select("glen", [5, 10, 15, 20, 30, 50].map(n => [n, `${n} questions`]), s.quizLen, "Longueur d’une partie")}
    ${E.select("gtime", [30, 60, 90, 120, 180].map(n => [n, `${n} secondes`]), s.flashTime, "Chrono (jeux rapides)")}
  </div>
  <section class="stack"><h2>Vocabulaire</h2><div class="grid auto-fill">${E.GAMES.filter(g => g.words).map(gameCard).join("")}</div></section>
  <section class="stack"><h2>Grammaire & expressions</h2><div class="grid auto-fill">${E.GAMES.filter(g => !g.words).map(gameCard).join("")}</div></section>`;
}, "Jeux");
const gameCard = g => `<a class="game-card" href="#jeu-${g.id}"><span class="g-emoji">${g.emoji}</span><b>${esc(g.name)}</b><small>${esc(g.desc)}</small><span class="best">${bestLabel(g)}</span></a>`;

E.route("jeu", id => {
  const g = E.GAME.get(id);
  if (!g) return `<div class="empty">Ce jeu n’existe pas. <a class="btn" href="#jeux">Tous les jeux</a></div>`;
  const src = E.SOURCES().find(x => x[0] === (E.state.ui.gSource || "level"));
  const body = id === "memory" ? runMemory() : id === "pendu" ? runHangman() : id === "lettres" ? runScramble() : runQuiz(id);
  E.after(() => $("#gsrc2")?.addEventListener("input", e => { E.state.ui.gSource = e.target.value; E.save(); E.rerender(); }));
  return `<div class="crumbs"><a href="#jeux">Jeux</a> › ${esc(g.name)}</div>
  <div class="head"><div><h1>${g.emoji} ${esc(g.name)}</h1><p>${esc(g.desc)}${g.timed ? ` Chrono : ${E.S().flashTime} s.` : ""}</p></div>
  ${g.words ? `<div style="min-width:240px">${E.select("gsrc2", E.SOURCES(), src ? src[0] : "level", "Mots utilisés")}</div>` : ""}</div>
  ${body}`;
}, id => E.GAME.get(id)?.name || "Jeu");
})();
