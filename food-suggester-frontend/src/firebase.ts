import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validation de la configuration Firebase
function validateFirebaseConfig() {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];

  const missingKeys = requiredKeys.filter(
    (key) => !firebaseConfig[key as keyof typeof firebaseConfig],
  );

  if (missingKeys.length > 0) {
    console.error(
      "❌ Configuration Firebase incomplète. Clés manquantes:",
      missingKeys,
      "\nVérifiez votre fichier .env et assurez-vous que toutes les variables VITE_FIREBASE_* sont définies.",
    );
    throw new Error(
      `Configuration Firebase invalide: ${missingKeys.join(", ")} manquants`,
    );
  }

  console.log(
    "✅ Configuration Firebase valide",
    `(Projet: ${firebaseConfig.projectId})`,
  );
}

// Validation au chargement
try {
  validateFirebaseConfig();
} catch (error) {
  console.error("Erreur d'initialisation Firebase:", error);
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configuration du provider Google
provider.setCustomParameters({
  prompt: "select_account",
});

export { auth, provider };
