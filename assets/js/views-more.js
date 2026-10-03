/* Anglais Éclair — expressions : phrases, phrasal verbs, idiomes, faux amis, familier, prononciation. */
(() => {
"use strict";
const E = window.Eclair, { $, $$, esc } = E;

const filterBar = (id, placeholder, extra = "") => `<div class="card toolbar"><label class="field grow" for="${id}">Chercher<input id="${id}" type="search" placeholder="${esc(placeholder)}" autocomplete="off"></label>${extra}</div>`;
const live = (inputs, draw) => E.after(() => { inputs.forEach(s => $(s)?.addEventListener("input", draw)); draw(); });
const match = (q, ...xs) => !q || xs.some(x => E.norm(x).includes(q));

/* Phrases utiles par situation */
E.route("phrases", () => {
  const ui = E.state.ui;
  live(["#phq", "#phs"], () => {
    const q = E.norm($("#phq").value), g = $("#phs").value; ui.phs = g; E.save();
    const groups = window.PHRASES.filter(x => g === "all" || x.id === g).map(x => [x, x.items.filter(i => match(q, i.en, i.fr, i.note))]).filter(([, it]) => it.length);
    $("#phl").innerHTML = groups.map(([x, items]) => `<section class="card"><div class="card-title"><h2>${x.emoji} ${esc(x.name)}</h2><button class="btn small" type="button" data-sayall="${esc(x.id)}">🔊 Tout écouter</button></div>
      ${items.map(i => `<div class="phrase">${E.sayBtn(i.en)}<span><b>${esc(i.en)}</b><span class="ph-fr">${esc(i.fr)}</span>${i.note ? `<span class="ph-note">💡 ${esc(i.note)}</span>` : ""}</span>${E.favBtn("ph:" + i.en)}</div>`).join("")}</section>`).join("")
      || `<div class="empty">Aucune phrase trouvée.</div>`;
  });
  E.after(() => $("#phl").addEventListener("click", e => { const b = e.target.closest("[data-sayall]"); if (b) { const g = window.PHRASES.find(x => x.id === b.dataset.sayall); E.sayQueue(g.items.map(i => i.en)); } }));
  const total = window.PHRASES.reduce((a, g) => a + g.items.length, 0);
  return `${E.head("Des mots pour la vraie vie", "Phrases utiles 💬", `${total} phrases toutes faites, classées par situation, avec leur traduction et une astuce d’usage.`, `<a class="btn primary" href="#jeu-phrases">🎯 Quiz des phrases</a>`)}
  ${filterBar("phq", "ex. addition, perdu, réunion…", E.select("phs", [["all", "Toutes les situations"], ...window.PHRASES.map(g => [g.id, `${g.emoji} ${g.name}`])], ui.phs || "all", "Situation"))}
  <div id="phl" class="stack" style="gap:16px"></div>`;
}, "Phrases utiles");

/* Phrasal verbs */
E.route("phrasal", () => {
  live(["#pvq", "#pvm", "#pvv"], () => {
    const q = E.norm($("#pvq").value), mode = $("#pvm").value, verb = $("#pvv").value;
    const list = window.PHRASALS.filter(p => match(q, p.en, p.fr, p.note) && (verb === "all" || p.en.startsWith(verb + " ")));
    $("#pvl").innerHTML = list.length ? list.map(p => `<div class="phrase">${E.sayBtn(p.en)}<span><b>${esc(p.en)}</b>${mode === "hide" ? `<button class="chip" type="button" data-reveal="${esc(p.fr)}">👁 sens</button>` : `<span class="ph-fr">${esc(p.fr)}</span>`}<span class="ph-note">“${esc(p.note)}”</span></span>${E.favBtn("pv:" + p.en)}</div>`).join("") : `<div class="empty">Aucun phrasal verb trouvé.</div>`;
  });
  E.after(() => $("#pvl").addEventListener("click", e => { const r = e.target.closest("[data-reveal]"); if (r) r.outerHTML = `<span class="ph-fr">${esc(r.dataset.reveal)}</span>`; }));
  const verbs = [...new Set(window.PHRASALS.map(p => p.en.split(" ")[0]))].sort();
  return `${E.head("Verbe + particule = nouveau sens", "Phrasal verbs 🧲", `${window.PHRASALS.length} phrasal verbs du quotidien. Astuce : apprends-les avec leur exemple, jamais seuls.`, `<a class="btn primary" href="#jeu-phrasal">🎯 Quiz phrasal verbs</a>`)}
  ${filterBar("pvq", "ex. up, chercher, give…", E.select("pvv", [["all", "Tous les verbes"], ...verbs.map(v => [v, v])], "all", "Verbe de base") + E.select("pvm", [["show", "Montrer le sens"], ["hide", "Cacher le sens (test)"]], "show", "Mode"))}
  <div class="card" id="pvl"></div>`;
}, "Phrasal verbs");

/* Expressions imagées */
E.route("idiomes", () => {
  live(["#idq"], () => {
    const q = E.norm($("#idq").value);
    const list = window.IDIOMS.filter(p => match(q, p.en, p.fr));
    $("#idl").innerHTML = list.map(p => `<article class="card idiom"><div class="row between"><span class="i-emoji">${p.note}</span>${E.favBtn("id:" + p.en)}</div><div class="row" style="flex-wrap:nowrap;align-items:start"><b style="flex:1">${esc(p.en)}</b>${E.sayBtn(p.en)}</div><span class="muted">${esc(p.fr)}</span></article>`).join("") || `<div class="empty">Aucune expression trouvée.</div>`;
  });
  return `${E.head("Parler comme un natif", "Expressions imagées 🦄", `${window.IDIOMS.length} expressions que les anglophones utilisent tout le temps, avec leur équivalent français.`, `<a class="btn primary" href="#jeu-idiomes">🎯 Quiz des expressions</a>`)}
  ${filterBar("idq", "ex. cake, pluie, chance…")}
  <div class="grid auto-fill" id="idl"></div>`;
}, "Expressions imagées");

/* Faux amis */
E.route("fauxamis", () => {
  live(["#ffq"], () => {
    const q = E.norm($("#ffq").value);
    const list = window.FALSE_FRIENDS.filter(p => match(q, p.en, p.fr, p.trap));
    $("#ffl").innerHTML = list.map(p => `<article class="card ff"><div class="row between"><b style="font-size:1.15rem">${esc(p.en)}</b>${E.sayBtn(p.en)}</div><span>✅ veut dire : <b>${esc(p.fr)}</b></span><span class="ff-bad">⚠️ ${esc(p.trap)}</span></article>`).join("") || `<div class="empty">Aucun faux ami trouvé.</div>`;
  });
  return `${E.head("Attention, piège !", "Faux amis 🪤", "Ces mots ressemblent au français… mais ne veulent pas dire la même chose. Les connaître évite les plus grosses erreurs.", `<a class="btn primary" href="#jeu-fauxamis">🎯 Quiz faux amis</a>`)}
  ${filterBar("ffq", "ex. actually, librairie…")}
  <div class="grid auto-fill" id="ffl"></div>`;
}, "Faux amis");

/* Anglais familier */
E.route("familier", () => {
  live(["#slq"], () => {
    const q = E.norm($("#slq").value);
    $("#sll").innerHTML = window.SLANG.filter(p => match(q, p.en, p.fr)).map(p => `<div class="phrase">${E.sayBtn(p.note)}<span><b>${esc(p.en)}</b><span class="ph-fr">${esc(p.fr)}</span><span class="ph-note">“${esc(p.note)}”</span></span><span></span></div>`).join("") || `<div class="empty">Rien trouvé.</div>`;
  });
  return `${E.head("Comprendre les séries et les potes", "Anglais familier 😎", "Les mots qu’on entend partout, mais qu’on n’apprend pas à l’école. À utiliser entre amis, pas dans un e-mail au patron !")}
  ${filterBar("slq", "ex. gonna, mate…")}
  <div class="card" id="sll"></div>`;
}, "Anglais familier");

/* Prononciation */
E.route("prononciation", () => {
  let pair = null, target = null, score = 0, tries = 0;
  E.after(() => {
    const box = $("#pairBox");
    const newPair = () => {
      pair = E.pick(window.MINIMAL_PAIRS); target = E.pick(pair);
      box.innerHTML = `<p>Écoute bien, puis choisis le mot entendu.</p><div class="row" style="justify-content:center">${E.sayBtn(target, true)}<button class="btn small ghost" type="button" id="slowPair">🐢 Plus lentement</button></div>
        <div class="opts" style="max-width:420px">${E.shuffle(pair).map(w => `<button class="opt" type="button" data-pick="${esc(w)}">${esc(w)}</button>`).join("")}</div><p class="muted">Score : ${score} / ${tries}</p>`;
      box.querySelector("[data-say]").dataset.say = target;
      setTimeout(() => E.say(target), 250);
    };
    box.addEventListener("click", e => {
      if (e.target.closest("#slowPair")) { E.say(target, 0.6); return; }
      const b = e.target.closest("[data-pick]"); if (!b || b.disabled) return;
      tries++; const ok = b.dataset.pick === target; if (ok) { score++; E.addXp(5, "correct"); }
      E.sfx(ok ? "ok" : "ko");
      $$("[data-pick]", box).forEach(x => { x.disabled = true; if (x.dataset.pick === target) x.classList.add("ok"); else if (x === b) x.classList.add("ko"); });
      setTimeout(newPair, 1100);
    });
    $("#startPairs").addEventListener("click", newPair);
    $("#sounds").addEventListener("click", e => { const s = e.target.closest("[data-slow]"); if (s) E.say(s.dataset.slow, 0.6); });
  });
  return `${E.head("Observer · écouter · répéter", "Prononciation 👄", "Les sons qui piègent les francophones, l’accent tonique et un jeu pour entraîner ton oreille. Clique sur un mot pour l’entendre ; 🐢 pour l’écouter lentement.")}
  <section class="card stack" style="text-align:center;justify-items:center"><h2>👂 Entraîne ton oreille</h2><div id="pairBox" class="stack" style="justify-items:center;width:100%"><p class="muted">Ship ou sheep ? Live ou leave ? Thirteen ou thirty ? À toi d’entendre la différence.</p><button class="btn primary big" type="button" id="startPairs">▶ Commencer</button></div></section>
  <div class="grid auto-fill" id="sounds">${window.SOUNDS.map(s => `<article class="card sound-card"><div class="row between"><span class="sym">${esc(s.symbol)}</span><b>${esc(s.title)}</b></div><p>${esc(s.text)}</p>
    <div class="word-pills">${s.words.map(w => `<button type="button" data-say="${esc(w)}">🔊 ${esc(w)}</button>`).join("")}<button type="button" data-slow="${esc(s.words.join(", "))}">🐢 tous, lentement</button></div>
    <div class="callout"><span>💡 ${esc(s.hint)}</span></div></article>`).join("")}</div>
  <section class="card stack"><h2>🗣️ La méthode en 4 étapes</h2><ol class="list-clean"><li>Écoute le mot ou la phrase deux fois.</li><li>Répète à voix haute, en exagérant un peu.</li><li>Écoute de nouveau en version lente 🐢 et compare.</li><li>Enregistre-toi avec ton téléphone : c’est le meilleur miroir.</li></ol></section>`;
}, "Prononciation");
})();
