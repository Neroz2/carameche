
import seriesTranslations from "@/data/series-translations.json";
import { fetchPokemonCards } from "@/lib/api";

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
