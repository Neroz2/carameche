
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
