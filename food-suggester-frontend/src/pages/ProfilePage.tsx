import { useState, useEffect, useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { Icon } from "@iconify/react";

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/user/profile");
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch {
        setError("Erreur de récupération des données utilisateur");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    setUpdateError("");
    const updateData: any = {};
    if (name !== user?.name) updateData.name = name;
    if (email !== user?.email) updateData.email = email;
    if (!Object.keys(updateData).length)
      return setUpdateError("Aucune modification");

    try {
      await api.put("/user/profile", updateData);
      setUser((prev) => (prev ? { ...prev, ...updateData } : null));
      setUpdateSuccess("Profil mis à jour");
      setTimeout(() => setEditOpen(false), 2000);
    } catch {
      setUpdateError("Erreur lors de la mise à jour");
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword) {
      return setPasswordError("Veuillez remplir tous les champs");
    }
    if (newPassword.length < 6) {
      return setPasswordError(
        "Le nouveau mot de passe doit contenir au moins 6 caractères",
      );
    }

    try {
      await api.put("/user/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Mot de passe modifié avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => {
        setPasswordChangeOpen(false);
        logout(); // Déconnexion après changement de mot de passe
      }, 2000);
    } catch {
      setPasswordError("Erreur lors du changement de mot de passe");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 md:py-8">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                <Icon icon="mdi:account" className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Mon Profil
                </h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Gérez vos informations personnelles
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <Icon
                icon="mdi:alert-circle"
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium text-sm">Chargement...</p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-700">
                      {user.name?.[0].toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Membre depuis</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              {/* Details Cards */}
              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="mdi:email"
                        className="w-5 h-5 text-gray-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon
                        icon="mdi:account-circle"
                        className="w-5 h-5 text-gray-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nom d'utilisateur</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditOpen(true)}
                  className="w-full py-3 px-4 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:pencil" className="w-4 h-4" />
                  Modifier mes informations
                </button>

                <button
                  onClick={() => setPasswordChangeOpen(true)}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-gray-200"
                >
                  <Icon icon="mdi:lock" className="w-4 h-4" />
                  Changer le mot de passe
                </button>
              </div>
            </div>
          ) : null}

          {/* Edit Modal */}
          {editOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="mdi:pencil"
                        className="w-5 h-5 text-gray-600"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Modifier mon profil
                    </h3>
                  </div>

                  {updateError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                      <Icon
                        icon="mdi:alert-circle"
                        className="w-5 h-5 text-red-600 flex-shrink-0"
                      />
                      <p className="text-red-800 text-sm">{updateError}</p>
                    </div>
                  )}

                  {updateSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-800 text-sm">{updateSuccess}</p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      placeholder="Nom"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      placeholder="Email"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditOpen(false)}
                      className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium text-sm transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Change Modal */}
          {passwordChangeOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon icon="mdi:lock" className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Changer le mot de passe
                    </h3>
                  </div>

                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                      <Icon
                        icon="mdi:alert-circle"
                        className="w-5 h-5 text-red-600 flex-shrink-0"
                      />
                      <p className="text-red-800 text-sm">{passwordError}</p>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                      />
                      <p className="text-green-800 text-sm">
                        {passwordSuccess}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 mb-6">
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                      >
                        <Icon
                          icon={showPasswords ? "mdi:eye-off" : "mdi:eye"}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm pr-10"
                        placeholder="Nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                      >
                        <Icon
                          icon={showPasswords ? "mdi:eye-off" : "mdi:eye"}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPasswordChangeOpen(false)}
                      className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium text-sm transition-colors"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
