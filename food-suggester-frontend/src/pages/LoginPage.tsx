import { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Icon } from "@iconify/react";
import { signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../firebase";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password)
      return setError("Veuillez remplir tous les champs");

    try {
      setLoading(true);
      setError("");
      await login(email, password);
      // La redirection sera gérée par l'useEffect ci-dessus
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔐 Tentative de connexion Google...");
      await signInWithRedirect(auth, provider);
      // L'AuthContext gérera automatiquement la suite
    } catch (err: any) {
      console.error("❌ Erreur login Google:", err);

      // Messages d'erreur spécifiques
      let errorMessage = "Erreur lors de la connexion avec Google";

      if (err.code === "auth/invalid-api-key") {
        errorMessage =
          "Configuration Firebase invalide. Vérifiez votre clé API.";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage =
          "Connexion Google non activée. Contactez l'administrateur.";
      } else if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Connexion annulée par l'utilisateur.";
        setError("");
        setLoading(false);
        return;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9EC] p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8">
        <div className="text-center mb-6">
          <Icon
            icon="mdi:silverware-fork-knife"
            className="text-[#FF6B35]"
            width="64"
            height="64"
          />
          <h1 className="text-3xl font-semibold text-[#4A4238] mt-2 font-poppins">
            Food Suggester
          </h1>
          <p className="text-gray-500 font-poppins">
            Connectez-vous à votre compte
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 mb-4 font-medium font-poppins text-[#4A4238] hover:bg-gray-100 transition"
        >
          <Icon icon="logos:google-icon" width="20" className="mr-2" />
          {loading ? "Connexion en cours..." : "Se connecter avec Google"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 font-poppins">ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-poppins"
              placeholder="Adresse email"
            />
            <Icon
              icon="mdi:email"
              className="absolute left-3 top-3.5 text-gray-400"
              width="20"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-poppins"
              placeholder="Mot de passe"
            />
            <Icon
              icon="mdi:lock"
              className="absolute left-3 top-3.5 text-gray-400"
              width="20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                width="20"
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-medium font-poppins shadow-md hover:bg-opacity-90 transition"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm font-poppins text-gray-600">
          Pas encore de compte ?{" "}
          <RouterLink
            to="/register"
            className="text-[#FF6B35] hover:underline font-medium"
          >
            Inscrivez-vous
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
