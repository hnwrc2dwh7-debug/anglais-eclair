/* Anglais Éclair — fonctionnement hors connexion. */
const CACHE = "anglais-eclair-v7";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest", "./assets/icon.svg", "./assets/css/fonts.css", "./assets/css/style.css",
  "./assets/js/data/vocab-1.js", "./assets/js/data/vocab-2.js", "./assets/js/data/vocab-3.js", "./assets/js/data/vocab-4.js", "./assets/js/data/vocab-5.js",
  "./assets/js/data/grammar.js", "./assets/js/data/stories.js", "./assets/js/data/sentences.js", "./assets/js/views-stories.js", "./assets/js/data/verbs.js", "./assets/js/data/expressions.js",
  "./assets/js/core.js", "./assets/js/views-learn.js", "./assets/js/views-grammar.js", "./assets/js/views-more.js",
  "./assets/js/games.js", "./assets/js/plan-settings.js", "./assets/js/vendor/qrcode.js", "./assets/js/help.js", "./assets/js/fiches.js", "./assets/js/main.js"
];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
/* Réseau d'abord (pour recevoir les mises à jour), cache en secours. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && (e.request.url.startsWith(self.location.origin))) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || (e.request.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
