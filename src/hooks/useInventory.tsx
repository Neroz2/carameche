
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PokemonCard, SortOption, FilterOptions, ViewMode, PokemonSeries } from "@/lib/types";
import { fetchPokemonCards, fetchPokemonSeries, fetchExpansions } from "@/lib/api";

export function useInventory() {
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

  const clearFilters = useCallback(() => {
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
  }, [setSearchParams]);

  return {
    cards,
    series,
    loading,
    seriesLoading,
    totalCards,
    page,
    setPage,
    pageSize,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    filterOptions,
    setFilterOptions,
    isFilterOpen,
    setIsFilterOpen,
    clearFilters,
    setSearchParams
  };
}
