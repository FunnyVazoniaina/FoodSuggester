import { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { AuthContext } from "../contexts/AuthContext";

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  icon,
  endIcon,
  onEndIconClick,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon: string;
  endIcon?: string;
  onEndIconClick?: () => void;
  placeholder?: string;
  error?: string;
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon icon={icon} className="w-5 h-5 text-gray-400" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:border-orange-500 outline-none transition-colors ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-orange-500"
        }`}
      />
      {endIcon && (
        <button
          type="button"
          onClick={onEndIconClick}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Icon
            icon={endIcon}
            className="w-5 h-5 text-gray-400 hover:text-gray-600"
          />
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
        <Icon icon="mdi:alert-circle" className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

const RegisterPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const steps = ["Informations personnelles", "Sécurité"];

  // Validations instantanées
  const validateEmail = (emailValue: string) => {
    if (!emailValue) return "L'email est requis";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue))
      return "Veuillez entrer une adresse email valide";
    return "";
  };

  const validateName = (nameValue: string) => {
    if (!nameValue) return "Le nom est requis";
    if (nameValue.length < 2)
      return "Le nom doit contenir au moins 2 caractères";
    return "";
  };

  const validatePassword = (passwordValue: string) => {
    if (!passwordValue) return "Le mot de passe est requis";
    if (passwordValue.length < 8) return "Minimum 8 caractères";
    if (!/[A-Z]/.test(passwordValue)) return "Au moins 1 majuscule";
    if (!/[0-9]/.test(passwordValue)) return "Au moins 1 chiffre";
    return "";
  };

  const validateConfirmPassword = (
    confirmValue: string,
    passwordValue: string,
  ) => {
    if (!confirmValue) return "Confirmez le mot de passe";
    if (confirmValue !== passwordValue)
      return "Les mots de passe ne correspondent pas";
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setFieldErrors((prev) => ({ ...prev, name: validateName(value) }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setFieldErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
      confirmPassword: confirmPassword
        ? validateConfirmPassword(confirmPassword, value)
        : "",
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value, password),
    }));
  };

  const validateStep1 = () => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    setFieldErrors((prev) => ({ ...prev, name: nameErr, email: emailErr }));

    if (nameErr || emailErr) {
      setError("Veuillez corriger les erreurs");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);
    setFieldErrors((prev) => ({
      ...prev,
      password: passwordErr,
      confirmPassword: confirmErr,
    }));

    if (passwordErr || confirmErr) {
      setError("Veuillez corriger les erreurs");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (activeStep === 0 && validateStep1()) {
      setActiveStep(1);
    } else if (activeStep === 1 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await register(email, password, name);
      navigate("/login", {
        state: {
          message:
            "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        },
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-['Poppins',sans-serif]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Icon
            icon="mdi:silverware-fork-knife"
            className="w-16 h-16 text-orange-500 mx-auto mb-2"
          />
          <h1 className="text-3xl font-semibold text-amber-900 mb-1">
            Food Suggester
          </h1>
          <p className="text-gray-600">Créez votre compte</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= activeStep
                    ? index === activeStep
                      ? "bg-orange-500 text-white"
                      : "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < activeStep ? (
                  <Icon icon="mdi:check" className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    index < activeStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 font-medium">
            {steps[activeStep]}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <Icon
              icon="mdi:alert-circle"
              className="w-5 h-5 text-red-500 flex-shrink-0"
            />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          {activeStep === 0 ? (
            <>
              <InputField
                id="name"
                label="Nom complet"
                value={name}
                onChange={handleNameChange}
                required
                icon="mdi:account"
                placeholder="Entrez votre nom complet"
                error={fieldErrors.name}
              />
              <InputField
                id="email"
                label="Adresse email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                icon="mdi:email"
                placeholder="Entrez votre adresse email"
                error={fieldErrors.email}
              />
            </>
          ) : (
            <>
              <InputField
                id="password"
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                icon="mdi:lock"
                endIcon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                onEndIconClick={() => setShowPassword(!showPassword)}
                placeholder="Entrez votre mot de passe"
                error={fieldErrors.password}
              />
              <InputField
                id="confirmPassword"
                label="Confirmer le mot de passe"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                icon="mdi:lock-check"
                placeholder="Confirmez votre mot de passe"
                error={fieldErrors.confirmPassword}
              />
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <Icon
                  icon="mdi:information-outline"
                  className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                />
                <span className="text-blue-700 text-xs">
                  Le mot de passe doit contenir au moins 8 caractères, 1
                  majuscule et 1 chiffre.
                </span>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={activeStep === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium shadow-lg hover:bg-orange-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {activeStep === steps.length - 1
                ? loading
                  ? "Inscription en cours..."
                  : "S'inscrire"
                : "Suivant"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Déjà un compte ?{" "}
            <RouterLink
              to="/login"
              className="text-orange-500 font-medium hover:underline"
            >
              Connectez-vous
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
