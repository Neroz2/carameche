import { PokemonCard, PokemonSeries, FilterOptions, SortOption } from "@/lib/types";

// Use Vite's import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CARDTRADER_API_URL = "https://api.cardtrader.com/api/v2/products/export";
const CARDTRADER_API_KEY = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTM5MzgiLCJhdWQiOiJhcHA6MTM5MzgiLCJleHAiOjQ4OTU2MzQ3MTcsImp0aSI6IjQxMjA3NmNjLTcyZTEtNDljOC1iODA2LTE3OTJiNmU3N2JhMyIsImlhdCI6MTczOTk2MTExNywibmFtZSI6Ik5lcm96YnJpY2tzIEFwcCAyMDI1MDIwODE3NDkxOSJ9.PkkEXit3MvxmVij_e5Eyz55k_3EYgQF-2ln9goSfMbQD3mIpDVrSkQa010BfnF9IR1L8fvswAyxk56qiUr2LKm2KXX0iKAvVRR373A3XEDwgNtGGBBAR-rxh8raL1hW8e4AH_bps1tVFTrdZ_W-Odg5egSxLFIxnLgi0a9It5KVeVkjdgLmxYuaCXspgml9TXfgJcJ2GH62izvB5eUsAj4NhobpH5q_Pyfbyw2cJu4HmilQjBSOm4NsmRW7Nd692tNT2semj1Oh1UqV1xel2WewtLaWlUAVHYt2LSMWrEw_kx9Yjk9Kz-rM67tk0nXosKklnIigJpcrmRUXf-O7qJA";
const IMAGE_BASE_URL = "https://www.cardtrader.com/images/blueprint/";

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

// Fonction pour mapper les données de l'API CardTrader au format attendu par l'application
const mapCardTraderToAppFormat = (cardData: any): PokemonCard => {
  return {
    id: cardData.id.toString(),
    name: cardData.name_en,
    nameEn: cardData.name_en,
    nameFr: cardData.name_en,
    number: cardData.properties_hash.collector_number || "",
    series: "CardTrader",
    rarity: cardData.properties_hash.pokemon_rarity || "Common",
    image: `${IMAGE_BASE_URL}${cardData.blueprint_id}.jpg`,
    price: cardData.price_cents / 100,
    stock: cardData.quantity,
    condition: cardData.properties_hash.condition || "Near Mint",
    language: cardData.properties_hash.pokemon_language?.toUpperCase() || "EN",
    isHolo: false,
    isReverse: cardData.properties_hash.pokemon_reverse || false,
    isPromo: false
  };
};

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
    console.log("Tentative de récupération des cartes depuis CardTrader API...");
    const headers = {
      "Authorization": `Bearer ${CARDTRADER_API_KEY}`
    };

    const response = await fetch(CARDTRADER_API_URL, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Données récupérées de CardTrader:", data);

    if (!Array.isArray(data)) {
      throw new Error("Format de données CardTrader inattendu");
    }

    // Convertir les données de CardTrader au format de notre application
    let allCards = data.map(mapCardTraderToAppFormat);
    
    // Filtrer les cartes selon les critères
    let filteredCards = [...allCards];
    
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
  } catch (error) {
    console.error("Error fetching Pokemon cards from CardTrader:", error);
    console.log("Utilisation des données de démonstration pour les cartes");
    
    // Utiliser les données mockées en cas d'erreur
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
    console.log(`Tentative de récupération de la carte ${id} depuis CardTrader API...`);
    const headers = {
      "Authorization": `Bearer ${CARDTRADER_API_KEY}`
    };

    const response = await fetch(CARDTRADER_API_URL, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error("Format de données CardTrader inattendu");
    }

    // Chercher la carte par ID
    const cardData = data.find(card => card.id.toString() === id);
    
    if (!cardData) {
      return null;
    }
    
    return mapCardTraderToAppFormat(cardData);
  } catch (error) {
    console.error(`Error fetching Pokemon card with id ${id} from CardTrader:`, error);
    console.log("Utilisation des données de démonstration pour la carte");
    
    // Chercher la carte dans les données mockées
    const mockCard = MOCK_CARDS.find(card => card.id === id);
    return mockCard || null;
  }
};
