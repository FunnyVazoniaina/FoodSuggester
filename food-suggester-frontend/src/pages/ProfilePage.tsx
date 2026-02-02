import { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Icon } from '@iconify/react';

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
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/user/profile');
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
    setUpdateError('');
    const updateData: any = {};
    if (name !== user?.name) updateData.name = name;
    if (email !== user?.email) updateData.email = email;
    if (!Object.keys(updateData).length) return setUpdateError("Aucune modification");

    try {
      await api.put('/user/profile', updateData);
      setUser(prev => prev ? { ...prev, ...updateData } : null);
      setUpdateSuccess("Profil mis à jour");
      setTimeout(() => setEditOpen(false), 2000);
    } catch {
      setUpdateError("Erreur lors de la mise à jour");
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword) {
      return setPasswordError('Veuillez remplir tous les champs');
    }
    if (newPassword.length < 6) {
      return setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères');
    }

    try {
      await api.put('/user/change-password', {
        currentPassword,
        newPassword
      });
      setPasswordSuccess("Mot de passe modifié avec succès");
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => {
        setPasswordChangeOpen(false);
        logout(); // Déconnexion après changement de mot de passe
      }, 2000);
    } catch {
      setPasswordError("Erreur lors du changement de mot de passe");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-4 shadow-lg">
              <Icon icon="mdi:account-circle" className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-brown-800 font-poppins mb-2">Mon Profil</h1>
            <p className="text-gray-600 font-poppins max-w-md mx-auto">
              Gérez vos informations personnelles et paramètres de compte en toute sécurité.
            </p>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center">
                <Icon icon="mdi:alert-circle" className="text-red-500 mr-3 text-xl flex-shrink-0" />
                <p className="text-red-700 font-poppins text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 font-poppins mt-4 text-lg">Chargement de votre profil...</p>
            </div>
          ) : user ? (
            <div className="max-w-2xl mx-auto">
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
                {/* Cover Section */}
                <div className="h-32 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                      {user.name?.[0].toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-16 pb-8 px-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-brown-800 font-poppins mb-2">{user.name}</h2>
                    <div className="inline-flex items-center bg-orange-50 px-4 py-2 rounded-full">
                      <Icon icon="mdi:calendar" className="mr-2 text-orange-500 text-lg" />
                      <span className="text-sm text-orange-700 font-poppins font-medium">
                        Membre depuis {formatDate(user.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-4 mb-8">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                          <Icon icon="mdi:email" className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-700 font-poppins mb-1">Adresse email</p>
                          <p className="text-brown-900 font-poppins text-lg">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                          <Icon icon="mdi:account" className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-700 font-poppins mb-1">Nom d'utilisateur</p>
                          <p className="text-brown-900 font-poppins text-lg">{user.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 mb-8">
                    <button
                      onClick={() => setEditOpen(true)}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-poppins text-lg group"
                    >
                      <Icon icon="mdi:account-edit" className="mr-3 inline-block text-xl group-hover:scale-110 transition-transform" />
                      Modifier mon profil
                    </button>
                    
                    <button
                      onClick={() => setPasswordChangeOpen(true)}
                      className="w-full py-4 bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 font-semibold rounded-2xl transition-all duration-300 font-poppins text-lg group shadow-sm hover:shadow-md"
                    >
                      <Icon icon="mdi:shield-key" className="mr-3 inline-block text-xl group-hover:scale-110 transition-transform" />
                      Changer le mot de passe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Edit Modal */}
          {editOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                        <Icon icon="mdi:account-edit" className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-white font-poppins">Modifier mon profil</h3>
                    </div>
                    <button
                      onClick={() => setEditOpen(false)}
                      className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Icon icon="mdi:close" className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {updateError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <div className="flex items-center">
                        <Icon icon="mdi:alert-circle" className="text-red-500 mr-3 text-lg flex-shrink-0" />
                        <p className="text-red-700 font-poppins text-sm">{updateError}</p>
                      </div>
                    </div>
                  )}

                  {updateSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <div className="flex items-center">
                        <Icon icon="mdi:check-circle" className="text-green-500 mr-3 text-lg flex-shrink-0" />
                        <p className="text-green-700 font-poppins text-sm">{updateSuccess}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon icon="mdi:account" className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 font-poppins transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nom"
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon icon="mdi:email" className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 font-poppins transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setEditOpen(false)}
                      className="flex-1 px-6 py-4 text-gray-700 font-poppins font-semibold hover:bg-gray-50 rounded-2xl border-2 border-gray-200 transition-all duration-200 hover:border-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-poppins font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
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
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                        <Icon icon="mdi:key-change" className="text-white text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-white font-poppins">Changer le mot de passe</h3>
                    </div>
                    <button
                      onClick={() => setPasswordChangeOpen(false)}
                      className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Icon icon="mdi:close" className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {passwordError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <div className="flex items-center">
                        <Icon icon="mdi:alert-circle" className="text-red-500 mr-3 text-lg flex-shrink-0" />
                        <p className="text-red-700 font-poppins text-sm">{passwordError}</p>
                      </div>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <div className="flex items-center">
                        <Icon icon="mdi:check-circle" className="text-green-500 mr-3 text-lg flex-shrink-0" />
                        <p className="text-green-700 font-poppins text-sm">{passwordSuccess}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon icon="mdi:lock" className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 font-poppins transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Icon icon={showPasswords ? 'mdi:eye-off' : 'mdi:eye'} className="text-gray-400 text-lg" />
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon icon="mdi:lock-plus" className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 font-poppins transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Nouveau mot de passe"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setPasswordChangeOpen(false)}
                      className="flex-1 px-6 py-4 text-gray-700 font-poppins font-semibold hover:bg-gray-50 rounded-2xl border-2 border-gray-200 transition-all duration-200 hover:border-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-poppins font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
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