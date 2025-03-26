
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PokemonSeries } from "@/lib/types";
import { fetchPokemonSeries } from "@/lib/api";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/common/Card";
import Loader from "@/components/ui/Loader";

const SeriesGrid = () => {
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        const data = await fetchPokemonSeries();
        setSeries(data);
      } catch (error) {
        console.error("Failed to load series:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size="lg" text="Chargement des séries..." />
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Séries Pokémon</h2>
          <p className="text-muted-foreground mt-2">
            Explorez toutes les séries de cartes Pokémon disponibles
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((item, index) => (
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
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
                <img 
                  src={item.logo} 
                  alt={`${item.name} series logo`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
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
    </section>
  );
};

export default SeriesGrid;
