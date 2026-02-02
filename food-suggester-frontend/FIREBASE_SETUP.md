# Configuration Firebase - Guide Complet

## Résolution de l'erreur "auth/invalid-api-key"

Cette erreur survient lorsque la clé API Firebase est invalide, expirée, ou n'a pas les permissions appropriées.

### ✅ Checklist de Configuration

#### 1. **Vérifier la Clé API Firebase**

- ✅ Aller sur [Firebase Console](https://console.firebase.google.com)
- ✅ Sélectionner votre projet `food-suggester-aa0cb`
- ✅ Aller à **Paramètres du projet** → **Clés API**
- ✅ Vérifier que la clé `VITE_FIREBASE_API_KEY` est correcte et NON expirée
- ✅ Copier la clé dans le fichier `.env`

#### 2. **Activer l'Authentification Google**

- ✅ Aller à **Authentication** → **Sign-in method**
- ✅ Vérifier que **Google** est **ACTIVÉ** (statut: Enabled)
- ✅ S'assurer que le domaine est configuré

#### 3. **Configurer les Restrictions de Domaine (IMPORTANT pour Production)**

En **Firebase Console** → **Paramètres** → **Clés API**:

- ✅ Cliquer sur votre clé de navigateur (Browser key)
- ✅ Aller à **Restrictions de l'application** → **HTTP referrers (web sites)**
- ✅ Ajouter TOUS les domaines où l'app s'exécute:
  - `localhost:5173` (développement local)
  - `localhost:3000` (alternative développement)
  - `*.vercel.app` (si déployé sur Vercel)
  - Votre domaine de production (ex: `app.food-suggester.com`)
  - `*.netlify.app` (si déployé sur Netlify)

#### 4. **Vérifier les Variables d'Environnement**

```bash
# Dans .env (local)
VITE_FIREBASE_API_KEY=AIzaSyA0NcwXS6kNucPfuK4N1SIe67drBRYgagQ
VITE_FIREBASE_AUTH_DOMAIN=food-suggester-aa0cb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=food-suggester-aa0cb
VITE_FIREBASE_APP_ID=1:1085616608330:web:869e52aa10aa549d9c02b3
```

#### 5. **En Production (Déploiement)**

Définir les **secrets/variables d'environnement** chez votre hébergeur:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Docker**: Passer via `--env-file` ou variables Docker

### 🔍 Tests de Diagnostic

#### Test 1: Vérifier que Firebase s'initialise correctement

Ouvrir la console du navigateur (F12) et chercher:

```
✅ Configuration Firebase valide (Projet: food-suggester-aa0cb)
```

#### Test 2: Tester la connexion Google

- Cliquer sur "Se connecter avec Google"
- Observer les logs de la console pour:
  - `🔐 Tentative de connexion Google...`
  - `✅ Traitement utilisateur Firebase:`
  - `✅ Utilisateur connecté avec succès:`

#### Test 3: Vérifier les erreurs

Si vous voyez:

```
❌ Configuration Firebase incomplète
```

→ Les variables `.env` ne sont pas chargées

```
auth/invalid-api-key
```

→ Vérifier la clé API dans Firebase Console

```
auth/operation-not-allowed
```

→ Authentification Google n'est pas activée dans Firebase

### 🐛 Débogage Avancé

1. **Dans `src/firebase.ts`**: Validation automatique de la configuration
2. **Dans `src/pages/LoginPage.tsx`**: Messages d'erreur détaillés
3. **Dans `src/contexts/AuthContext.tsx`**: Mode fallback si le backend ne répond pas

### 📝 Exemple de Configuration Complète

```env
# .env
VITE_FIREBASE_API_KEY=AIzaSyA0NcwXS6kNucPfuK4N1SIe67drBRYgagQ
VITE_FIREBASE_AUTH_DOMAIN=food-suggester-aa0cb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=food-suggester-aa0cb
VITE_FIREBASE_STORAGE_BUCKET=food-suggester-aa0cb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1085616608330
VITE_FIREBASE_APP_ID=1:1085616608330:web:869e52aa10aa549d9c02b3
VITE_FIREBASE_MEASUREMENT_ID=G-K8J19ETTWV
```

### 🚀 Checklist Pré-Déploiement

- [ ] `npm run build` s'exécute sans erreur
- [ ] Console du navigateur affiche ✅ Configuration Firebase valide
- [ ] Connexion Google fonctionne en développement local
- [ ] Variables d'environnement définies chez l'hébergeur
- [ ] Domaine de production ajouté aux restrictions de clé API Firebase
- [ ] Authentification Google reste activée dans Firebase Console

### 💬 Support

Pour plus d'informations:

- [Documentation Firebase](https://firebase.google.com/docs/auth)
- [Erreurs Firebase Auth](https://firebase.google.com/docs/reference/js/auth.errors)
