
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ListFilter, Star } from "lucide-react";
import { PokemonSeries } from "@/lib/types";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/common/Card";
import { useEffect, useState } from "react";
import seriesTranslations from "@/data/series-translations.json";

interface SeriesGridProps {
  series: PokemonSeries[];
}

const SeriesGrid = ({ series }: SeriesGridProps) => {
  const [sortedSeries, setSortedSeries] = useState<PokemonSeries[]>([]);
  const [sortOption, setSortOption] = useState<string>("name-asc");

  useEffect(() => {
    let sorted = [...series];

    switch (sortOption) {
      case "name-asc":
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted = sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "release-asc":
        sorted = sorted.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        break;
      case "release-desc":
        sorted = sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case "cards-asc":
        sorted = sorted.sort((a, b) => a.totalCards - b.totalCards);
        break;
      case "cards-desc":
        sorted = sorted.sort((a, b) => b.totalCards - a.totalCards);
        break;
      default:
        break;
    }

    setSortedSeries(sorted);
  }, [series, sortOption]);

  // Vérification des données
  console.log(`SeriesGrid: Affichage de ${series.length} séries`);
  
  // Fonction pour obtenir le logo depuis le fichier de traduction
  const getSeriesLogo = (seriesName: string) => {
    const translations = seriesTranslations.translations as Record<string, {fr: string, logo: string}>;
    return translations[seriesName]?.logo || "";
  };
  
  // Fonction pour obtenir la traduction française
  const getSeriesFrName = (seriesName: string) => {
    const translations = seriesTranslations.translations as Record<string, {fr: string, logo: string}>;
    return translations[seriesName]?.fr || seriesName;
  };
  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
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

      {sortedSeries.length === 0 ? (
        <div className="bg-card rounded-lg border p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Aucune série trouvée</h3>
          <p className="text-muted-foreground">
            Les séries Pokémon apparaîtront ici une fois chargées.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSeries.map((item) => (
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
                    src={getSeriesLogo(item.name) || item.logo} 
                    alt={`${item.name} series logo`}
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
                      textNode.textContent = getSeriesFrName(item.name);
                      target.parentNode?.appendChild(textNode);
                      target.onerror = null;
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="truncate">
                    {getSeriesFrName(item.name)}
                    {item.name !== getSeriesFrName(item.name) && (
                      <span className="text-sm text-muted-foreground block mt-1">{item.name}</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(item.releaseDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {item.totalCards} cartes
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end border-t mt-2">
                  <span className="flex items-center text-sm text-primary group-hover:underline">
                    Voir les cartes
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default SeriesGrid;
