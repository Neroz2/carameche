import { PokemonCard, PokemonSeries, FilterOptions, SortOption } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const fetchPokemonSeries = async (): Promise<PokemonSeries[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/series`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon series:", error);
    throw error;
  }
};

export const fetchPokemonCards = async (
  options: FilterOptions = {
    search: '',
    series: [],
    rarity: [],
    priceMin: 0,
    priceMax: 1000,
    condition: [],
    language: [],
    isHolo: null,
    isReverse: null,
    isPromo: null,
  },
  page: number = 1,
  limit: number = 100, // Passage à 100 cartes par page comme demandé
  sortOption: SortOption = 'number-asc'
): Promise<PokemonCard[]> => {
  try {
    let url = `${API_BASE_URL}/cards?_page=${page}&_limit=${limit}`;

    // Add search query
    if (options.search) {
      url += `&q=${encodeURIComponent(options.search)}`;
    }

    // Add series filter
    if (options.series && options.series.length > 0) {
      options.series.forEach(series => {
        url += `&series=${encodeURIComponent(series)}`;
      });
    }

    // Add rarity filter
    if (options.rarity && options.rarity.length > 0) {
      options.rarity.forEach(rarity => {
        url += `&rarity=${encodeURIComponent(rarity)}`;
      });
    }

    // Add price range filter
    if (options.priceMin !== undefined) {
      url += `&price_gte=${options.priceMin}`;
    }
    if (options.priceMax !== undefined) {
      url += `&price_lte=${options.priceMax}`;
    }

    // Add condition filter
    if (options.condition && options.condition.length > 0) {
      options.condition.forEach(condition => {
        url += `&condition=${encodeURIComponent(condition)}`;
      });
    }

    // Add language filter
    if (options.language && options.language.length > 0) {
      options.language.forEach(language => {
        url += `&language=${encodeURIComponent(language)}`;
      });
    }

    // Add isHolo filter
    if (options.isHolo !== null) {
      url += `&isHolo=${options.isHolo}`;
    }

     // Add isReverse filter
     if (options.isReverse !== null) {
      url += `&isReverse=${options.isReverse}`;
    }

    // Add isPromo filter
    if (options.isPromo !== null) {
      url += `&isPromo=${options.isPromo}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let cards: PokemonCard[] = await response.json();

    // Sort the cards based on the sortOption
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
    
    // Return the filtered and sorted cards, with pagination
    return sortedCards.slice((page - 1) * limit, page * limit);
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    throw error;
  }
};

export const fetchPokemonCardById = async (id: string): Promise<PokemonCard | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon card with id ${id}:`, error);
    throw error;
  }
};
