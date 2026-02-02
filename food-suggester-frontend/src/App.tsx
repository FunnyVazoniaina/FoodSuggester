import { useContext, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { Icon } from "@iconify/react";
import { runFirebaseDiagnostics } from "./utils/firebaseDiagnostics";

// Lazy loading des pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));

// Composant de chargement stylé selon votre thème
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#FFF0E5] to-[#fff5eb]">
    <div className="relative">
      <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-full flex items-center justify-center mb-6 shadow-2xl">
        <Icon
          icon="mdi:chef-hat"
          className="w-10 h-10 text-white animate-pulse"
        />
      </div>
      <div className="absolute -inset-2 bg-gradient-to-br from-[#FF6B35] to-[#E85826] rounded-full opacity-20 animate-ping"></div>
    </div>
    <p className="text-[#A0522D] text-xl font-semibold font-serif">
      Préparation en cours...
    </p>
    <div className="mt-4 flex space-x-1">
      <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-bounce delay-200"></div>
    </div>
  </div>
);

// Routes protégées
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Routes publiques (redirige vers home si déjà connecté)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/home" /> : <>{children}</>;
};

function App() {
  // Diagnostic Firebase au chargement (développement uniquement)
  useEffect(() => {
    if (import.meta.env.DEV) {
      runFirebaseDiagnostics();
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Landing page pour les visiteurs non connectés */}
            <Route path="/" element={<LandingPage />} />

            {/* Page d'accueil pour les utilisateurs connectés */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Pages protégées */}
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Pages d'authentification */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
