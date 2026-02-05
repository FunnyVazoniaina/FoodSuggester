import { useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Icon } from "@iconify/react";
import NutritionAIChat from "./NutritionAIChat";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleLogoutClick = () => {
    if (isAuthenticated) {
      setShowLogoutConfirm(true);
    } else {
      navigate("/");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    { text: "Accueil", icon: "mdi:home", path: "/home" },
    { text: "Recherche", icon: "mdi:silverware-fork-knife", path: "/search" },
    { text: "Historique", icon: "mdi:history", path: "/history" },
    { text: "Favoris", icon: "mdi:heart", path: "/favorites" },
    { text: "Profil", icon: "mdi:account-circle", path: "/profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200/50 shadow-sm z-50">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center min-w-0">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="md:hidden p-1 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-lg mr-2 sm:mr-3 transition-colors flex-shrink-0"
            >
              <Icon icon="mdi:menu" className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              Food Suggester
            </h1>
          </div>
          {/* Right side buttons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Chat with AI button */}
            <button
              onClick={() => setShowAIChat(true)}
              className="relative overflow-hidden text-white rounded-lg px-2 py-1.5 sm:px-3 md:px-4 sm:py-2 transition-all text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5 md:gap-2 shadow-sm hover:shadow-md hover:scale-105 whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
              title="Discuter avec l'IA"
            >
              <Icon icon="mdi:brain" className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">IA</span>
            </button>

            {/* Desktop logout button */}
            {isAuthenticated && (
              <button
                onClick={handleLogoutClick}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                title="Déconnexion"
              >
                <Icon icon="mdi:logout" className="w-4 h-4 flex-shrink-0" />
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer Mobile */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 border-r border-gray-200/50">
            <div className="p-4">
              <div className="flex items-center justify-center mb-6 pt-4">
                <Icon
                  icon="mdi:silverware"
                  className="w-6 h-6 text-gray-900 mr-2"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  Food Suggester
                </h2>
              </div>
              <hr className="border-gray-200 mb-4" />
              <nav className="space-y-1">
                {menuItems.map(({ text, icon, path }) => {
                  const isActive = location.pathname === path;
                  return (
                    <button
                      key={text}
                      onClick={() => {
                        navigate(path);
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        icon={icon}
                        className={`w-5 h-5 ${isActive ? "text-gray-900" : "text-gray-500"}`}
                      />
                      {text}
                    </button>
                  );
                })}
              </nav>
              {isAuthenticated && (
                <>
                  <hr className="border-gray-200 my-4" />
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
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

      {/* Sidebar Desktop */}
      <aside
        className="hidden md:flex md:fixed md:left-0 md:top-16 md:h-[calc(100vh-64px)] md:flex-col md:bg-white md:border-r md:border-gray-200/50 md:z-40 transition-all duration-300 overflow-hidden"
        style={{ width: sidebarExpanded ? "256px" : "80px" }}
      >
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {menuItems.map(({ text, icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={text}
                  onClick={() => navigate(path)}
                  title={!sidebarExpanded ? text : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    icon={icon}
                    className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-gray-900" : "text-gray-500"}`}
                  />
                  {sidebarExpanded && <span className="min-w-fit">{text}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            title={sidebarExpanded ? "Réduire" : "Développer"}
          >
            <Icon
              icon={sidebarExpanded ? "mdi:chevron-left" : "mdi:chevron-right"}
              className="w-5 h-5"
            />
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-2xl p-7 max-w-sm mx-4 w-full border border-gray-200/50 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                <Icon icon="mdi:logout" className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Confirmer la déconnexion
              </h3>
            </div>

            {/* Body */}
            <p className="text-gray-600 text-sm leading-relaxed mb-7">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous
              reconnecter pour accéder à votre compte.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:logout" className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 pt-16 sm:pt-20 px-3 sm:px-4 md:px-8 py-4 sm:py-8 w-full transition-all duration-300 flex justify-center overflow-x-hidden">
        <div className="w-full max-w-6xl">{children}</div>
      </main>

      {/* AI Chat Modal */}
      <NutritionAIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
};

export default Layout;
