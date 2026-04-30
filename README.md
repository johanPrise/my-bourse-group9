# MyBourse

Application web en TypeScript permettant de visualiser et comparer l'evolution du cours de plusieurs actions boursieres a partir d'une API REST.

## Fonctionnalites

- Recuperation des donnees via `fetch` avec `async/await`
- Affichage graphique des cours avec `Chart.js`
- Comparaison de deux actions sur un meme graphique
- Changement de periode: `1 semaine`, `1 mois`, `1 an`, `tout`
- Changement du type de graphique: `ligne` ou `barres`
- Export des donnees affichees au format `CSV`
- Sauvegarde des preferences utilisateur
- Mode sombre
- Gestion des erreurs reseau, API et donnees invalides

## Stack technique

- `TypeScript`
- `Vite`
- `Chart.js`
- `Bootstrap`

## Architecture

Le projet est separe par responsabilites :

- `src/api/` : appel API et gestion des erreurs
- `src/models/` : typage des donnees
- `src/ui/` : rendu de l'interface
- `src/charts/` : creation et mise a jour du graphique
- `src/main.ts` : orchestration generale de l'application

## Installation

Prerequis :

- `Node.js`
- `npm`

Installer les dependances :

```bash
npm install
```

## Lancement

Demarrer le serveur de developpement :

```bash
npm run dev
```

Construire le projet pour la production :

```bash
npm run build
```

Previsualiser le build :

```bash
npm run preview
```

## Choix techniques

- Le projet est developpe sans framework, conformement au sujet.
- `TypeScript` est utilise en mode strict pour fiabiliser les donnees et limiter les erreurs.
- Les donnees de l'API sont validees avant utilisation.
- L'interface est generee et mise a jour dynamiquement via le DOM.
- `Chart.js` a ete retenu pour produire rapidement un graphique lisible et interactif.
- Les preferences utilisateur et le theme sont sauvegardes dans `localStorage`.
- Les donnees actuellement affichees peuvent etre exportees au format `CSV`.

## API utilisee

Source des donnees :

- `https://keligmartin.github.io/api/stocks.json`

## Etat du projet

Le projet couvre les points principaux du sujet :

- consommation d'API REST
- programmation asynchrone
- manipulation du DOM
- affichage graphique dynamique
- comparaison de deux actions
- gestion des erreurs
