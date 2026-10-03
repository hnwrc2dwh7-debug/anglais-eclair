# ⚡ Anglais Éclair — l’anglais sans délai

Un site complet pour apprendre l’anglais vite, **gratuit, sans compte, sans IA** (aucun quota consommé) :

- **1 531 mots en images** répartis dans **50 thèmes** (A1 → C1), avec exemples, écoute et favoris
- **Les 12 temps** : tableau, frise du temps, construction, pièges, exemples à écouter, exercices corrigés
- **27 leçons de grammaire** (conditionnels, modaux, passif, comparatifs, discours rapporté…)
- **Conjugueur** pour n’importe quel verbe (190 irréguliers connus, phrasal verbs compris)
- **8 petites histoires** à écouter phrase par phrase (A1 → B2) avec questions de compréhension
- **Test de niveau** en 3 minutes qui adapte le site
- **Phrases utiles**, **phrasal verbs**, **expressions imagées**, **faux amis**, **anglais familier**, **prononciation**
- **17 jeux** : image → mot, dictée, défi éclair 60 s, vrai/faux, memory, pendu, mot mélangé, quiz des temps…
- **Cartes mémoire avec répétition espacée** (révisions du jour)
- **Programme jour par jour** (7 à 180 jours) selon **tes jours d’étude**
- **Réglages** : jours, objectif quotidien, 12 thèmes de couleur, mode sombre, polices, taille du texte, voix (UK, US, AU…), vitesse, etc.
- Fonctionne **hors connexion** et s’installe comme une appli sur téléphone

## Mettre le site en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**
2. *Source* : **Deploy from a branch**
3. Branche : `claude/english-learning-site-2g74yo` (ou `main` après fusion), dossier **/ (root)** → **Save**
4. Après une minute, le site est en ligne à l’adresse :
   **https://hnwrc2dwh7-debug.github.io/anglais-sans-delai/**

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Structure

```
index.html                 page unique
assets/css/style.css       design (thèmes de couleur, mode sombre, mobile)
assets/js/data/*.js        contenus : vocabulaire, grammaire, verbes, expressions
assets/js/core.js          sauvegarde, voix, navigation, menus
assets/js/views-*.js       pages (accueil, vocabulaire, temps, expressions…)
assets/js/games.js         jeux et quiz
assets/js/plan-settings.js programme, statistiques, réglages
sw.js                      fonctionnement hors connexion
```

Pour ajouter des mots : ajoute une ligne `emoji|anglais|français|exemple|traduction` dans un thème de `assets/js/data/vocab-*.js`.
