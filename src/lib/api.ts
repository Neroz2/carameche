
import { PokemonSeries, PokemonCard } from './types';

const CARDTRADER_API_TOKEN = "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjYXJkdHJhZGVyLXByb2R1Y3Rpb24iLCJzdWIiOiJhcHA6MTM5MzgiLCJhdWQiOiJhcHA6MTM5MzgiLCJleHAiOjQ4OTU2MzQ3MTcsImp0aSI6IjQxMjA3NmNjLTcyZTEtNDljOC1iODA2LTE3OTJiNmU3N2JhMyIsImlhdCI6MTczOTk2MTExNywibmFtZSI6Ik5lcm96YnJpY2tzIEFwcCAyMDI1MDIwODE3NDkxOSJ9.PkkEXit3MvxmVij_e5Eyz55k_3EYgQF-2ln9goSfMbQD3mIpDVrSkQa010BfnF9IR1L8fvswAyxk56qiUr2LKm2KXX0iKAvVRR373A3XEDwgNtGGBBAR-rxh8raL1hW8e4AH_bps1tVFTrdZ_W-Odg5egSxLFIxnLgi0a9It5KVeVkjdgLmxYuaCXspgml9TXfgJcJ2GH62izvB5eUsAj4NhobpH5q_Pyfbyw2cJu4HmilQjBSOm4NsmRW7Nd692tNT2semj1Oh1UqV1xel2WewtLaWlUAVHYt2LSMWrEw_kx9Yjk9Kz-rM67tk0nXosKklnIigJpcrmRUXf-O7qJA";

// Mocked data for initial development
const MOCK_SERIES: PokemonSeries[] = [
  {
    id: "sv1",
    name: "Scarlet & Violet",
    logo: "https://tcg.pokemon.com/assets/img/expansions/scarlet-violet/logos/fr-fr/sv01.png",
    symbol: "https://tcg.pokemon.com/assets/img/expansions/scarlet-violet/symbols/sv01.png",
    releaseDate: "2023-03-31",
    totalCards: 198
  },
  {
    id: "sv2",
    name: "Paldea Evolved",
    logo: "https://tcg.pokemon.com/assets/img/expansions/paldea-evolved/logos/fr-fr/sv02.png",
    symbol: "https://tcg.pokemon.com/assets/img/expansions/paldea-evolved/symbols/sv02.png",
    releaseDate: "2023-06-09",
    totalCards: 198
  },
  {
    id: "sv3",
    name: "Obsidian Flames",
    logo: "https://tcg.pokemon.com/assets/img/expansions/obsidian-flames/logos/fr-fr/sv03.png",
    symbol: "https://tcg.pokemon.com/assets/img/expansions/obsidian-flames/symbols/sv03.png",
    releaseDate: "2023-08-11",
    totalCards: 197
  },
  {
    id: "sv4",
    name: "Paradox Rift",
    logo: "https://tcg.pokemon.com/assets/img/expansions/paradox-rift/logos/fr-fr/sv04.png",
    symbol: "https://tcg.pokemon.com/assets/img/expansions/paradox-rift/symbols/sv04.png",
    releaseDate: "2023-11-03",
    totalCards: 182
  },
  {
    id: "sv5",
    name: "Temporal Forces",
    logo: "https://tcg.pokemon.com/assets/img/expansions/temporal-forces/logos/fr-fr/sv05.png",
    symbol: "https://tcg.pokemon.com/assets/img/expansions/temporal-forces/symbols/sv05.png",
    releaseDate: "2024-03-22",
    totalCards: 177
  },
  {
    id: "sv6",
    name: "Stellar Crown",
    logo: "https://tcg.pokemon.com/assets/img/expansions/crown-zenith/logos/fr-fr/swsh12_5.png",
    symbol: "https://tcg.pokemon.com/assets/img/expansions/crown-zenith/symbols/swsh12_5.png",
    releaseDate: "2024-06-14",
    totalCards: 180
  }
];

// Mock cards data for initial development
const generateMockCards = (count: number): PokemonCard[] => {
  const conditions = ["Mint", "Near Mint", "Excellent", "Good", "Light Played", "Played"];
  const rarities = ["Common", "Uncommon", "Rare", "Ultra Rare", "Secret Rare", "Promo"];
  const series = MOCK_SERIES.map(s => s.name);
  
  return Array.from({ length: count }).map((_, idx) => {
    const id = `card-${idx + 1}`;
    const series_idx = Math.floor(Math.random() * series.length);
    const number = `${Math.floor(Math.random() * 200) + 1}/${MOCK_SERIES[series_idx].totalCards}`;
    const isHolo = Math.random() > 0.7;
    const isReverse = !isHolo && Math.random() > 0.7;
    const isPromo = Math.random() > 0.9;
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const price = Math.round((Math.random() * 50 + 0.5) * 100) / 100;
    const stock = Math.floor(Math.random() * 20) + 1;
    
    // Use placeholder images
    const imageNumber = (idx % 9) + 1; // Using 9 different placeholder images
    const image = `https://archives.bulbagarden.net/media/upload/thumb/f/f5/006Charizard.png/250px-006Charizard.png`;
    
    return {
      id,
      name: `Pokémon #${idx + 1}`,
      nameEn: `Pokémon #${idx + 1}`,
      nameFr: `Pokémon #${idx + 1}`,
      number,
      series: series[series_idx],
      rarity,
      image,
      price,
      stock,
      condition,
      language: Math.random() > 0.7 ? "FR" : "EN",
      isHolo,
      isReverse,
      isPromo
    };
  });
};

const MOCK_CARDS = generateMockCards(100);

export const fetchPokemonSeries = async (): Promise<PokemonSeries[]> => {
  // In a real app, this would call the actual API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_SERIES), 500);
  });
};

export const fetchPokemonCards = async (
  seriesFilter?: string,
  page: number = 1,
  pageSize: number = 24
): Promise<{ cards: PokemonCard[], total: number }> => {
  // In a real app, this would call the actual CardTrader API
  return new Promise((resolve) => {
    let filteredCards = [...MOCK_CARDS];
    
    if (seriesFilter) {
      filteredCards = filteredCards.filter(card => 
        card.series.toLowerCase() === seriesFilter.toLowerCase()
      );
    }
    
    const total = filteredCards.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedCards = filteredCards.slice(start, end);
    
    setTimeout(() => resolve({ cards: paginatedCards, total }), 500);
  });
};

export const fetchCardDetails = async (cardId: string): Promise<PokemonCard | null> => {
  // In a real app, this would call the actual API
  return new Promise((resolve) => {
    const card = MOCK_CARDS.find(card => card.id === cardId) || null;
    setTimeout(() => resolve(card), 300);
  });
};

// Translate card names using PokéAPI (mock for now)
export const translateCardName = async (englishName: string): Promise<string> => {
  // In a real app, this would call the PokéAPI for translations
  return new Promise((resolve) => {
    // Just append "FR" for the mock implementation
    setTimeout(() => resolve(`${englishName} (FR)`), 200);
  });
};
