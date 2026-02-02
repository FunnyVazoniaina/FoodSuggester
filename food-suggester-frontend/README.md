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

Auteur
Développé par Vazoniaina
Email : vazoniaina@proton.me