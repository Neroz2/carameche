
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, ChevronDown, Filter, Search, X, LayoutGrid, LayoutList, Star, Minus, Plus } from "lucide-react";
import { PokemonCard, SortOption, FilterOptions, ViewMode, PokemonSeries } from "@/lib/types";
import { fetchPokemonCards, fetchPokemonSeries, fetchExpansions } from "@/lib/api";
import Loader from "@/components/ui/Loader";
import { useCart } from "@/context/CartContext";

// Import componentized parts
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryGrid from "@/components/inventory/InventoryGrid";
import InventoryList from "@/components/inventory/InventoryList";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import InventoryPagination from "@/components/inventory/InventoryPagination";
import InventoryEmpty from "@/components/inventory/InventoryEmpty";

const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [totalCards, setTotalCards] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
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

  // Load all series when the page initializes
  useEffect(() => {
    const loadSeries = async () => {
      try {
        setSeriesLoading(true);
        console.log("Chargement de toutes les séries disponibles...");
        
        // Ensure expansions are loaded first
        await fetchExpansions();
        
        // Get all series (not just those on the first page)
        const seriesData = await fetchPokemonSeries();
        console.log(`${seriesData.length} séries chargées pour l'affichage dans les filtres`);
        
        // Sort series by name
        const sortedSeries = [...seriesData].sort((a, b) => a.name.localeCompare(b.name));
        setSeries(sortedSeries);
      } catch (error) {
        console.error("Erreur lors du chargement des séries:", error);
      } finally {
        setSeriesLoading(false);
      }
    };
    
    loadSeries();
  }, []);

  // Get series parameter from URL
  useEffect(() => {
    const seriesParam = searchParams.get("series");
    if (seriesParam) {
      setFilterOptions(prev => ({
        ...prev,
        series: [seriesParam]
      }));
    }
  }, [searchParams]);

  // Load cards with applied filters
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

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <InventoryHeader 
        totalCards={totalCards}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        sortOption={sortOption}
        setSortOption={setSortOption}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        setSearchParams={setSearchParams}
      />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 mt-6">
        <InventoryFilters 
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          clearFilters={clearFilters}
          series={series}
          seriesLoading={seriesLoading}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />

        <div className="flex-1">
          {loading ? (
            <div className="min-h-[500px] flex items-center justify-center">
              <Loader size="lg" text="Chargement des cartes..." />
            </div>
          ) : cards.length === 0 ? (
            <InventoryEmpty clearFilters={clearFilters} />
          ) : (
            <>
              {viewMode === "grid" ? (
                <InventoryGrid cards={cards} addToCart={addToCart} />
              ) : (
                <InventoryList cards={cards} />
              )}

              <InventoryPagination 
                page={page}
                setPage={setPage}
                totalCards={totalCards}
                pageSize={pageSize}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
