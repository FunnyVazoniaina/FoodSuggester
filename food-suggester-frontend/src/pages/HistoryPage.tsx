import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FloatingChatButton from "../components/FloatingChatButton";
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
  const [swipedItemId, setSwipedItemId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
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
    return format(date, "dd MMM yyyy 'à' HH:mm", { locale: fr });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent, itemId: number) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      // Swipe left
      setSwipedItemId(itemId);
    } else if (diff < -50) {
      // Swipe right
      setSwipedItemId(null);
    }
  };

  return (
    <>
      <Layout>
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:history" className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Historique des recherches
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base mt-1">
                    Vos recherches précédentes
                  </p>
                </div>
              </div>
            </div>

            {/* Stats & Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                  <Icon icon="mdi:counter" className="w-4 h-4" />
                  {history.length}{" "}
                  {history.length === 1 ? "recherche" : "recherches"}
                </div>
              </div>

              <button
                onClick={() => setConfirmClearAll(true)}
                disabled={history.length === 0 || loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border border-red-200 hover:border-red-300"
              >
                <Icon icon="mdi:delete-outline" className="w-4 h-4 mr-2" />
                Tout effacer
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 fade-in">
                <div className="flex gap-3">
                  <Icon
                    icon="mdi:alert-circle"
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-red-800 font-medium text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium text-sm">
                  Chargement...
                </p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon icon="mdi:inbox" className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun historique
                </h3>
                <p className="text-gray-600 text-sm">
                  Vos recherches apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden fade-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onTouchStart={(e) => handleTouchStart(e)}
                    onTouchEnd={(e) => handleTouchEnd(e, item.id)}
                  >
                    {/* Swipe background (delete button) */}
                    <div className="absolute inset-y-0 right-0 bg-red-500 flex items-center justify-end pr-4 md:hidden">
                      <Icon
                        icon="mdi:trash-can"
                        className="w-6 h-6 text-white"
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={`relative bg-white p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer`}
                      onClick={() =>
                        handleSearchWithIngredients(item.ingredients)
                      }
                      style={{
                        transform:
                          swipedItemId === item.id
                            ? "translateX(-80px)"
                            : "translateX(0)",
                        transition: "transform 0.2s ease-out",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 break-words">
                          {item.ingredients}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          {formatDate(item.searched_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSearchWithIngredients(item.ingredients);
                          }}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors hidden sm:block"
                          title="Rechercher"
                        >
                          <Icon icon="mdi:magnify" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSwipedItemId(null);
                            setConfirmDelete(item.id);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors hidden sm:block"
                          title="Supprimer"
                        >
                          <Icon
                            icon="mdi:trash-can-outline"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Mobile delete button */}
                    {swipedItemId === item.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(item.id);
                        }}
                        className="absolute inset-y-0 right-0 bg-red-500 text-white px-4 flex items-center justify-center md:hidden z-10"
                      >
                        <Icon icon="mdi:trash-can" className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal de confirmation pour supprimer un élément */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-sm w-full border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:alert" className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        Supprimer cette recherche ?
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Vous ne pouvez pas annuler cette action.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleDeleteItem(confirmDelete)}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-sm transition-colors"
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
              <div className="bg-white rounded-xl shadow-lg max-w-sm w-full border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="mdi:alert" className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        Effacer tout l'historique ?
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setConfirmClearAll(false)}
                      className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleClearHistory}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-sm transition-colors"
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
      <FloatingChatButton />
    </>
  );
};

export default HistoryPage;
