import { createContext, useState, useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

  // Configuration axios avec token
  const setupAxiosInterceptors = (token: string) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Fonction pour gérer l'utilisateur Firebase
  const handleFirebaseUser = async (firebaseUser: FirebaseUser) => {
    try {
      console.log("✅ Traitement utilisateur Firebase:", firebaseUser.email);

      const idToken = await firebaseUser.getIdToken();

      const response = await axios.post("/api/auth/google-login", {
        idToken,
        userData: {
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
        },
      });

      console.log("✅ Réponse backend:", response.data);

      const { token, user: backendUser } = response.data;

      // Stocker le token JWT de votre backend
      localStorage.setItem("token", token);
      setupAxiosInterceptors(token);

      setUser(backendUser);
      setIsAuthenticated(true);

      console.log("✅ Utilisateur connecté avec succès:", backendUser);
    } catch (error: any) {
      console.error(
        "⚠️ Erreur lors de la synchronisation avec le backend:",
        error,
      );

      // Mode fallback: utiliser les données Firebase si le backend ne répond pas
      const tempUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Utilisateur Google",
        email: firebaseUser.email || "",
        avatar_url: firebaseUser.photoURL || "",
      };

      setUser(tempUser);
      setIsAuthenticated(true);

      console.log(
        "⚠️ Mode fallback - Utilisation des données Firebase:",
        tempUser,
      );
    }
  };

  // Écouter les changements d'état Firebase
  useEffect(() => {
    console.log("Initialisation AuthContext...");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        "Changement état Firebase:",
        firebaseUser?.email || "Aucun utilisateur",
      );
      setLoading(true);

      if (firebaseUser) {
        // Utilisateur connecté via Firebase
        await handleFirebaseUser(firebaseUser);
      } else {
        // Vérifier s'il y a un token local (connexion classique)
        const token = localStorage.getItem("token");
        if (token) {
          try {
            setupAxiosInterceptors(token);
            // Vérifier la validité du token avec votre backend
            const response = await axios.get("/api/user/profile");
            setUser(response.data);
            setIsAuthenticated(true);
            console.log("Connexion via token local réussie");
          } catch (error) {
            console.log("Token local invalide, nettoyage...");
            // Token invalide, nettoyer
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log("Aucune authentification trouvée");
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Connexion classique (email/password)
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setupAxiosInterceptors(token);

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  // Inscription classique
  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post("/api/auth/register", {
        email,
        password,
        name,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setupAxiosInterceptors(token);

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      console.log("Déconnexion...");

      // Déconnexion Firebase si connecté
      if (auth.currentUser) {
        await auth.signOut();
      }

      // Nettoyer le stockage local
      localStorage.removeItem("token");
      window.location.href = "/";
      delete axios.defaults.headers.common["Authorization"];

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
