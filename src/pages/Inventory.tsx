
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  ShoppingCart, 
  ChevronDown, 
  Filter,
  Search,
  X,
  LayoutGrid,
  LayoutList,
  Plus,
  Minus
} from "lucide-react";
import { PokemonCard, SortOption, FilterOptions, ViewMode, PokemonSeries } from "@/lib/types";
import { fetchPokemonCards, fetchPokemonSeries, fetchExpansions } from "@/lib/api";
import Card, { CardHeader, CardContent, CardFooter } from "@/components/common/Card";
import Button from "@/components/common/Button";
import Loader from "@/components/ui/Loader";
import { useCart } from "@/context/CartContext";
import { Checkbox } from "@/components/ui/checkbox";

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCards, setTotalCards] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100); // Changé à 100 cartes par page
  const [sortOption, setSortOption] = useState<SortOption>("number-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    series: [],
    rarity: [],
    priceMin: 0,
    priceMax: 1000,
    condition: [],
    language: [],
    isHolo: null,
    isReverse: null,
    isPromo: null
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { addToCart } = useCart();

  // Chargement des séries dès l'initialisation de la page
  useEffect(() => {
    const loadSeries = async () => {
      try {
        // S'assurer que les expansions sont chargées avant de récupérer les séries
        await fetchExpansions();
        const seriesData = await fetchPokemonSeries();
        setSeries(seriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des séries:", error);
      }
    };
    
    loadSeries();
  }, []);

  // Récupérer le paramètre de série depuis l'URL
  useEffect(() => {
    const seriesParam = searchParams.get("series");
    if (seriesParam) {
      setFilterOptions(prev => ({
        ...prev,
        series: [seriesParam]
      }));
    }
  }, [searchParams]);

  // Chargement des cartes avec les filtres appliqués
  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        const seriesFilter = filterOptions.series[0] || "";
        const { cards, total } = await fetchPokemonCards(seriesFilter, page, pageSize, filterOptions);
        
        let sortedCards = [...cards];
        switch (sortOption) {
          case "name-asc":
            sortedCards.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            sortedCards.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "number-asc":
            sortedCards.sort((a, b) => a.number.localeCompare(b.number));
            break;
          case "number-desc":
            sortedCards.sort((a, b) => b.number.localeCompare(a.number));
            break;
          case "price-asc":
            sortedCards.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            sortedCards.sort((a, b) => b.price - a.price);
            break;
          default:
            break;
        }
        
        setCards(sortedCards);
        setTotalCards(total);
      } catch (error) {
        console.error("Failed to load cards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [page, pageSize, sortOption, filterOptions]);

  // Remonter en haut de la page lors du changement de page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(prev => ({
      ...prev,
      search: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilterOptions({
      search: "",
      series: [],
      rarity: [],
      priceMin: 0,
      priceMax: 1000,
      condition: [],
      language: [],
      isHolo: null,
      isReverse: null,
      isPromo: null
    });
    
    setSearchParams({});
  };

  const renderListItem = (card: PokemonCard) => (
    <div 
      key={card.id}
      className="bg-card border rounded-md p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
    >
      <div className="w-28 h-40 sm:w-32 sm:h-44 flex-shrink-0 relative">
        <div className={`absolute inset-0 rounded ${
          card.isReverse 
            ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
            : ''
        }`}></div>
        <img
          src={card.image}
          alt={card.nameFr || card.name}
          className="w-full h-full object-cover rounded relative z-10"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-medium">
            {card.rarity}
          </span>
          <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
            # {card.number}
          </span>
          {card.isReverse && (
            <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
              Reverse
            </span>
          )}
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {card.nameFr || card.name} <span className="text-sm text-muted-foreground">#{card.number}</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {card.series}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold whitespace-nowrap">
                {card.price.toFixed(2)} €
              </span>
              <span className="text-xs text-muted-foreground">
                Stock: {card.stock}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {card.condition}
            </span>
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              {card.language}
            </span>
            {card.isHolo && (
              <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded border border-yellow-500/30">
                Holo
              </span>
            )}
            {card.isReverse && (
              <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                Reverse
              </span>
            )}
            {card.isPromo && (
              <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-300 px-2 py-1 rounded border border-red-500/30">
                Promo
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <div className="flex items-center space-x-1">
            <Minus
              size={18}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                if (card.stock > 0) {
                  addToCart(card, -1);
                }
              }}
            />
            <span className="text-sm">1</span>
            <Plus
              size={18}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                if (card.stock > 0) {
                  addToCart(card, 1);
                }
              }}
            />
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (card.stock > 0) {
                addToCart(card, 1);
              }
            }}
            disabled={card.stock === 0}
            icon={<ShoppingCart size={14} />}
            variant={card.stock === 0 ? "outline" : "default"}
          >
            {card.stock === 0 ? "Épuisé" : "Ajouter"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Inventaire des cartes</h1>
          <p className="text-muted-foreground mt-1">
            {totalCards} cartes disponibles
            {filterOptions.series.length > 0 && ` dans la série ${filterOptions.series[0]}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 mt-6">
        <div className="hidden lg:block w-64 space-y-6">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-medium mb-4">Filtres</h3>
            
            <div className="mb-4">
              <label htmlFor="search" className="text-sm font-medium mb-1 block">
                Recherche
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Nom de carte..."
                  className="w-full p-2 pl-8 rounded-md border border-input text-sm"
                  value={filterOptions.search}
                  onChange={handleSearchInput}
                />
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Série
              </label>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {series.map((serie) => (
                  <div key={serie.id} className="flex items-center">
                    <Checkbox
                      id={`series-${serie.id}`}
                      className="mr-2"
                      checked={filterOptions.series.includes(serie.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilterOptions(prev => ({
                            ...prev,
                            series: [...prev.series, serie.name]
                          }));
                        } else {
                          setFilterOptions(prev => ({
                            ...prev,
                            series: prev.series.filter(s => s !== serie.name)
                          }));
                        }
                      }}
                    />
                    <label htmlFor={`series-${serie.id}`} className="text-sm cursor-pointer">
                      {serie.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Plage de prix
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 rounded-md border border-input text-sm"
                  value={filterOptions.priceMin || ""}
                  onChange={(e) => setFilterOptions(prev => ({
                    ...prev,
                    priceMin: Number(e.target.value)
                  }))}
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 rounded-md border border-input text-sm"
                  value={filterOptions.priceMax || ""}
                  onChange={(e) => setFilterOptions(prev => ({
                    ...prev,
                    priceMax: Number(e.target.value)
                  }))}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Rareté
              </label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Promo"].map((rarity) => (
                  <div key={rarity} className="flex items-center">
                    <Checkbox
                      id={`rarity-${rarity}`}
                      className="mr-2"
                      checked={filterOptions.rarity.includes(rarity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilterOptions(prev => ({
                            ...prev,
                            rarity: [...prev.rarity, rarity]
                          }));
                        } else {
                          setFilterOptions(prev => ({
                            ...prev,
                            rarity: prev.rarity.filter(r => r !== rarity)
                          }));
                        }
                      }}
                    />
                    <label htmlFor={`rarity-${rarity}`} className="text-sm cursor-pointer">
                      {rarity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                État
              </label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played"].map((condition) => (
                  <div key={condition} className="flex items-center">
                    <Checkbox
                      id={`condition-${condition}`}
                      className="mr-2"
                      checked={filterOptions.condition.includes(condition)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilterOptions(prev => ({
                            ...prev,
                            condition: [...prev.condition, condition]
                          }));
                        } else {
                          setFilterOptions(prev => ({
                            ...prev,
                            condition: prev.condition.filter(c => c !== condition)
                          }));
                        }
                      }}
                    />
                    <label htmlFor={`condition-${condition}`} className="text-sm cursor-pointer">
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">
                Langue
              </label>
              <div className="space-y-1">
                {["EN", "FR", "JP", "DE", "IT", "ES"].map((language) => (
                  <div key={language} className="flex items-center">
                    <Checkbox
                      id={`language-${language}`}
                      className="mr-2"
                      checked={filterOptions.language.includes(language)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilterOptions(prev => ({
                            ...prev,
                            language: [...prev.language, language]
                          }));
                        } else {
                          setFilterOptions(prev => ({
                            ...prev,
                            language: prev.language.filter(l => l !== language)
                          }));
                        }
                      }}
                    />
                    <label htmlFor={`language-${language}`} className="text-sm cursor-pointer">
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4 space-y-3">
              <label className="text-sm font-medium mb-1 block">
                Caractéristiques spéciales
              </label>
              
              <div className="flex items-center justify-between">
                <label htmlFor="is-reverse" className="text-sm cursor-pointer">
                  Reverse
                </label>
                <div className="relative inline-flex items-center cursor-pointer" onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    isReverse: prev.isReverse === true ? null : true
                  }));
                }}>
                  <input 
                    type="checkbox" 
                    id="is-reverse" 
                    className="sr-only" 
                    checked={filterOptions.isReverse === true}
                    onChange={() => {}}
                  />
                  <div className={`w-10 h-5 rounded-full transition ${
                    filterOptions.isReverse ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-transform ${
                    filterOptions.isReverse ? 'transform translate-x-5' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="is-promo" className="text-sm cursor-pointer">
                  Promo
                </label>
                <div className="relative inline-flex items-center cursor-pointer" onClick={() => {
                  setFilterOptions(prev => ({
                    ...prev,
                    isPromo: prev.isPromo === true ? null : true
                  }));
                }}>
                  <input 
                    type="checkbox" 
                    id="is-promo" 
                    className="sr-only" 
                    checked={filterOptions.isPromo === true}
                    onChange={() => {}}
                  />
                  <div className={`w-10 h-5 rounded-full transition ${
                    filterOptions.isPromo ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-transform ${
                    filterOptions.isPromo ? 'transform translate-x-5' : 'translate-x-1'
                  }`}></div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              fullWidth 
              className="mt-2"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden flex items-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} className="mr-2" />
                Filtres
              </Button>
              
              {filterOptions.series.length > 0 && (
                <div className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm">
                  <span className="mr-2">Série: {filterOptions.series[0]}</span>
                  <button 
                    onClick={() => {
                      setFilterOptions(prev => ({
                        ...prev,
                        series: []
                      }));
                      setSearchParams({});
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center border rounded-md overflow-hidden">
                <button 
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                  onClick={() => setViewMode('grid')}
                  title="Vue en grille"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
                  onClick={() => setViewMode('list')}
                  title="Vue en liste"
                >
                  <LayoutList size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center w-full sm:w-auto">
              <label htmlFor="sort" className="mr-2 text-sm whitespace-nowrap">
                Trier par:
              </label>
              <select
                id="sort"
                className="p-2 rounded-md border border-input text-sm bg-background"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="number-asc">Numéro (croissant)</option>
                <option value="number-desc">Numéro (décroissant)</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="price-asc">Prix (croissant)</option>
                <option value="price-desc">Prix (décroissant)</option>
              </select>
            </div>
          </div>

          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in">
              <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium text-lg">Filtres</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="mobile-search" className="text-sm font-medium mb-1 block">
                      Recherche
                    </label>
                    <div className="relative">
                      <input
                        id="mobile-search"
                        type="text"
                        placeholder="Nom de carte..."
                        className="w-full p-2 pl-8 rounded-md border border-input"
                        value={filterOptions.search}
                        onChange={handleSearchInput}
                      />
                      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Plage de prix
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full p-2 rounded-md border border-input"
                        value={filterOptions.priceMin || ""}
                        onChange={(e) => setFilterOptions(prev => ({
                          ...prev,
                          priceMin: Number(e.target.value)
                        }))}
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full p-2 rounded-md border border-input"
                        value={filterOptions.priceMax || ""}
                        onChange={(e) => setFilterOptions(prev => ({
                          ...prev,
                          priceMax: Number(e.target.value)
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-y-1">
                    <div className="flex items-center">
                      <label className="text-sm font-medium mb-1 block">
                        Rareté
                      </label>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Promo"].map((rarity) => (
                          <div key={rarity} className="flex items-center">
                            <Checkbox
                              id={`rarity-${rarity}`}
                              className="mr-2"
                              checked={filterOptions.rarity.includes(rarity)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    rarity: [...prev.rarity, rarity]
                                  }));
                                } else {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    rarity: prev.rarity.filter(r => r !== rarity)
                                  }));
                                }
                              }}
                            />
                            <label htmlFor={`rarity-${rarity}`} className="text-sm">
                              {rarity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="text-sm font-medium mb-1 block">
                        État
                      </label>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played"].map((condition) => (
                          <div key={condition} className="flex items-center">
                            <Checkbox
                              id={`condition-${condition}`}
                              className="mr-2"
                              checked={filterOptions.condition.includes(condition)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    condition: [...prev.condition, condition]
                                  }));
                                } else {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    condition: prev.condition.filter(c => c !== condition)
                                  }));
                                }
                              }}
                            />
                            <label htmlFor={`condition-${condition}`} className="text-sm">
                              {condition}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="text-sm font-medium mb-1 block">
                        Langue
                      </label>
                      <div className="space-y-1">
                        {["EN", "FR", "JP", "DE", "IT", "ES"].map((language) => (
                          <div key={language} className="flex items-center">
                            <Checkbox
                              id={`language-${language}`}
                              className="mr-2"
                              checked={filterOptions.language.includes(language)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    language: [...prev.language, language]
                                  }));
                                } else {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    language: prev.language.filter(l => l !== language)
                                  }));
                                }
                              }}
                            />
                            <label htmlFor={`language-${language}`} className="text-sm">
                              {language}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <Button 
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Réinitialiser
                    </Button>
                    <Button 
                      onClick={() => setIsFilterOpen(false)} 
                      className="flex-1"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="min-h-[500px] flex items-center justify-center">
              <Loader size="lg" text="Chargement des cartes..." />
            </div>
          ) : cards.length === 0 ? (
            <div className="bg-card rounded-lg border p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Aucune carte trouvée</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres ou d'effectuer une recherche différente.
              </p>
              <Button 
                onClick={clearFilters} 
                variant="outline" 
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cards.map((card) => (
                    <Card 
                      key={card.id} 
                      className={`overflow-hidden h-full transition-all border dark:border-gray-700 ${
                        card.isReverse ? 'bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-500/5' : ''
                      }`}
                    >
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <div className={`absolute inset-0 ${
                          card.isReverse 
                            ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
                            : ''
                        }`}></div>
                        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
                          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                            {card.rarity}
                          </span>
                          <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
                            # {card.number}
                          </span>
                          {card.isReverse && (
                            <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                              Reverse
                            </span>
                          )}
                        </div>
                        <img
                          src={card.image}
                          alt={card.nameFr || card.name}
                          className="w-full h-full object-cover relative z-10"
                          loading="lazy"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div>
                          <h3 className="font-medium truncate">{card.nameFr || card.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {card.series}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-secondary px-2 py-1 rounded">
                            {card.condition}
                          </span>
                          <span className="text-xs bg-secondary px-2 py-1 rounded flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              card.language === 'FR' ? 'bg-blue-500' :
                              card.language === 'JP' ? 'bg-red-500' :
                              card.language === 'EN' ? 'bg-green-500' : 'bg-gray-500'
                            }`}></span>
                            {card.language}
                          </span>
                          {card.isReverse && (
                            <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              Reverse
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3 border-t flex-col items-stretch gap-3">
                        <div className="w-full flex justify-between items-center">
                          <span className="text-lg font-semibold text-primary">
                            {card.price.toFixed(2)} €
                          </span>
                          <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            Stock: {card.stock}
                          </span>
                        </div>
                        <div className="w-full flex gap-2 items-center">
                          <div className="flex items-center border rounded-md dark:border-gray-700 flex-1">
                            <button 
                              className="p-2 hover:bg-muted transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(card, -1);
                              }}
                              disabled={card.stock === 0}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="flex-1 text-center">1</span>
                            <button 
                              className="p-2 hover:bg-muted transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(card, 1);
                              }}
                              disabled={card.stock === 0}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <Button
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (card.stock > 0) {
                                addToCart(card, 1);
                              }
                            }}
                            disabled={card.stock === 0}
                            variant={card.stock === 0 ? "outline" : "default"}
                          >
                            {card.stock === 0 ? "Épuisé" : "Ajouter"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {cards.map(renderListItem)}
                </div>
              )}

              <div className="mt-8 flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm">
                  Page {page} sur {Math.ceil(totalCards / pageSize)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * pageSize >= totalCards}
                >
                  Suivant
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
