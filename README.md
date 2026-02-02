# Food Suggester - Générateur de recettes à partir d'ingrédients

Food Suggester est une application web développée avec ReactJS qui permet aux utilisateurs de générer automatiquement des idées de recettes en saisissant les ingrédients disponibles. Elle utilise l’API Spoonacular pour obtenir des suggestions de plats variés, simples et rapides à préparer.

## Fonctionnalités principales

- Recherche de recettes par liste d'ingrédients
- Affichage des recettes avec image, titre et ingrédients manquants
- Détails d'une recette : instructions, temps de cuisson, etc.
- Ajout des recettes préférées aux favoris
- Interface moderne, ergonomique et responsive

## Technologies utilisées

- ReactJS
- Vite
- Spoonacular API
- CSS pur (ou TailwindCSS si utilisé)
- Axios pour les requêtes HTTP

## Installation et lancement du projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/food-suggester-frontend.git
cd food-suggester-frontend
2. Installer les dépendances
bash
Copy
Edit
npm install
# ou
pnpm install
3. Configurer l’environnement
Créer un fichier .env à la racine du projet avec le contenu suivant :

env
Copy
Edit
VITE_SPOONACULAR_API_KEY=VOTRE_CLE_API_ICI
Vous pouvez obtenir une clé gratuite sur : https://spoonacular.com/food-api

4. Lancer l'application
bash
Copy
Edit
npm run dev
# ou
pnpm run dev
L’application sera accessible à l’adresse : http://localhost:5173

Utilisation
Entrer une liste d'ingrédients (ex. : tomate, oignon, œuf)

Visualiser une liste de recettes correspondantes

Cliquer sur une recette pour consulter les détails

Ajouter la recette aux favoris si souhaité

Fonctionnalités futures
Authentification utilisateur

Historique de recherche

Notation des recettes

Ajout manuel de recettes personnalisées

Support multilingue


# Backend - Food Suggester

Ce backend est une API REST développée avec **Node.js** et **Express.js**, qui complète l’application frontend *Food Suggester*. Il permet la gestion des utilisateurs, des recettes favorites, de l’historique de recherche et d'autres fonctionnalités personnalisées non couvertes par l’API Spoonacular.

## Fonctionnalités principales

- Authentification des utilisateurs (JWT)
- Sauvegarde des recettes favorites
- Historique des recherches par utilisateur
- Système de commentaires et de notation
- Middleware de validation et de sécurité
- API RESTful consommable par n’importe quel frontend

## Technologies utilisées

- Node.js
- Express.js
- MySQL ou PostgreSQL (au choix)
- Sequelize (ORM) ou Knex
- JWT (jsonwebtoken)
- bcrypt pour le hachage des mots de passe
- dotenv pour la gestion de l’environnement
- Cors, Helmet, etc. pour la sécurité

## Prérequis

- Node.js >= 18.x
- npm ou pnpm
- Base de données relationnelle (MySQL ou PostgreSQL)
- Un compte Spoonacular (facultatif pour le backend)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/food-suggester-backend.git
cd food-suggester-backend
2. Installer les dépendances
bash
Copy
Edit
npm install
# ou
pnpm install
3. Configurer les variables d’environnement
Créer un fichier .env à la racine :

env
Copy
Edit
PORT=5000
DATABASE_URL=mysql://user:password@localhost:3306/food_suggester
JWT_SECRET=une_chaine_secrete
Adapter la variable DATABASE_URL selon ton SGBD et ton système.

4. Lancer le serveur
bash
Copy
Edit
npm run dev
# ou
pnpm run dev
Le backend sera disponible à l'adresse : http://localhost:5000

Structure du projet
pgsql
Copy
Edit
food-suggester-backend/
├── controllers/
│   └── user.controller.js
│   └── recipe.controller.js
├── routes/
│   └── user.routes.js
│   └── recipe.routes.js
├── models/
├── middlewares/
├── services/
├── config/
│   └── database.js
├── .env
├── server.js
└── README.md
Routes principales
Méthode	Endpoint	Description
POST	/api/auth/register	Inscription utilisateur
POST	/api/auth/login	Connexion utilisateur
GET	/api/recipes/favorites	Obtenir les recettes favorites
POST	/api/recipes/favorites	Ajouter une recette aux favoris
DELETE	/api/recipes/favorites/:id	Supprimer une recette des favoris
GET	/api/history	Voir l’historique de recherche

Sécurité
Les routes protégées nécessitent un token JWT valide dans l'en-tête Authorization.

Les mots de passe sont hachés avec bcrypt.

Utilisation de middlewares (helmet, cors, rate-limiter) pour renforcer la sécurité.

Fonctionnalités futures
Intégration d'une file d’attente pour les suggestions personnalisées

Webhooks pour déclencher des actions côté frontend

Dashboard administrateur

API publique en lecture seule

Auteur
Développé par Vazoniaina
Email : vazoniaina@proton.me

Auteur
Développé par Vazoniaina
Email : vazoniaina@proton.me
