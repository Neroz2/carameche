
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ListFilter, Star, Bookmark, Info } from "lucide-react";
import { PokemonSeries } from "@/lib/types";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/common/Card";
import { useEffect, useState } from "react";
import seriesTranslations from "@/data/series-translations.json";
import { getSeriesCardCount } from "@/lib/seriesUtils";

interface SeriesGridProps {
  series: PokemonSeries[];
}

const SeriesGrid = ({ series }: SeriesGridProps) => {
  const [sortedSeries, setSortedSeries] = useState<PokemonSeries[]>([]);
  const [sortOption, setSortOption] = useState<string>("name-asc");
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [seriesCardCounts, setSeriesCardCounts] = useState<Record<string, number>>({});

  // Fonction pour obtenir la traduction française et le bloc pour une série
  const getSeriesTranslation = (seriesName: string) => {
    const translations = seriesTranslations.translations as Record<string, { 
      fr: string, 
      logo: string, 
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

  // Obtenir la liste unique de blocs
  const getUniqueBlocks = () => {
    const blocks = new Set<string>();
    
    series.forEach(item => {
      const { block } = getSeriesTranslation(item.name);
      blocks.add(block);
    });
    
    return Array.from(blocks).sort();
  };

  const blocks = getUniqueBlocks();

  // Charger le nombre de cartes en stock pour chaque série
  useEffect(() => {
    const loadSeriesCardCounts = async () => {
      const counts: Record<string, number> = {};
      for (const item of series) {
        const count = await getSeriesCardCount(item.name);
        counts[item.name] = count;
      }
      setSeriesCardCounts(counts);
    };

    loadSeriesCardCounts();
  }, [series]);

  useEffect(() => {
    let filtered = [...series];
    
    // Filtrer par bloc si nécessaire
    if (selectedBlock !== "all") {
      filtered = filtered.filter(item => {
        const { block } = getSeriesTranslation(item.name);
        return block === selectedBlock;
      });
    }

    switch (sortOption) {
      case "name-asc":
        filtered = filtered.sort((a, b) => {
          const aName = getSeriesTranslation(a.name).fr;
          const bName = getSeriesTranslation(b.name).fr;
          return aName.localeCompare(bName);
        });
        break;
      case "name-desc":
        filtered = filtered.sort((a, b) => {
          const aName = getSeriesTranslation(a.name).fr;
          const bName = getSeriesTranslation(b.name).fr;
          return bName.localeCompare(aName);
        });
        break;
      case "release-asc":
        filtered = filtered.sort((a, b) => {
          const aDate = getSeriesTranslation(a.name).releaseDate || a.releaseDate;
          const bDate = getSeriesTranslation(b.name).releaseDate || b.releaseDate;
          return new Date(aDate).getTime() - new Date(bDate).getTime();
        });
        break;
      case "release-desc":
        filtered = filtered.sort((a, b) => {
          const aDate = getSeriesTranslation(a.name).releaseDate || a.releaseDate;
          const bDate = getSeriesTranslation(b.name).releaseDate || b.releaseDate;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
        break;
      case "cards-asc":
        filtered = filtered.sort((a, b) => {
          const aCards = getSeriesTranslation(a.name).totalCards || a.totalCards;
          const bCards = getSeriesTranslation(b.name).totalCards || b.totalCards;
          return aCards - bCards;
        });
        break;
      case "cards-desc":
        filtered = filtered.sort((a, b) => {
          const bCards = getSeriesTranslation(b.name).totalCards || b.totalCards;
          const aCards = getSeriesTranslation(a.name).totalCards || a.totalCards;
          return bCards - aCards;
        });
        break;
      default:
        break;
    }

    setSortedSeries(filtered);
  }, [series, sortOption, selectedBlock]);

  // Vérification des données
  console.log(`SeriesGrid: Affichage de ${series.length} séries`);
  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 md:gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Séries Pokémon</h2>
            <p className="text-muted-foreground mt-2">
              Explorez toutes les séries de cartes Pokémon disponibles ({series.length})
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center">
              <label htmlFor="sort-series" className="mr-2 text-sm whitespace-nowrap">
                Trier par:
              </label>
              <select
                id="sort-series"
                className="p-2 rounded-md border border-input text-sm bg-background"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="release-desc">Date de sortie (récente)</option>
                <option value="release-asc">Date de sortie (ancienne)</option>
                <option value="cards-desc">Nombre de cartes (décroissant)</option>
                <option value="cards-asc">Nombre de cartes (croissant)</option>
              </select>
            </div>
            <Link 
              to="/inventory" 
              className="flex items-center text-primary hover:underline group"
            >
              Voir tout l'inventaire
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Filtres par bloc */}
        <div className="flex flex-wrap gap-2 bg-muted/30 p-3 rounded-lg border">
          <button
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedBlock === "all" 
                ? "bg-primary text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setSelectedBlock("all")}
          >
            Tous les blocs
          </button>
          {blocks.map(block => (
            <button
              key={block}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center gap-1 ${
                selectedBlock === block 
                  ? "bg-primary text-white" 
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setSelectedBlock(block)}
            >
              <Bookmark size={14} />
              {block}
            </button>
          ))}
        </div>
      </div>

      {sortedSeries.length === 0 ? (
        <div className="bg-card rounded-lg border p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Aucune série trouvée</h3>
          <p className="text-muted-foreground">
            Les séries Pokémon apparaîtront ici une fois chargées.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSeries.map((item) => {
            const { 
              fr: seriesFr, 
              logo: seriesLogo, 
              releaseDate: translatedReleaseDate,
              totalCards: translatedTotalCards,
              description: seriesDescription
            } = getSeriesTranslation(item.name);
            
            // Utiliser les données du fichier de traduction ou les données de l'API
            const releaseDate = translatedReleaseDate || item.releaseDate;
            const totalCards = translatedTotalCards || item.totalCards;
            const stockCount = seriesCardCounts[item.name] || 0;
            
            return (
              <Link 
                key={item.id} 
                to={`/inventory?series=${encodeURIComponent(item.name)}`}
                className="block"
              >
                <Card 
                  interactive 
                  hover3D
                  className="h-full transition-transform duration-300 hover:shadow-xl will-change-transform"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
                    <img 
                      src={seriesLogo || item.logo} 
                      alt={`${seriesFr} series logo`}
                      className="w-full h-full object-contain object-center transition-transform duration-500 hover:scale-110 p-4"
                      onError={(e) => {
                        // Fallback si l'image est introuvable
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                        // Ajouter une classe pour styliser l'image de fallback
                        target.classList.add('fallback-image');
                        // Afficher le nom de la série comme texte alternatif
                        const textNode = document.createElement('div');
                        textNode.className = 'absolute inset-0 flex items-center justify-center text-2xl font-bold text-center p-4';
                        textNode.textContent = seriesFr;
                        target.parentNode?.appendChild(textNode);
                        target.onerror = null;
                      }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="truncate">
                      {seriesFr}
                      {item.name !== seriesFr && (
                        <span className="text-sm text-muted-foreground block mt-1">{item.name}</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {releaseDate ? new Date(releaseDate).toLocaleDateString('fr-FR') : 'Date inconnue'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {totalCards ? `${totalCards} cartes` : 'Nombre inconnu'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Affichage du nombre de cartes en stock */}
                    <div className="mt-2 bg-primary/10 p-2 rounded-md">
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {stockCount} cartes en stock
                        </span>
                      </div>
                    </div>
                    
                    {seriesDescription && (
                      <div className="mt-3 p-2 bg-muted/30 rounded-md">
                        <div className="flex items-start">
                          <Info className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-sm text-muted-foreground line-clamp-2" title={seriesDescription}>
                            {seriesDescription}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="justify-end border-t mt-2">
                    <span className="flex items-center text-sm text-primary group-hover:underline">
                      Voir les cartes
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default SeriesGrid;
