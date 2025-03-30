
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PokemonSeries } from "@/lib/types";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/common/Card";

interface SeriesGridProps {
  series: PokemonSeries[];
}

const SeriesGrid = ({ series }: SeriesGridProps) => {
  // Vérification des données
  console.log(`SeriesGrid: Affichage de ${series.length} séries`);
  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Séries Pokémon</h2>
          <p className="text-muted-foreground mt-2">
            Explorez toutes les séries de cartes Pokémon disponibles ({series.length})
          </p>
        </div>
        <Link 
          to="/inventory" 
          className="flex items-center text-primary hover:underline mt-4 md:mt-0 group"
        >
          Voir tout l'inventaire
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {series.length === 0 ? (
        <div className="bg-card rounded-lg border p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Aucune série trouvée</h3>
          <p className="text-muted-foreground">
            Les séries Pokémon apparaîtront ici une fois chargées.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.map((item) => (
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
                    src={item.logo} 
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
                      textNode.textContent = item.name;
                      target.parentNode?.appendChild(textNode);
                      target.onerror = null;
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="truncate">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Date de sortie: {new Date(item.releaseDate).toLocaleDateString('fr-FR')}</span>
                    <span className="text-sm">{item.totalCards} cartes</span>
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
