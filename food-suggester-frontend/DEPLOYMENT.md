# 🍳 Food Suggester - Guide de Déploiement PWA + Firebase

## 📋 Configuration Pre-Déploiement

### 1. **Variables d'Environnement Firebase**

Assurez-vous que toutes les variables `.env` sont correctement définies:

```env
VITE_FIREBASE_API_KEY=AIzaSyA0NcwXS6kNucPfuK4N1SIe67drBRYgagQ
VITE_FIREBASE_AUTH_DOMAIN=food-suggester-aa0cb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=food-suggester-aa0cb
VITE_FIREBASE_STORAGE_BUCKET=food-suggester-aa0cb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1085616608330
VITE_FIREBASE_APP_ID=1:1085616608330:web:869e52aa10aa549d9c02b3
VITE_FIREBASE_MEASUREMENT_ID=G-K8J19ETTWV
```

### 2. **Configuration Firebase Console**

#### Authentification Google

- ✅ Aller à **Authentication** → **Sign-in method**
- ✅ Vérifier que **Google** est **ENABLED**

#### Restrictions de Clé API

- ✅ Aller à **Settings** → **API Keys**
- ✅ Cliquer sur votre clé de navigateur (Browser key)
- ✅ Sous **Application restrictions**, sélectionner **HTTP referrers (web sites)**
- ✅ Ajouter ces domaines:
  ```
  localhost:5173
  localhost:3000
  *.vercel.app
  *.netlify.app
  votre-domaine.com
  www.votre-domaine.com
  ```

### 3. **Build Local**

```bash
cd food-suggester-frontend

# Installer les dépendances
npm ci

# Build de production
npm run build

# Vérifier les erreurs
npm run lint
```

## 🚀 Déploiement sur Vercel

```bash
# Login à Vercel
vercel login

# Deploy
vercel

# Ou push sur GitHub et déployer automatiquement
git push origin main
```

**Configuration Vercel:**

1. Aller à **Settings** → **Environment Variables**
2. Ajouter toutes les variables `VITE_FIREBASE_*`
3. Redéployer

## 🚀 Déploiement sur Netlify

```bash
# Build
npm run build

# Deploy via Netlify CLI
netlify deploy --prod --dir=dist
```

**Configuration Netlify:**

1. Aller à **Site settings** → **Build & deploy** → **Environment**
2. Ajouter toutes les variables `VITE_FIREBASE_*`
3. Redéployer

## 📱 PWA - Progressive Web App

### Fonctionnalités Activées:

✅ Installation sur l'écran d'accueil
✅ Mode hors ligne (Service Worker)
✅ Mise à jour automatique
✅ Splash screen personnalisé
✅ Icons responsive

### Tester PWA Localement:

```bash
npm run build
npm run preview
```

Ouvrir `http://localhost:4173` et vérifier:

1. Icône "Installer" dans la barre d'adresse
2. Console affiche "L'application est prête à fonctionner hors ligne"

## 🔍 Débogage Firebase

### En Développement:

La console affiche automatiquement:

```
✅ Configuration Firebase valide (Projet: food-suggester-aa0cb)
🔐 Tentative de connexion Google...
✅ Utilisateur connecté avec succès
```

### Erreur: `auth/invalid-api-key`

**Causes possibles:**

- Clé API expirée ou invalide
- Google Authentication pas activée
- Domaine non whitelisté dans restrictions

**Solution:**

1. Vérifier Firebase Console
2. Vérifier les variables d'environnement
3. Redéployer

### Erreur: `auth/operation-not-allowed`

**Cause:** Google Authentication n'est pas activée

**Solution:**

1. Aller à **Authentication** → **Sign-in method**
2. Activer **Google**

## 📦 Checklist Déploiement

- [ ] ✅ Configuration Firebase valide (build sans erreur)
- [ ] ✅ Toutes variables d'environnement définies
- [ ] ✅ Google Authentication activée dans Firebase
- [ ] ✅ Domaine de production ajouté aux restrictions de clé API
- [ ] ✅ PWA fonctionne en mode preview (`npm run preview`)
- [ ] ✅ Connexion Google testé localement
- [ ] ✅ Build production testée (`npm run build && npm run preview`)
- [ ] ✅ Service Worker déclaré dans manifest.json
- [ ] ✅ Icons PWA présents dans public/

## 🐛 Logs Utiles

Ouvrir la console du navigateur (F12) et chercher:

```
✅ Configuration Firebase valide
✅ Utilisateur connecté avec succès
✅ Mode fallback - Utilisation des données Firebase
L'application est prête à fonctionner hors ligne
```

## 📞 Support

Pour plus d'informations, consultez:

- [Documentation PWA Vite](https://vite-pwa-org.netlify.app/)
- [Documentation Firebase Auth](https://firebase.google.com/docs/auth)
- [Troubleshooting Firebase](https://firebase.google.com/docs/reference/js/auth.errors)

---

**Dernière mise à jour:** 01/02/2026
