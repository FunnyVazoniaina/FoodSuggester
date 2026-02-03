import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";
import { recipeService } from "../services/api";

/* ── suggestions rapides affichées par défaut ── */
const quickSuggestions = [
  { label: "Tomato", emoji: "🍅" },
  { label: "Potato", emoji: "🥔" },
  { label: "Onion", emoji: "🧅" },
  { label: "Garlic", emoji: "🧄" },
  { label: "Chicken", emoji: "🍗" },
  { label: "Rice", emoji: "🍚" },
  { label: "Egg", emoji: "🥚" },
  { label: "Cheese", emoji: "🧀" },
];

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setFavorites] = useState<number[]>([]);

  /* ── Traiter les paramètres d'URL au montage/changement ── */
  useEffect(() => {
    const urlIngredients = searchParams.get("ingredients");
    if (urlIngredients) {
      // Séparer les ingrédients par virgule et ajouter à l'état
      const ingredientsList = urlIngredients
        .split(",")
        .map((ing) => ing.trim().toLowerCase())
        .filter((ing) => ing.length > 0);

      if (ingredientsList.length > 0) {
        setIngredients(ingredientsList);
        // Lancer la recherche automatiquement
        performSearch(ingredientsList);
      }
    }
  }, [searchParams]);

  /* ── handlers ── */
  const performSearch = async (ingredientsList: string[]) => {
    if (!ingredientsList.length)
      return setError("Ajoutez au moins un ingrédient");
    setLoading(true);
    setError("");
    try {
      const data = await recipeService.suggestRecipes(
        ingredientsList.join(","),
      );
      const favData = await recipeService.getFavorites();
      const favIds = favData.map((f: any) => f.id);
      setFavorites(favIds);
      setRecipes(
        data.map((r: any) => ({ ...r, isFavorite: favIds.includes(r.id) })),
      );
    } catch (err: any) {
      setError(err.message || "Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const val = ingredient.trim().toLowerCase();
    if (val && !ingredients.includes(val)) {
      setIngredients((prev) => [...prev, val]);
      setIngredient("");
    }
  };

  const handleRemove = (ing: string) =>
    setIngredients((prev) => prev.filter((i) => i !== ing));

  const handleSearch = async () => {
    performSearch(ingredients);
  };

  const handleFavoriteToggle = async () => {
    try {
      const favData = await recipeService.getFavorites();
      const favIds = favData.map((f: any) => f.id);
      setFavorites(favIds);
      setRecipes((prev) =>
        prev.map((r) => ({ ...r, isFavorite: favIds.includes(r.id) })),
      );
    } catch (e) {
      console.error(e);
    }
  };

  /* ── derived ── */
  const hasSearched =
    recipes.length > 0 || (ingredients.length > 0 && !loading && !error);

  return (
    <Layout>
      {/* ═══ STYLES ═══ */}
      <style>{`
        /* ── fade-up partagé ── */
        @keyframes fadeUp {
          0%   { opacity:0; transform:translateY(22px); }
          100% { opacity:1; transform:translateY(0);    }
        }
        .fade-up {
          opacity:0;
          animation: fadeUp .65s cubic-bezier(.22,1,.36,1) forwards;
        }
        .d1  { animation-delay:.08s;  }
        .d2  { animation-delay:.18s;  }
        .d3  { animation-delay:.30s;  }
        .d4  { animation-delay:.42s;  }

        /* résultats — stagger par enfant */
        .result-card {
          opacity:0;
          animation: fadeUp .55s cubic-bezier(.22,1,.36,1) forwards;
        }

        /* ── gradient text (même que HomePage) ── */
        .gradient-text {
          background: linear-gradient(135deg,#FF6B35 0%,#E8472C 50%,#c2185b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── bouton primaire (même hero-btn que HomePage) ── */
        .primary-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg,#FF6B35,#E8472C);
          transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(255,107,53,.38);
        }
        .primary-btn::after {
          content:"";
          position:absolute;
          inset:0;
          background: linear-gradient(135deg,#ff8a5c,#FF6B35);
          opacity:0;
          transition: opacity .3s ease;
        }
        .primary-btn:hover::after { opacity:1; }
        .primary-btn > span      { position:relative; z-index:1; }
        .primary-btn:disabled    { opacity:.5; cursor:not-allowed; }
        .primary-btn:disabled:hover { transform:none; box-shadow:none; }

        /* ── blob décoratif ── */
        .blob {
          border-radius:50%;
          filter:blur(72px);
          pointer-events:none;
        }

        /* ── input focus glow ── */
        .search-input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255,107,53,.15);
        }

        /* ── ingredient tag ── */
        .ing-tag {
          transition: transform .2s cubic-bezier(.22,1,.36,1), box-shadow .2s ease;
        }
        .ing-tag:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(255,107,53,.2);
        }

        /* ── quick-pill ── */
        .quick-pill {
          transition: transform .2s cubic-bezier(.22,1,.36,1),
                      background .2s ease, border-color .2s ease;
        }
        .quick-pill:hover {
          transform: translateY(-1px);
          background: #fff0e5;
          border-color: #FF6B35;
        }
        .quick-pill.active {
          background: #fff0e5;
          border-color: #FF6B35;
          color: #c2410c;
        }

        /* ── result card lift ── */
        .rcard {
          transition: transform .28s cubic-bezier(.22,1,.36,1), box-shadow .28s ease;
        }
        .rcard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(74,66,56,.13);
        }

        /* ── spinner ── */
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin .7s linear infinite; }

        /* ── pulse ring ── */
        @keyframes pulseRing {
          0%   { transform:scale(1);   opacity:.4; }
          100% { transform:scale(1.6); opacity:0;  }
        }
        .pulse-ring {
          position:absolute;
          inset:-6px;
          border-radius:50%;
          border: 2px solid #FF6B35;
          animation: pulseRing 1.4s ease-out infinite;
        }
      `}</style>

      {/* ═══ PAGE WRAPPER ═══ */}
      <div className="relative min-h-[60vh]">
        {/* blob atmosphérique — haut droite (lien visuel avec HomePage) */}
        <div
          className="blob absolute"
          style={{
            width: 260,
            height: 260,
            background: "radial-gradient(circle,#ffe0cc 0%,transparent 70%)",
            top: "-70px",
            right: "-70px",
            opacity: 0.45,
            zIndex: 0,
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
          {/* ═══ HEADER ═══ */}
          <div className="text-center mb-10">
            {/* pill badge */}
            <div className="fade-up d1 inline-flex items-center gap-2 bg-[#fff0e5] border border-[#ffe0cc] rounded-full px-4 py-1.5 mb-5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[#A0522D] text-sm font-semibold font-poppins tracking-wide">
                Recherche de recettes
              </span>
            </div>

            {/* titre */}
            <h1 className="fade-up d2 text-4xl md:text-5xl font-bold font-poppins leading-tight mb-3">
              <span className="text-[#4A4238]">Quels </span>
              <span className="gradient-text">ingrédients</span>
              <span className="text-[#4A4238]"> avez-vous ?</span>
            </h1>

            {/* sous-titre */}
            <p className="fade-up d3 text-base text-[#6B5B4E] font-poppins leading-relaxed max-w-lg mx-auto">
              Tapez vos ingrédients disponibles et découvrez des recettes
              adaptées à ce que vous avez.
            </p>
          </div>

          {/* ═══ INPUT ROW ═══ */}
          <div className="fade-up d3 flex gap-2.5 mb-5">
            <div className="relative flex-grow">
              <Icon
                icon="mdi:food-outline"
                width="20"
                height="20"
                className="text-[#9a8578] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                className="search-input w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[#ede5df] bg-white text-[#4A4238] font-poppins text-sm placeholder-[#9a8578] outline-none transition-all"
                placeholder="ex. poulet, riz, tomate…"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!ingredient.trim()}
              className="primary-btn inline-flex items-center gap-1.5 text-white px-5 py-3.5 rounded-2xl font-semibold font-poppins text-sm"
            >
              <span>
                <Icon icon="mdi:plus" width="18" height="18" />
              </span>
              <span>Ajouter</span>
            </button>
          </div>

          {/* ═══ QUICK SUGGESTIONS (visible quand aucun ingrédient) ═══ */}
          {ingredients.length === 0 && (
            <div className="fade-up d4 flex flex-wrap gap-2 justify-center mb-6">
              {quickSuggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() =>
                    setIngredients((prev) =>
                      prev.includes(s.label.toLowerCase())
                        ? prev
                        : [...prev, s.label.toLowerCase()],
                    )
                  }
                  className="quick-pill inline-flex items-center gap-1.5 border border-[#ede5df] bg-white rounded-full px-3.5 py-1.5 text-[#6B5B4E] font-poppins text-sm font-medium"
                >
                  <span>{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* ═══ INGREDIENT TAGS ═══ */}
          {ingredients.length > 0 && (
            <div className="fade-up d4 mb-6">
              {/* header row : compteur + tout effacer */}
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <span className="text-[0.72rem] font-bold uppercase tracking-widest text-[#9a8578]">
                  Vos ingrédients ({ingredients.length})
                </span>
                <button
                  onClick={() => setIngredients([])}
                  className="flex items-center gap-1 text-[0.75rem] text-[#E8472C] font-semibold font-poppins hover:opacity-70 transition-opacity"
                >
                  <Icon
                    icon="mdi:close-circle-outline"
                    width="14"
                    height="14"
                  />
                  Tout effacer
                </button>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="ing-tag inline-flex items-center gap-2 bg-[#fff5ee] border border-[#f5d5c0] rounded-full px-3.5 py-1.5"
                  >
                    <span className="text-[0.78rem] font-semibold text-[#A0522D] font-poppins">
                      {ing}
                    </span>
                    <button
                      onClick={() => handleRemove(ing)}
                      className="w-4 h-4 rounded-full bg-[#ffe0cc] flex items-center justify-center hover:bg-[#ffd0b5] transition-colors"
                    >
                      <Icon
                        icon="mdi:close"
                        width="10"
                        height="10"
                        className="text-[#c2410c]"
                      />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SEARCH BUTTON ═══ */}
          {ingredients.length > 0 && (
            <div className="mb-8">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="primary-btn w-full inline-flex items-center justify-center gap-2.5 text-white px-6 py-3.5 rounded-2xl font-bold font-poppins text-base"
              >
                <span>
                  {loading ? (
                    <Icon
                      icon="mdi:loading"
                      width="20"
                      height="20"
                      className="spin"
                    />
                  ) : (
                    <Icon icon="mdi:magnify" width="20" height="20" />
                  )}
                </span>
                <span>
                  {loading ? "Recherche en cours…" : "Rechercher des recettes"}
                </span>
              </button>
            </div>
          )}

          {/* ═══ ERROR ═══ */}
          {error && (
            <div className="flex items-start gap-3 bg-[#fef2f2] border border-[#fecaca] rounded-2xl px-5 py-4 mb-6">
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#fca5a5] flex items-center justify-center">
                <Icon
                  icon="mdi:alert"
                  width="13"
                  height="13"
                  className="text-[#dc2626]"
                />
              </div>
              <p className="text-sm text-[#991b1b] font-poppins leading-snug">
                {error}
              </p>
            </div>
          )}

          {/* ═══ LOADING ═══ */}
          {loading && (
            <div className="text-center py-14">
              <div className="relative inline-flex items-center justify-center w-14 h-14 mb-5">
                <div className="pulse-ring" />
                <div className="w-14 h-14 rounded-full bg-[#fff5ee] flex items-center justify-center relative z-10">
                  <Icon
                    icon="mdi:loading"
                    width="26"
                    height="26"
                    className="text-[#FF6B35] spin"
                  />
                </div>
              </div>
              <p className="text-sm text-[#6B5B4E] font-poppins">
                On cherche les meilleures recettes pour vous…
              </p>
            </div>
          )}

          {/* ═══ RESULTS ═══ */}
          {!loading && recipes.length > 0 && (
            <div>
              {/* header résultats */}
              <div className="flex items-center justify-between mb-5 px-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#e6f4ea] flex items-center justify-center">
                    <Icon
                      icon="mdi:check-circle"
                      width="15"
                      height="15"
                      className="text-[#2d6a4f]"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#4A4238] font-poppins">
                    {recipes.length} recette{recipes.length > 1 ? "s" : ""}{" "}
                    trouvée{recipes.length > 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setRecipes([]);
                    setIngredients([]);
                  }}
                  className="text-[0.75rem] text-[#9a8578] font-semibold font-poppins hover:text-[#FF6B35] transition-colors"
                >
                  Nouvelle recherche
                </button>
              </div>

              {/* grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipes.map((recipe, idx) => (
                  <div
                    key={recipe.id}
                    className="rcard result-card"
                    style={{ animationDelay: `${0.06 * idx}s` }}
                  >
                    <RecipeCard
                      recipe={recipe}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ NO RESULTS ═══ */}
          {!loading && hasSearched && recipes.length === 0 && !error && (
            <div className="text-center py-14">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFF5EB] mb-5">
                <Icon
                  icon="mdi:silverware-fork-knife"
                  width="32"
                  height="32"
                  className="text-[#FF6B35]"
                />
              </div>
              <h3 className="text-lg font-bold text-[#4A4238] font-poppins mb-2">
                Aucune recette trouvée
              </h3>
              <p className="text-sm text-[#6B5B4E] font-poppins max-w-xs mx-auto mb-5 leading-relaxed">
                Essayez d'ajouter d'autres ingrédients ou de modifier votre
                sélection.
              </p>
              <button
                onClick={() => {
                  setRecipes([]);
                  setIngredients([]);
                  setError("");
                }}
                className="primary-btn inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-semibold font-poppins text-sm"
              >
                <span>
                  <Icon icon="mdi:refresh" width="16" height="16" />
                </span>
                <span>Recommencer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
