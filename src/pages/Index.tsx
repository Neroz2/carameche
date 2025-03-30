
import HeroSection from "@/components/home/HeroSection";
import SeriesGrid from "@/components/home/SeriesGrid";
import FeaturedCards from "@/components/home/FeaturedCards";
import { useEffect, useState } from "react";
import { fetchPokemonSeries, fetchExpansions } from "@/lib/api";
import { PokemonSeries } from "@/lib/types";
import Loader from "@/components/ui/Loader";

const Index = () => {
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les séries depuis l'API avec mise en cache
  useEffect(() => {
    const cachedSeries = sessionStorage.getItem('pokemonSeries');
    
    const loadSeries = async () => {
      try {
        setLoading(true);
        
        // S'assurer que les expansions sont chargées d'abord
        await fetchExpansions();
        
        // Utiliser les données en cache si disponibles
        if (cachedSeries) {
          console.log("Utilisation des séries en cache");
          setSeries(JSON.parse(cachedSeries));
          setLoading(false);
          
          // Rafraîchir les données en arrière-plan
          console.log("Rafraîchissement des séries en arrière-plan");
          const freshData = await fetchPokemonSeries();
          console.log(`Récupération de ${freshData.length} séries fraîches`);
          // Trier les séries par nom pour une meilleure présentation
          const sortedSeries = [...freshData].sort((a, b) => a.name.localeCompare(b.name));
          setSeries(sortedSeries);
          sessionStorage.setItem('pokemonSeries', JSON.stringify(sortedSeries));
        } else {
          // Sinon, charger depuis l'API
          console.log("Aucune série en cache, chargement depuis l'API");
          const seriesData = await fetchPokemonSeries();
          console.log(`Récupération de ${seriesData.length} séries depuis l'API`);
          // Trier les séries par nom pour une meilleure présentation
          const sortedSeries = [...seriesData].sort((a, b) => a.name.localeCompare(b.name));
          setSeries(sortedSeries);
          sessionStorage.setItem('pokemonSeries', JSON.stringify(sortedSeries));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des séries:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" text="Chargement des séries..." />
        </div>
      ) : (
        <>
          <FeaturedCards />
          <SeriesGrid series={series} />
        </>
      )}
    </div>
  );
};

export default Index;
