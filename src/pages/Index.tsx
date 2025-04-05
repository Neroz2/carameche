
import { useEffect, useState } from "react";
import { fetchPokemonSeries, fetchExpansions } from "@/lib/api";
import { PokemonSeries } from "@/lib/types";
import Loader from "@/components/ui/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownAZ, ArrowUpAZ, Calendar, ListFilter, Star, Sparkles } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import SeriesGrid from "@/components/home/SeriesGrid";
import FeaturedCards from "@/components/home/FeaturedCards";
import { getTotalUniqueCardsCount } from "@/lib/seriesUtils";

const Index = () => {
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("series");
  const [totalCards, setTotalCards] = useState<number>(0);

  useEffect(() => {
    const cachedSeries = sessionStorage.getItem('pokemonSeries');
    
    const loadSeries = async () => {
      try {
        setLoading(true);
        
        await fetchExpansions();
        
        if (cachedSeries) {
          console.log("Utilisation des séries en cache");
          setSeries(JSON.parse(cachedSeries));
          setLoading(false);
          
          console.log("Rafraîchissement des séries en arrière-plan");
          const freshData = await fetchPokemonSeries();
          console.log(`Récupération de ${freshData.length} séries fraîches`);
          setSeries(freshData);
          sessionStorage.setItem('pokemonSeries', JSON.stringify(freshData));
        } else {
          console.log("Aucune série en cache, chargement depuis l'API");
          const seriesData = await fetchPokemonSeries();
          console.log(`Récupération de ${seriesData.length} séries depuis l'API`);
          setSeries(seriesData);
          sessionStorage.setItem('pokemonSeries', JSON.stringify(seriesData));
        }

        // Récupérer le nombre total de cartes uniques
        const count = await getTotalUniqueCardsCount();
        setTotalCards(count);
      } catch (error) {
        console.error("Erreur lors du chargement des séries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection totalCards={totalCards} />
      
      <div className="container mx-auto px-4 mt-8 pb-16">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-pokemon-fire/20 via-pokemon-water/20 to-pokemon-grass/20 blur-3xl -z-10"></div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md mx-auto">
              <TabsTrigger value="series" className="flex items-center justify-center">
                <ListFilter className="mr-2 h-4 w-4" />
                Séries
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center justify-center">
                <Sparkles className="mr-2 h-4 w-4" />
                Cartes Vedettes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="series" className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader size="lg" text="Chargement des séries..." />
                </div>
              ) : (
                <SeriesGrid series={series} />
              )}
            </TabsContent>
            
            <TabsContent value="featured" className="mt-0">
              <FeaturedCards />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
