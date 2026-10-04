(() => {
  const tenseIds = [
    "present-simple", "present-continuous", "present-perfect", "present-perfect-continuous",
    "past-simple", "past-continuous", "past-perfect", "past-perfect-continuous",
    "will", "future-continuous", "future-perfect", "future-perfect-continuous"
  ];
  const tenseLabels = {
    "present-simple": ["Présent simple", "Present simple"],
    "present-continuous": ["Présent en -ing", "Present continuous"],
    "present-perfect": ["Present perfect", "Present perfect simple"],
    "present-perfect-continuous": ["Present perfect continu", "Present perfect continuous"],
    "past-simple": ["Prétérit", "Past simple"],
    "past-continuous": ["Passé en -ing", "Past continuous"],
    "past-perfect": ["Past perfect", "Past perfect simple"],
    "past-perfect-continuous": ["Past perfect continu", "Past perfect continuous"],
    "will": ["Futur simple", "Future simple · will"],
    "future-continuous": ["Futur en cours", "Future continuous"],
    "future-perfect": ["Futur antérieur", "Future perfect"],
    "future-perfect-continuous": ["Futur antérieur continu", "Future perfect continuous"]
  };

  if (!grammar.some(item => item.id === "future-perfect-continuous")) {
    grammar.push({
      id: "future-perfect-continuous", topic: "Futur", level: "Avancé",
      name: "Futur antérieur continu · Future perfect continuous",
      lead: "Une activité aura commencé avant un repère futur et aura duré jusqu’à ce repère.",
      form: "will + have been + verbe-ing",
      examples: [
        ["By June, I’ll have been learning English for two years.", "En juin, cela fera deux ans que j’apprendrai l’anglais."],
        ["Next month, she’ll have been working here for a decade.", "Le mois prochain, cela fera dix ans qu’elle travaillera ici."],
        ["How long will you have been travelling by then?", "Depuis combien de temps voyageras-tu à ce moment-là ?"]
      ],
      uses: [
        "Insister sur la durée d’une activité jusqu’à un repère futur : by June, for two years.",
        "Décrire ce qui sera en cours depuis un certain temps à ce moment-là.",
        "Forme rare dans la conversation courante, mais utile à reconnaître et à comprendre."
      ],
      trap: "Le future perfect simple insiste sur l’action achevée; cette forme insiste sur sa durée. Certains verbes d’état ne s’emploient généralement pas au continu.",
      memory: "Au futur, imagine un chronomètre qui tourne déjà depuis longtemps quand tu arrives au repère."
    });
    updateProgress();
  }

  const roadmap = document.querySelector("#tenseGrid");
  roadmap.innerHTML = tenseIds.map(id => {
    const lesson = grammar.find(item => item.id === id);
    const names = tenseLabels[id];
    const period = id.startsWith("present-") ? "PRÉSENT" : id.startsWith("past-") ? "PASSÉ" : "FUTUR";
    return `<button class="tense-card" type="button" data-tense-jump="${id}" aria-label="Ouvrir ${names[0]} · ${names[1]}">
      <span>${period} · ${lesson.level}</span><strong>${names[0]}</strong><small>${names[1]}</small>
    </button>`;
  }).join("");

  document.addEventListener("click", event => {
    const jump = event.target.closest("[data-tense-jump]");
    const topic = event.target.closest("[data-grammar-topic]");
    if (jump) {
      const lesson = grammar.find(item => item.id === jump.dataset.tenseJump);
      if (!lesson) return;
      grammarTopic = lesson.topic;
      grammarId = lesson.id;
      renderGrammar();
      document.querySelector("#grammarDetail")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (topic) {
      grammarTopic = topic.dataset.grammarTopic;
      grammarId = grammar.find(item => item.topic === grammarTopic)?.id || grammar[0].id;
      renderGrammar();
    }
  }, true);

  const irregularRows = [
    ["arise","arose","arisen","surgir"],["awake","awoke","awoken","se réveiller"],["bear","bore","borne","porter, supporter"],
    ["beat","beat","beaten","battre"],["bend","bent","bent","plier"],["bet","bet","bet","parier"],
    ["bind","bound","bound","lier, attacher"],["bite","bit","bitten","mordre"],["bleed","bled","bled","saigner"],
    ["blow","blew","blown","souffler"],["breed","bred","bred","élever, se reproduire"],["broadcast","broadcast","broadcast","diffuser"],
    ["burn","burned / burnt","burned / burnt","brûler"],["burst","burst","burst","éclater"],["cast","cast","cast","jeter, distribuer un rôle"],
    ["cling","clung","clung","s’accrocher"],["creep","crept","crept","ramper, avancer furtivement"],["deal","dealt","dealt","traiter, distribuer"],
    ["dig","dug","dug","creuser"],["dive","dived / dove","dived","plonger"],["dream","dreamed / dreamt","dreamed / dreamt","rêver"],
    ["dwell","dwelled / dwelt","dwelled / dwelt","habiter, s’attarder"],["flee","fled","fled","s’enfuir"],["fling","flung","flung","lancer"],
    ["fit","fit / fitted","fit / fitted","aller, convenir (taille)"],["forbid","forbade","forbidden","interdire"],["forgive","forgave","forgiven","pardonner"],
    ["forgo","forwent","forgone","renoncer à"],["forsake","forsook","forsaken","abandonner"],["freeze","froze","frozen","geler"],
    ["grind","ground","ground","moudre, broyer"],["hang","hung / hanged","hung / hanged","pendre, accrocher"],["kneel","knelt / kneeled","knelt / kneeled","s’agenouiller"],
    ["lay","laid","laid","poser, étendre"],["lean","leaned / leant","leaned / leant","s’appuyer, pencher"],["leap","leaped / leapt","leaped / leapt","bondir"],
    ["lend","lent","lent","prêter"],["lie","lay","lain","être allongé"],["light","lit / lighted","lit / lighted","allumer, éclairer"],
    ["mislead","misled","misled","induire en erreur"],["mistake","mistook","mistaken","se tromper, confondre"],["mow","mowed","mown / mowed","tondre"],
    ["overcome","overcame","overcome","surmonter"],["overdo","overdid","overdone","en faire trop"],["overhear","overheard","overheard","entendre par hasard"],
    ["overrun","overran","overrun","envahir, dépasser"],["overtake","overtook","overtaken","rattraper, dépasser"],["plead","pleaded / pled","pleaded / pled","supplier, plaider"],
    ["prove","proved","proven / proved","prouver"],["quit","quit","quit","quitter, arrêter"],["ride","rode","ridden","monter (à vélo / cheval)"],
    ["seek","sought","sought","chercher"],["sew","sewed","sewn / sewed","coudre"],["shake","shook","shaken","secouer"],
    ["shed","shed","shed","perdre, laisser tomber"],["shoot","shot","shot","tirer"],["shrink","shrank / shrunk","shrunk / shrunken","rétrécir"],
    ["slide","slid","slid","glisser"],["sling","slung","slung","lancer, porter en bandoulière"],["slink","slunk","slunk","se faufiler"],
    ["slit","slit","slit","fendre"],["smell","smelled / smelt","smelled / smelt","sentir (une odeur)"],["sneak","sneaked / snuck","sneaked / snuck","se faufiler"],
    ["sow","sowed","sown / sowed","semer"],["speed","sped / speeded","sped / speeded","accélérer"],["spell","spelled / spelt","spelled / spelt","épeler"],
    ["spill","spilled / spilt","spilled / spilt","renverser un liquide"],["spin","spun","spun","tourner, filer"],["spit","spat / spit","spat / spit","cracher"],
    ["split","split","split","fendre, partager"],["spoil","spoiled / spoilt","spoiled / spoilt","gâcher, gâter"],
    ["steal","stole","stolen","voler, dérober"],["sting","stung","stung","piquer"],["stink","stank / stunk","stunk","puer"],
    ["stride","strode","stridden","marcher à grands pas"],["strike","struck","struck / stricken","frapper, faire grève"],["string","strung","strung","enfiler, tendre"],
    ["strive","strove / strived","striven / strived","s’efforcer"],["swear","swore","sworn","jurer"],["sweep","swept","swept","balayer"],
    ["swell","swelled","swollen / swelled","gonfler"],["swing","swung","swung","se balancer"],["tear","tore","torn","déchirer"],
    ["thrust","thrust","thrust","pousser brusquement"],["tread","trod","trodden / trod","marcher sur"],["undergo","underwent","undergone","subir"],
    ["undertake","undertook","undertaken","entreprendre"],["upset","upset","upset","bouleverser"],["wake","woke / waked","woken / waked","se réveiller"],
    ["weave","wove / weaved","woven / weaved","tisser"],["weep","wept","wept","pleurer"],["wet","wet / wetted","wet / wetted","mouiller"],
    ["wind","wound","wound","remonter, enrouler"],["withdraw","withdrew","withdrawn","retirer"],["withstand","withstood","withstood","résister à"],
    ["wring","wrung","wrung","tordre"],["behold","beheld","beheld","contempler"],["befall","befell","befallen","arriver à (un événement)"],
    ["beseech","besought / beseeched","besought / beseeched","supplier"],["beset","beset","beset","assaillir"],["bid","bid / bade","bid / bidden","offrir, ordonner"],
    ["clothe","clothed / clad","clothed / clad","habiller"],["forecast","forecast","forecast","prévoir"],["thrive","thrived / throve","thrived / thriven","prospérer"],
    ["slay","slew","slain","tuer (registre soutenu)"],["strew","strewed","strewn / strewed","parsemer"],["abide","abided / abode","abided / abode","demeurer, tolérer"],
    ["beget","begot","begotten","engendrer"],["browbeat","browbeat","browbeaten","intimider"],["chide","chided / chid","chided / chidden","gronder"],
    ["saw","sawed","sawn / sawed","scier"],["shave","shaved","shaven / shaved","raser"],["slink","slunk","slunk","se faufiler"],
    ["spit","spat / spit","spat / spit","cracher"],["stink","stank / stunk","stunk","puer"],["thrive","thrived / throve","thrived / thriven","prospérer"]
  ];
  const firstForm = form => String(form).split("/")[0].trim();
  const seen = new Set();
  const unique = [];
  verbs.forEach(verb => {
    const key = verb.base.toLowerCase();
    if (!seen.has(key)) { seen.add(key); unique.push(verb); }
  });
  const additions = [];
  irregularRows.forEach(([base, past, part, fr]) => {
    const key = base.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    additions.push({ base, past, part, fr, group: "extended", groupName: "Autres verbes fréquents" });
  });
  verbs.splice(0, verbs.length, ...unique, ...additions);
  verbGroups.push({
    id: "extended", title: "Autres verbes fréquents",
    verbs: additions.map(v => ({ base: v.base, past: v.past, part: v.part, fr: v.fr }))
  });
  const groupSelect = document.querySelector("#verbGroup");
  if (groupSelect) {
    groupSelect.innerHTML = '<option value="all">Toutes les familles</option>' + verbGroups.map(group => `<option value="${group.id}">${group.title}</option>`).join("");
    groupSelect.value = "all";
  }
  renderVerbs();

  const form = document.querySelector("#conjugatorForm");
  const baseInput = document.querySelector("#conjugatorBase");
  const pastInput = document.querySelector("#conjugatorPast");
  const partInput = document.querySelector("#conjugatorPart");
  const tenseSelect = document.querySelector("#conjugatorTense");
  const output = document.querySelector("#conjugatorResults");
  const status = document.querySelector("#conjugatorStatus");
  const subjects = [
    { label: "I", form: "I", person: 0 }, { label: "you (1 pers.)", form: "you", person: 1 },
    { label: "he / she / it", form: "he", person: 2 }, { label: "we", form: "we", person: 3 },
    { label: "you (plur.)", form: "you", person: 4 }, { label: "they", form: "they", person: 5 }
  ];
  tenseSelect.innerHTML = tenseIds.map(id => `<option value="${id}">${tenseLabels[id][0]} · ${tenseLabels[id][1]}</option>`).join("");

  const thirdPerson = verb => {
    if (verb === "be") return "is";
    if (verb === "have") return "has";
    if (verb === "do") return "does";
    if (/(s|x|z|ch|sh|o)$/.test(verb)) return `${verb}es`;
    if (/[^aeiou]y$/.test(verb)) return `${verb.slice(0, -1)}ies`;
    return `${verb}s`;
  };
  const doublesFinal = new Set(["stop","plan","chat","drop","shop","rub","hug","beg","nod","jog","rob","fit","sit","set","put","get","win","run","swim","begin","forget","regret","admit","commit","occur","refer","prefer","permit","submit","omit","control","compel"]);
  const ingForm = verb => {
    if (verb === "be") return "being";
    if (/ie$/.test(verb)) return `${verb.slice(0, -2)}ying`;
    if (/[^e]e$/.test(verb) && !/(ee|ye|oe)$/.test(verb)) return `${verb.slice(0, -1)}ing`;
    if (doublesFinal.has(verb) || (verb.length <= 3 && /[^aeiou][aeiou][^aeiouwxy]$/.test(verb))) return `${verb}${verb.at(-1)}ing`;
    return `${verb}ing`;
  };
  const regularPast = verb => {
    if (/e$/.test(verb)) return `${verb}d`;
    if (/[^aeiou]y$/.test(verb)) return `${verb.slice(0, -1)}ied`;
    if (doublesFinal.has(verb) || (verb.length <= 3 && /[^aeiou][aeiou][^aeiouwxy]$/.test(verb))) return `${verb}${verb.at(-1)}ed`;
    return `${verb}ed`;
  };
  const makeRows = () => {
    const raw = baseInput.value.trim().toLowerCase().replace(/^to\s+/, "");
    const verb = raw.replace(/\s+/g, " ");
    if (!/^[a-z]+(?: [a-z]+)*$/.test(verb)) return null;
    const [head, ...particles] = verb.split(" ");
    const tail = particles.join(" ");
    const entry = verbs.find(v => v.base.toLowerCase() === head);
    const manualPast = pastInput.value.trim();
    const manualPart = partInput.value.trim();
    const irregular = !!entry || !!manualPast || !!manualPart;
    const base = verb;
    const attach = inflected => tail ? `${inflected} ${tail}` : inflected;
    const past = attach(manualPast || (entry ? firstForm(entry.past) : regularPast(head)));
    const part = attach(manualPart || (entry ? firstForm(entry.part) : regularPast(head)));
    const ing = attach(ingForm(head));
    const presentAux = person => person === 2 ? "has" : "have";
    const bePresent = person => ["am", "are", "is", "are", "are", "are"][person];
    const bePast = person => ["was", "were", "was", "were", "were", "were"][person];
    return subjects.map(({label,form: subject,person}) => {
      let affirmative, negative, question;
      switch (tenseSelect.value) {
        case "present-simple":
          if (head === "be") {
            const aux = bePresent(person); affirmative = `${subject} ${aux}`; negative = `${subject} ${aux} not`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject}?`;
          } else {
            const inflected = attach(person === 2 ? thirdPerson(head) : head);
            const aux = person === 2 ? "does" : "do";
            affirmative = `${subject} ${inflected}`; negative = `${subject} ${aux} not ${base}`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject} ${base}?`;
          }
          break;
        case "past-simple":
          if (head === "be") {
            const aux = bePast(person); affirmative = `${subject} ${aux}`; negative = `${subject} ${aux} not`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject}?`;
          } else { affirmative = `${subject} ${past}`; negative = `${subject} did not ${base}`; question = `Did ${subject} ${base}?`; }
          break;
        case "present-continuous": {
          const aux = bePresent(person); affirmative = `${subject} ${aux} ${ing}`; negative = `${subject} ${aux} not ${ing}`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject} ${ing}?`; break;
        }
        case "past-continuous": {
          const aux = bePast(person); affirmative = `${subject} ${aux} ${ing}`; negative = `${subject} ${aux} not ${ing}`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject} ${ing}?`; break;
        }
        case "present-perfect": {
          const aux = presentAux(person); affirmative = `${subject} ${aux} ${part}`; negative = `${subject} ${aux} not ${part}`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject} ${part}?`; break;
        }
        case "present-perfect-continuous": {
          const aux = presentAux(person); affirmative = `${subject} ${aux} been ${ing}`; negative = `${subject} ${aux} not been ${ing}`; question = `${aux[0].toUpperCase()}${aux.slice(1)} ${subject} been ${ing}?`; break;
        }
        case "past-perfect": affirmative = `${subject} had ${part}`; negative = `${subject} had not ${part}`; question = `Had ${subject} ${part}?`; break;
        case "past-perfect-continuous": affirmative = `${subject} had been ${ing}`; negative = `${subject} had not been ${ing}`; question = `Had ${subject} been ${ing}?`; break;
        case "will": affirmative = `${subject} will ${base}`; negative = `${subject} will not ${base}`; question = `Will ${subject} ${base}?`; break;
        case "future-continuous": affirmative = `${subject} will be ${ing}`; negative = `${subject} will not be ${ing}`; question = `Will ${subject} be ${ing}?`; break;
        case "future-perfect": affirmative = `${subject} will have ${part}`; negative = `${subject} will not have ${part}`; question = `Will ${subject} have ${part}?`; break;
        case "future-perfect-continuous": affirmative = `${subject} will have been ${ing}`; negative = `${subject} will not have been ${ing}`; question = `Will ${subject} have been ${ing}?`; break;
      }
      return {label,affirmative,negative,question};
    });
  };
  const renderConjugation = () => {
    const verb = baseInput.value.trim().toLowerCase().replace(/^to\s+/, "");
    const head = verb.split(/\s+/)[0];
    const customPast = pastInput.dataset.userEdited === "true";
    const customPart = partInput.dataset.userEdited === "true";
    const isKnownVerb = verbs.some(item => item.base.toLowerCase() === head);
    if (!isKnownVerb && customPast !== customPart) {
      output.innerHTML = '<div class="empty-state">Pour un verbe irrégulier absent de la liste, renseigne le prétérit et le participe passé ensemble.</div>';
      status.textContent = "Il manque une des deux formes irrégulières.";
      return;
    }
    const rows = makeRows();
    if (!rows) {
      output.innerHTML = '<div class="empty-state">Écris un verbe en lettres anglaises pour afficher sa conjugaison.</div>';
      status.textContent = "";
      return;
    }
    const label = tenseLabels[tenseSelect.value];
    output.innerHTML = `<div class="conjugator-title"><div><span>VERBE : <b>${verb}</b></span><h3>${label[0]} · ${label[1]}</h3></div><span class="conjugator-kind">${verbs.some(v => v.base.toLowerCase() === verb.split(" ")[0]) ? "forme irrégulière connue" : "règles régulières"}</span></div>
      <div class="table-wrap"><table class="conjugation-table"><thead><tr><th>Personne</th><th>Affirmative</th><th>Négative</th><th>Question</th></tr></thead><tbody>${rows.map(row => `<tr><th scope="row">${row.label}</th><td>${row.affirmative}</td><td>${row.negative}</td><td>${row.question}</td></tr>`).join("")}</tbody></table></div>`;
    const enteredManual = pastInput.dataset.userEdited === "true" || partInput.dataset.userEdited === "true";
    const listed = verbs.some(v => v.base.toLowerCase() === verb.split(" ")[0]);
    status.textContent = enteredManual ? "Formes irrégulières personnalisées prises en compte." : listed ? "Formes irrégulières de la liste utilisées." : "Règles régulières appliquées. Si ce verbe est irrégulier, saisis ses deux formes.";
  };
  const known = new Map(verbs.map(v => [v.base.toLowerCase(), v]));
  const applyDefaults = () => {
    const verb = baseInput.value.trim().toLowerCase().replace(/^to\s+/, "").split(/\s+/)[0];
    const entry = known.get(verb);
    if (!entry) return;
    if (!pastInput.dataset.userEdited) pastInput.value = firstForm(entry.past);
    if (!partInput.dataset.userEdited) partInput.value = firstForm(entry.part);
  };
  pastInput.addEventListener("input", () => { pastInput.dataset.userEdited = "true"; renderConjugation(); });
  partInput.addEventListener("input", () => { partInput.dataset.userEdited = "true"; renderConjugation(); });
  baseInput.addEventListener("input", () => {
    pastInput.value = ""; partInput.value = "";
    delete pastInput.dataset.userEdited; delete partInput.dataset.userEdited;
    applyDefaults(); renderConjugation();
  });
  tenseSelect.addEventListener("change", renderConjugation);
  form.addEventListener("submit", event => { event.preventDefault(); applyDefaults(); renderConjugation(); });
  applyDefaults();
  renderConjugation();

  grammarQuestions.push({
    q: "Complète : By June, I ___ English for two years.", a: "will have been learning",
    opts: ["will have been learning", "will learn", "have learned yesterday", "was learning"],
    why: "La durée d’une activité jusqu’à un repère futur se forme avec will have been + -ing."
  });
})();
