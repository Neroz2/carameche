
import { PokemonCard, PokemonSeries, FilterOptions, SortOption } from "@/lib/types";

// Use Vite's import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Données de démonstration pour les séries Pokémon
const MOCK_SERIES: PokemonSeries[] = [
  {
    id: "1",
    name: "Base Set",
    logo: "/placeholder.svg",
    symbol: "/placeholder.svg",
    releaseDate: "1999-01-09",
    totalCards: 102
  },
  {
    id: "2",
    name: "Jungle",
    logo: "/placeholder.svg",
    symbol: "/placeholder.svg",
    releaseDate: "1999-06-16",
    totalCards: 64
  },
  {
    id: "3",
    name: "Fossil",
    logo: "/placeholder.svg",
    symbol: "/placeholder.svg",
    releaseDate: "1999-10-10",
    totalCards: 62
  },
  {
    id: "4",
    name: "Team Rocket",
    logo: "/placeholder.svg",
    symbol: "/placeholder.svg",
    releaseDate: "2000-04-24",
    totalCards: 82
  },
  {
    id: "5",
    name: "Gym Heroes",
    logo: "/placeholder.svg",
    symbol: "/placeholder.svg",
    releaseDate: "2000-08-14",
    totalCards: 132
  }
];

// Données de démonstration pour les cartes Pokémon
const MOCK_CARDS: PokemonCard[] = [
  {
    id: "1",
    name: "Pikachu",
    nameEn: "Pikachu",
    nameFr: "Pikachu",
    number: "25",
    series: "Base Set",
    rarity: "Common",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_55.png",
    price: 9.99,
    stock: 15,
    condition: "Near Mint",
    language: "FR",
    isHolo: false,
    isReverse: false,
    isPromo: false
  },
  {
    id: "2",
    name: "Charizard",
    nameEn: "Charizard",
    nameFr: "Dracaufeu",
    number: "4",
    series: "Base Set",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_14.png",
    price: 299.99,
    stock: 2,
    condition: "Excellent",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
  {
    id: "3",
    name: "Blastoise",
    nameEn: "Blastoise",
    nameFr: "Tortank",
    number: "9",
    series: "Base Set",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_25.png",
    price: 189.99,
    stock: 3,
    condition: "Near Mint",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
  {
    id: "4",
    name: "Venusaur",
    nameEn: "Venusaur",
    nameFr: "Florizarre",
    number: "15",
    series: "Jungle",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_1.png",
    price: 159.99,
    stock: 4,
    condition: "Near Mint",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
  {
    id: "5",
    name: "Mewtwo",
    nameEn: "Mewtwo",
    nameFr: "Mewtwo",
    number: "10",
    series: "Base Set",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_75.png",
    price: 199.99,
    stock: 1,
    condition: "Mint",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
  {
    id: "6",
    name: "Jolteon",
    nameEn: "Jolteon",
    nameFr: "Voltali",
    number: "20",
    series: "Jungle",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_45.png",
    price: 89.99,
    stock: 6,
    condition: "Excellent",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
  {
    id: "7",
    name: "Snorlax",
    nameEn: "Snorlax",
    nameFr: "Ronflex",
    number: "27",
    series: "Jungle",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_143.png",
    price: 79.99,
    stock: 4,
    condition: "Near Mint",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
  {
    id: "8",
    name: "Alakazam",
    nameEn: "Alakazam",
    nameFr: "Alakazam",
    number: "1",
    series: "Base Set",
    rarity: "Rare",
    image: "https://assets.pokemon.com/assets/cms2/img/cards/web/SM9/SM9_EN_65.png",
    price: 129.99,
    stock: 3,
    condition: "Excellent",
    language: "FR",
    isHolo: true,
    isReverse: false,
    isPromo: false
  },
];

// Données de démonstration pour les expansions Pokémon
const MOCK_EXPANSIONS = [
  { id: 1, name: "Base", seriesId: 1 },
  { id: 2, name: "Jungle", seriesId: 1 },
  { id: 3, name: "Fossil", seriesId: 1 },
  { id: 4, name: "Team Rocket", seriesId: 2 },
  { id: 5, name: "Gym Heroes", seriesId: 2 }
];

export const fetchPokemonSeries = async (): Promise<PokemonSeries[]> => {
  try {
    console.log("Tentative de récupération des séries depuis l'API...");
    const response = await fetch(`${API_BASE_URL}/series`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon series:", error);
    console.log("Utilisation des données de démonstration pour les séries");
    return MOCK_SERIES;
  }
};

export const fetchExpansions = async (): Promise<any[]> => {
  try {
    console.log("Tentative de récupération des expansions depuis l'API...");
    const response = await fetch(`${API_BASE_URL}/expansions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon expansions:", error);
    console.log("Utilisation des données de démonstration pour les expansions");
    return MOCK_EXPANSIONS;
  }
};

export const fetchPokemonCards = async (
  seriesFilter: string = '',
  page: number = 1,
  limit: number = 100,
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
  sortOption: SortOption = 'number-asc'
): Promise<{ cards: PokemonCard[], total: number }> => {
  try {
    console.log("Tentative de récupération des cartes depuis l'API...");
    let url = `${API_BASE_URL}/cards?_page=${page}&_limit=${limit}`;

    // Use series filter if provided
    if (seriesFilter) {
      url += `&series=${encodeURIComponent(seriesFilter)}`;
    } else if (options.series && options.series.length > 0) {
      options.series.forEach(series => {
        url += `&series=${encodeURIComponent(series)}`;
      });
    }

    // Add search query
    if (options.search) {
      url += `&q=${encodeURIComponent(options.search)}`;
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

    const cards: PokemonCard[] = await response.json();
    const totalCount = parseInt(response.headers.get('X-Total-Count') || cards.length.toString(), 10);

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
    
    return {
      cards: sortedCards,
      total: totalCount
    };
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    console.log("Utilisation des données de démonstration pour les cartes");
    
    // Filtrer les cartes mockées selon les critères
    let filteredCards = [...MOCK_CARDS];
    
    // Appliquer le filtre de série
    if (seriesFilter) {
      filteredCards = filteredCards.filter(card => card.series === seriesFilter);
    } else if (options.series && options.series.length > 0) {
      filteredCards = filteredCards.filter(card => options.series.includes(card.series));
    }
    
    // Appliquer la recherche
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchLower) || 
        card.nameFr.toLowerCase().includes(searchLower) ||
        card.number.toLowerCase().includes(searchLower)
      );
    }
    
    // Appliquer le filtre de rareté
    if (options.rarity && options.rarity.length > 0) {
      filteredCards = filteredCards.filter(card => options.rarity.includes(card.rarity));
    }
    
    // Appliquer le filtre de prix
    if (options.priceMin !== undefined) {
      filteredCards = filteredCards.filter(card => card.price >= options.priceMin);
    }
    if (options.priceMax !== undefined) {
      filteredCards = filteredCards.filter(card => card.price <= options.priceMax);
    }
    
    // Appliquer le filtre d'état
    if (options.condition && options.condition.length > 0) {
      filteredCards = filteredCards.filter(card => options.condition.includes(card.condition));
    }
    
    // Appliquer le filtre de langue
    if (options.language && options.language.length > 0) {
      filteredCards = filteredCards.filter(card => options.language.includes(card.language));
    }
    
    // Appliquer les filtres spéciaux
    if (options.isHolo !== null) {
      filteredCards = filteredCards.filter(card => card.isHolo === options.isHolo);
    }
    if (options.isReverse !== null) {
      filteredCards = filteredCards.filter(card => card.isReverse === options.isReverse);
    }
    if (options.isPromo !== null) {
      filteredCards = filteredCards.filter(card => card.isPromo === options.isPromo);
    }
    
    // Trier les cartes
    switch (sortOption) {
      case "name-asc":
        filteredCards.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredCards.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "number-asc":
        filteredCards.sort((a, b) => a.number.localeCompare(b.number));
        break;
      case "number-desc":
        filteredCards.sort((a, b) => b.number.localeCompare(a.number));
        break;
      case "price-asc":
        filteredCards.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredCards.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    // Paginer les résultats
    const startIndex = (page - 1) * limit;
    const paginatedCards = filteredCards.slice(startIndex, startIndex + limit);
    
    return {
      cards: paginatedCards,
      total: filteredCards.length
    };
  }
};

export const fetchPokemonCardById = async (id: string): Promise<PokemonCard | null> => {
  try {
    console.log(`Tentative de récupération de la carte ${id} depuis l'API...`);
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
    console.log("Utilisation des données de démonstration pour la carte");
    
    // Chercher la carte dans les données mockées
    const mockCard = MOCK_CARDS.find(card => card.id === id);
    return mockCard || null;
  }
};
