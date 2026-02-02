import { useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Icon } from '@iconify/react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleLogoutClick = () => {
    if (isAuthenticated) {
      setShowLogoutConfirm(true);
    } else {
      navigate('/');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    { text: 'Accueil', icon: 'mdi:home', path: '/home' },
    { text: 'Recherche', icon: 'mdi:silverware-fork-knife', path: '/search' },
    { text: 'Historique', icon: 'mdi:history', path: '/history' },
    { text: 'Favoris', icon: 'mdi:heart', path: '/favorites' },
    { text: 'Profil', icon: 'mdi:account-circle', path: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-orange-50 font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-amber-800 shadow z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button onClick={() => setDrawerOpen(!drawerOpen)} className="p-2 text-white hover:bg-white/20 rounded-lg mr-3">
              <Icon icon="mdi:menu" className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">Food Suggester</h1>
          </div>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-full transition"
          >
            <Icon icon={isAuthenticated ? 'mdi:logout' : 'mdi:login'} className="w-5 h-5" />
            {isAuthenticated ? 'Déconnexion' : 'Connexion'}
          </button>
        </div>
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDrawerOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-72 bg-orange-50 shadow-xl z-50">
            <div className="p-4">
              <div className="flex items-center justify-center mb-6 pt-4">
                <Icon icon="mdi:silverware" className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-amber-900">Food Suggester</h2>
              </div>
              <hr className="border-gray-300 mb-4" />
              <nav className="space-y-2">
                {menuItems.map(({ text, icon, path }) => {
                  const isActive = location.pathname === path;
                  return (
                    <button
                      key={text}
                      onClick={() => {
                        navigate(path);
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive
                          ? 'bg-orange-600/10 text-orange-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon icon={icon} className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-gray-600'}`} />
                      {text}
                    </button>
                  );
                })}
              </nav>
              {isAuthenticated && (
                <>
                  <hr className="border-gray-300 my-4" />
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    <Icon icon="mdi:logout" className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 w-full">
            <div className="flex items-center mb-4">
              <Icon icon="mdi:logout" className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la déconnexion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:logout" className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 pt-20 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-orange-100 text-gray-800 py-6 mt-auto">
        <div className="max-w-sm mx-auto text-center text-sm">
          © {new Date().getFullYear()} Food Suggester - FunnyVazoniaina
        </div>
      </footer>
    </div>
  );
};

export default Layout;
