import seriesTranslations from "@/data/series-translations.json";
import { fetchPokemonCards } from "@/lib/api";
import { PokemonCard } from "@/lib/types";

export const getSeriesTranslation = (seriesName: string) => {
  const translations = seriesTranslations.translations as Record<string, { 
    fr: string, 
    logo?: string, 
    block?: string,
    releaseDate?: string,
    totalCards?: number,
    description?: string
  }>;
  
  return {
    fr: translations[seriesName]?.fr || seriesName,
    logo: translations[seriesName]?.logo || "",
    block: translations[seriesName]?.block || 'Autre',
    releaseDate: translations[seriesName]?.releaseDate,
    totalCards: translations[seriesName]?.totalCards,
    description: translations[seriesName]?.description
  };
};

// Fonction pour obtenir le nombre de cartes en stock pour une série
export const getSeriesCardCount = async (seriesName: string): Promise<number> => {
  try {
    const { total } = await fetchPokemonCards(seriesName);
    return total;
  } catch (error) {
    console.error(`Erreur lors du décompte des cartes pour la série ${seriesName}:`, error);
    return 0;
  }
};

// Fonction pour obtenir le nombre total de cartes uniques dans l'inventaire
export const getTotalUniqueCardsCount = async (): Promise<number> => {
  try {
    const { total } = await fetchPokemonCards();
    return total;
  } catch (error) {
    console.error("Erreur lors du décompte des cartes uniques:", error);
    return 0;
  }
};

// Fonction pour obtenir les cartes par région
export const getCardsByRegion = async (regionId: string, page = 1, pageSize = 12) => {
  // Définir les plages de numéros Pokémon pour chaque région
  const regionRanges: Record<string, [number, number]> = {
    kanto: [1, 151],
    johto: [152, 251],
    hoenn: [252, 386],
    sinnoh: [387, 493],
    unova: [494, 649],
    kalos: [650, 721],
    alola: [722, 809],
    galar: [810, 905],
    paldea: [906, 1025],
  };
  
  // Récupérer la plage pour la région demandée ou utiliser une plage par défaut
  const range = regionRanges[regionId] || [1, 1025];
  
  try {
    // En production, il faudrait filtrer par numéro de Pokémon dans l'API
    // Pour l'instant, cela renvoie simplement des cartes génériques
    const { cards, total } = await fetchPokemonCards("", page, pageSize);
    
    return { cards, total };
  } catch (error) {
    console.error(`Erreur lors de la récupération des cartes pour la région ${regionId}:`, error);
    return { cards: [], total: 0 };
  }
};

// Fonction pour traduire les noms des Pokémon pour toutes les cartes
export const translatePokemonNames = (cards: PokemonCard[]): PokemonCard[] => {
  return cards.map(card => {
    // Conserver les données originales
    const translatedCard = { ...card };
    
    // Traduire le nom du Pokémon si nécessaire
    // Cette fonction peut être étendue avec un dictionnaire de traductions ou une API
    if (card.name && !card.translatedName) {
      translatedCard.translatedName = getPokemonTranslation(card.name);
    }
    
    return translatedCard;
  });
};

// Fonction pour obtenir la traduction d'un nom de Pokémon
export const getPokemonTranslation = (pokemonName: string): string => {
  // Dictionnaire des traductions de noms de Pokémon les plus communs
  // Cette liste peut être étendue ou remplacée par une API de traduction
  const pokemonTranslations: Record<string, string> = {
    "Bulbasaur": "Bulbizarre",
    "Ivysaur": "Herbizarre",
    "Venusaur": "Florizarre",
    "Charmander": "Salamèche",
    "Charmeleon": "Reptincel",
    "Charizard": "Dracaufeu",
    "Squirtle": "Carapuce",
    "Wartortle": "Carabaffe",
    "Blastoise": "Tortank",
    "Pikachu": "Pikachu",
    "Raichu": "Raichu",
    "Mew": "Mew",
    "Mewtwo": "Mewtwo",
    "Eevee": "Évoli",
    "Vaporeon": "Aquali",
    "Jolteon": "Voltali",
    "Flareon": "Pyroli",
    "Espeon": "Mentali",
    "Umbreon": "Noctali",
    "Leafeon": "Phyllali",
    "Glaceon": "Givrali",
    "Sylveon": "Nymphali",
    "Lugia": "Lugia",
    "Ho-Oh": "Ho-Oh",
    "Celebi": "Celebi",
    "Kyogre": "Kyogre",
    "Groudon": "Groudon",
    "Rayquaza": "Rayquaza",
    "Lucario": "Lucario",
    "Darkrai": "Darkrai",
    "Arceus": "Arceus",
    "Zekrom": "Zekrom",
    "Reshiram": "Reshiram",
    "Kyurem": "Kyurem",
    "Xerneas": "Xerneas",
    "Yveltal": "Yveltal",
    "Zygarde": "Zygarde",
    "Solgaleo": "Solgaleo",
    "Lunala": "Lunala",
    "Necrozma": "Necrozma",
    "Zacian": "Zacian",
    "Zamazenta": "Zamazenta",
    "Eternatus": "Éthernatos",
    "Calyrex": "Sylveroy",
    "Koraidon": "Koraidon",
    "Miraidon": "Miraidon",
    "Terapagos": "Terapagos",
    "Ogerpon": "Ogerpon",
    "Pecharunt": "Pêcharunt"
  };
  
  // Si le nom existe dans le dictionnaire, retourner la traduction
  if (pokemonName in pokemonTranslations) {
    return pokemonTranslations[pokemonName];
  }
  
  // Si le nom contient "V" ou "VMAX", etc., traiter spécialement
  if (pokemonName.includes(" V ") || pokemonName.endsWith(" V")) {
    const baseName = pokemonName.replace(" V", "");
    const translation = getPokemonTranslation(baseName);
    return translation !== baseName ? `${translation} V` : pokemonName;
  }
  
  if (pokemonName.includes(" VMAX")) {
    const baseName = pokemonName.replace(" VMAX", "");
    const translation = getPokemonTranslation(baseName);
    return translation !== baseName ? `${translation} VMAX` : pokemonName;
  }
  
  if (pokemonName.includes(" VSTAR")) {
    const baseName = pokemonName.replace(" VSTAR", "");
    const translation = getPokemonTranslation(baseName);
    return translation !== baseName ? `${translation} VSTAR` : pokemonName;
  }
  
  if (pokemonName.includes(" GX")) {
    const baseName = pokemonName.replace(" GX", "");
    const translation = getPokemonTranslation(baseName);
    return translation !== baseName ? `${translation} GX` : pokemonName;
  }
  
  if (pokemonName.includes(" EX")) {
    const baseName = pokemonName.replace(" EX", "");
    const translation = getPokemonTranslation(baseName);
    return translation !== baseName ? `${translation} EX` : pokemonName;
  }
  
  // Si aucune traduction n'est trouvée, retourner le nom original
  // Vous pourriez aussi utiliser une API de traduction ici pour les cas non gérés
  return pokemonName;
};
