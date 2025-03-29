
import HeroSection from "@/components/home/HeroSection";
import SeriesGrid from "@/components/home/SeriesGrid";
import { useEffect, useState } from "react";
import { fetchPokemonSeries } from "@/lib/api";
import { PokemonSeries } from "@/lib/types";
import Loader from "@/components/ui/Loader";

const Index = () => {
  const [series, setSeries] = useState<PokemonSeries[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les séries depuis l'API
  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        const seriesData = await fetchPokemonSeries();
        setSeries(seriesData);
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
        <SeriesGrid series={series} />
      )}
    </div>
  );
};

export default Index;
