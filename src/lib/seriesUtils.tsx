
import seriesTranslations from "@/data/series-translations.json";

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
