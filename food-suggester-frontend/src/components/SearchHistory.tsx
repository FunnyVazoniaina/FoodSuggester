import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { historyService } from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryItem {
  id: number;
  ingredients: string;
  searched_at: string;
}

interface SearchHistoryProps {
  onSelectHistory?: (ingredients: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectHistory }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyService.getSearchHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Impossible de récupérer l\'historique des recherches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id: number) => {
    try {
      await historyService.deleteHistoryItem(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting history item:', err);
      setError('Impossible de supprimer cet élément');
    }
  };

  const handleClearHistory = async () => {
    try {
      await historyService.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Impossible de supprimer l\'historique');
    }
  };

  const handleSelectHistory = (ingredients: string) => {
    onSelectHistory?.(ingredients);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Historique des recherches
        </h2>
        <button 
          onClick={handleClearHistory}
          disabled={history.length === 0 || loading}
          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="mdi:delete-sweep" className="w-5 h-5" />
          Tout effacer
        </button>
      </div>
      
      <hr className="border-gray-200 mb-4" />
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Icon icon="mdi:loading" className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        /* Empty State */
        <div className="text-center py-8">
          <Icon icon="mdi:history" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Aucun historique de recherche disponible</p>
        </div>
      ) : (
        /* History List */
        <div className="space-y-2">
          {history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleSelectHistory(item.ingredients)}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {item.ingredients}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(item.searched_at)}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Supprimer"
              >
                <Icon icon="mdi:delete" className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
