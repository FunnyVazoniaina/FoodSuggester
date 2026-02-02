import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Script de diagnostic Firebase
 * Exécutez ce script pour vérifier votre configuration Firebase
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export function runFirebaseDiagnostics() {
  console.log("\n🔍 === DIAGNOSTIC FIREBASE ===\n");

  // Test 1: Vérifier les variables d'environnement
  console.log("1️⃣  Vérification des variables d'environnement:");
  const requiredVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  requiredVars.forEach((varName) => {
    const value =
      firebaseConfig[
        varName
          .replace("VITE_FIREBASE_", "")
          .toLowerCase() as keyof typeof firebaseConfig
      ];
    if (value) {
      console.log(`   ✅ ${varName}: ${String(value).substring(0, 20)}...`);
    } else {
      console.log(`   ❌ ${varName}: MANQUANTE`);
    }
  });

  // Test 2: Initialiser Firebase
  console.log("\n2️⃣  Initialisation de Firebase:");
  try {
    const app = initializeApp(firebaseConfig);
    getAuth(app);
    console.log("   ✅ Firebase initialisé avec succès");
    console.log(`   ✅ Projet: ${firebaseConfig.projectId}`);
    console.log(`   ✅ Domaine: ${firebaseConfig.authDomain}`);
  } catch (error: any) {
    console.log("   ❌ Erreur lors de l'initialisation:", error.message);
    return;
  }

  // Test 3: Vérifier la clé API
  console.log("\n3️⃣  Validation de la clé API:");
  if (firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith("AIza")) {
    console.log("   ✅ Format de clé API valide (commence par 'AIza')");
  } else {
    console.log("   ❌ Format de clé API invalide");
  }

  // Test 4: Informations de déploiement
  console.log("\n4️⃣  Informations de déploiement:");
  console.log(`   🌐 Origine actuelle: ${window.location.origin}`);
  console.log(`   🔒 Protocole: ${window.location.protocol}`);
  console.log(`   📍 Hôte: ${window.location.host}`);

  // Conseil
  console.log("\n💡 Conseil:");
  console.log("   Si vous recevez l'erreur 'auth/invalid-api-key', vérifiez:");
  console.log("   1. La clé API dans Firebase Console");
  console.log("   2. Que Google Authentication est activée");
  console.log(
    "   3. Que votre domaine est whitelisté dans les restrictions de clé API",
  );
  console.log("   4. Que les variables .env sont correctement chargées");
  console.log("\n=================================\n");
}

// Auto-exécuter au chargement
if (typeof window !== "undefined") {
  (window as any).firebaseDiagnostics = runFirebaseDiagnostics;
}
