import HeroSection from "@/components/home/HeroSection";
import SeriesGrid from "@/components/home/SeriesGrid";
import FeaturedCards from "@/components/home/FeaturedCards";
import { useEffect, useState } from "react";
import { fetchPokemonSeries, fetchExpansions } from "@/lib/api";
import { PokemonSeries } from "@/lib/types";
import Loader from "@/components/ui/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownAZ, ArrowUpAZ, Calendar, ListFilter, Star } from "lucide-react";

const Index = () => {
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("series");

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
      <HeroSection />
      
      <div className="container mx-auto px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md mx-auto">
            <TabsTrigger value="series" className="flex items-center justify-center">
              <ListFilter className="mr-2 h-4 w-4" />
              Séries
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center justify-center">
              <Star className="mr-2 h-4 w-4" />
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
  );
};

export default Index;
