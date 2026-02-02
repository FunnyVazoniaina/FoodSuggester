import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { historyService } from "../services/api";

interface HistoryItem {
  id: number;
  ingredients: string;
  searched_at: string;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getSearchHistory();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Impossible de récupérer l'historique des recherches");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await historyService.deleteHistoryItem(id);
      setHistory(history.filter((item) => item.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting history item:", err);
      setError("Impossible de supprimer cet élément");
    }
  };

  const handleClearHistory = async () => {
    try {
      await historyService.clearHistory();
      setHistory([]);
      setConfirmClearAll(false);
    } catch (err) {
      console.error("Error clearing history:", err);
      setError("Impossible de supprimer l'historique");
    }
  };

  const handleSearchWithIngredients = (ingredients: string) => {
    navigate(`/search?ingredients=${encodeURIComponent(ingredients)}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy à HH:mm", { locale: fr });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-4 shadow-lg">
              <Icon icon="mdi:history" className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold text-brown-800 font-poppins mb-2">
              Historique des recherches
            </h1>
            <p className="text-gray-600 font-poppins text-lg max-w-2xl mx-auto">
              Retrouvez toutes vos recherches précédentes et relancez-les
              facilement
            </p>
          </div>

          {/* Stats & Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-3 shadow-sm">
              {history.length > 0 ? (
                <span className="inline-flex items-center text-brown-700 font-poppins font-medium">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Icon
                      icon="mdi:database"
                      className="w-4 h-4 text-orange-600"
                    />
                  </div>
                  {history.length} recherche{history.length > 1 ? "s" : ""}{" "}
                  enregistrée{history.length > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-gray-500 font-poppins">
                  Aucune recherche
                </span>
              )}
            </div>

            <button
              onClick={() => setConfirmClearAll(true)}
              disabled={history.length === 0 || loading}
              className="group inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
            >
              <Icon
                icon="mdi:delete-sweep"
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
              />
              Tout effacer
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 p-6 mb-8 rounded-2xl shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4 shadow-sm">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-6 h-6 text-white"
                  />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold font-poppins text-lg">
                    Erreur
                  </h3>
                  <p className="text-red-700 font-poppins">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-orange-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-brown-700 text-xl font-poppins font-medium">
                  Chargement de l'historique...
                </p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Icon
                    icon="mdi:history"
                    className="w-16 h-16 text-orange-400"
                  />
                </div>
                <h3 className="text-2xl font-bold text-brown-700 mb-3 font-poppins">
                  Aucun historique disponible
                </h3>
                <p className="text-gray-600 font-poppins text-lg max-w-md mx-auto">
                  Vos recherches d'ingrédients apparaîtront ici pour que vous
                  puissiez les retrouver facilement
                </p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid gap-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-gradient-to-r from-white to-orange-50/30 p-6 rounded-2xl hover:from-orange-50 hover:to-amber-50 border border-orange-100/50 hover:border-orange-200 cursor-pointer transition-all duration-300 hover:shadow-lg"
                      onClick={() =>
                        handleSearchWithIngredients(item.ingredients)
                      }
                    >
                      {/* Background decorative element */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full -translate-y-6 translate-x-6 group-hover:scale-110 transition-transform duration-300"></div>

                      <div className="relative flex items-center justify-between">
                        <div className="flex-1 flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-105 transition-all duration-300 shadow-lg">
                            <Icon
                              icon="mdi:chef-hat"
                              className="w-8 h-8 text-white"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-brown-800 text-xl mb-2 group-hover:text-brown-900 transition-colors font-poppins line-clamp-2">
                              {item.ingredients}
                            </h3>
                            <div className="flex items-center">
                              <div className="flex items-center bg-orange-100/80 px-3 py-1 rounded-full">
                                <Icon
                                  icon="mdi:clock-outline"
                                  className="w-4 h-4 mr-2 text-orange-600"
                                />
                                <span className="text-sm text-orange-700 font-poppins font-medium">
                                  {formatDate(item.searched_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSearchWithIngredients(item.ingredients);
                            }}
                            className="p-3 text-orange-500 hover:text-orange-600 hover:bg-orange-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Rechercher avec ces ingrédients"
                          >
                            <Icon icon="mdi:magnify" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(item.id);
                            }}
                            className="p-3 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Supprimer"
                          >
                            <Icon
                              icon="mdi:delete-outline"
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer hint */}
          {history.length > 0 && (
            <div className="text-center mt-8">
              <div className="inline-flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40 shadow-sm">
                <Icon
                  icon="mdi:lightbulb-outline"
                  className="w-4 h-4 mr-2 text-amber-600"
                />
                <p className="text-brown-600 text-sm font-poppins font-medium">
                  Cliquez sur une recherche pour la relancer automatiquement
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal de confirmation pour supprimer un élément */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <Icon
                      icon="mdi:delete-outline"
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white font-poppins">
                    Confirmer la suppression
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-700 mb-6 font-poppins text-lg">
                  Êtes-vous sûr de vouloir supprimer cette recherche de votre
                  historique ?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-200 font-poppins"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDeleteItem(confirmDelete)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl font-poppins"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation pour tout effacer */}
        {confirmClearAll && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <Icon
                      icon="mdi:delete-sweep"
                      className="w-6 h-6 text-white"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white font-poppins">
                    Effacer tout l'historique
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-700 mb-6 font-poppins text-lg">
                  Êtes-vous sûr de vouloir supprimer tout votre historique de
                  recherche ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmClearAll(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-200 font-poppins"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl font-poppins"
                  >
                    Tout effacer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
