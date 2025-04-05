
import { useState, useEffect } from "react";
import { PokemonCard } from "@/lib/types";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, TrendingUp, GlobeIcon, Shield, Award } from "lucide-react";
import { fetchPokemonCards } from "@/lib/api";
import Loader from "@/components/ui/Loader";
import Card, { CardContent, CardFooter } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSeriesTranslation } from "@/lib/seriesUtils";

// Définir les générations/régions Pokémon
const POKEMON_REGIONS = [
  { id: "kanto", name: "Kanto", generation: "1", pokemon: [1, 151] },
  { id: "johto", name: "Johto", generation: "2", pokemon: [152, 251] },
  { id: "hoenn", name: "Hoenn", generation: "3", pokemon: [252, 386] },
  { id: "sinnoh", name: "Sinnoh", generation: "4", pokemon: [387, 493] },
  { id: "unova", name: "Unova", generation: "5", pokemon: [494, 649] },
  { id: "kalos", name: "Kalos", generation: "6", pokemon: [650, 721] },
  { id: "alola", name: "Alola", generation: "7", pokemon: [722, 809] },
  { id: "galar", name: "Galar", generation: "8", pokemon: [810, 905] },
  { id: "paldea", name: "Paldea", generation: "9", pokemon: [906, 1025] },
];

const FeaturedCards = () => {
  const [rareCards, setRareCards] = useState<PokemonCard[]>([]);
  const [popularCards, setPopularCards] = useState<PokemonCard[]>([]);
  const [regionCards, setRegionCards] = useState<Record<string, PokemonCard[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rare");

  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        setLoading(true);
        
        // Fetch high-value rare cards with all the specified rarities
        const { cards: rareCardsData } = await fetchPokemonCards("", 1, 6, {
          search: "",
          series: [],
          rarity: [
            "Amazing Rare",
            "Rare BREAK",
            "Rare Holo EX",
            "Rare Holo GX",
            "Rare Holo LV.X",
            "Rare Holo Star",
            "Rare Holo V",
            "Rare Holo VMAX",
            "Rare Holo VSTAR",
            "Rare Prime",
            "Rare Prism Star",
            "Rare Shiny",
            "Rare Shiny GX",
            "Rare Ultra",
            "Legend",
            "Radiant Rare",
            "Illustration Rare",
            "Special Illustration Rare",
            "Trainer Gallery Rare",
            "ACE SPEC",
            "Ultra Rare",
            "Secret Rare"
          ],
          priceMin: 0,
          priceMax: 1000,
          condition: [],
          language: [],
          isHolo: null,
          isReverse: null,
          isPromo: null
        });
        setRareCards(rareCardsData);

        // Fetch popular cards (simulated with a different filter)
        const { cards: popularsCardsData } = await fetchPokemonCards("", 1, 6, {
          search: "",
          series: ["Scarlet & Violet", "Obsidian Flames", "Paldea Evolved"],
          rarity: [],
          priceMin: 2,
          priceMax: 50,
          condition: ["Near Mint"],
          language: [],
          isHolo: null,
          isReverse: null,
          isPromo: null
        });
        setPopularCards(popularsCardsData);

        // Fetch cards for each region
        const regionsData: Record<string, PokemonCard[]> = {};
        
        for (const region of POKEMON_REGIONS) {
          const { cards: regionCardsData } = await fetchPokemonCards("", 1, 6, {
            search: "",
            series: [],
            rarity: [],
            priceMin: 0,
            priceMax: 1000,
            condition: [],
            language: [],
            isHolo: null,
            isReverse: null,
            isPromo: null
          });
          
          // Simulation: en production, il faudrait intégrer une API qui permet
          // de récupérer les cartes par numéro de Pokémon
          regionsData[region.id] = regionCardsData.slice(0, 6);
        }
        
        setRegionCards(regionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des cartes vedettes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCards();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="md" text="Chargement des cartes vedettes..." />
      </div>
    );
  }

  const renderCards = (cards: PokemonCard[]) => {
    if (cards.length === 0) {
      return (
        <div className="col-span-full py-10 text-center">
          <p className="text-lg text-muted-foreground">Aucune carte trouvée dans cette catégorie</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => {
          const { fr: frSeries } = getSeriesTranslation(card.series);
          
          return (
            <Link 
              key={card.id} 
              to={`/inventory?card=${card.id}`}
              className="block transform transition-transform hover:scale-105"
            >
              <Card className="overflow-hidden h-full">
                <div className="relative aspect-[3/4]">
                  <div className={`absolute inset-0 ${card.isHolo ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20' : ''}`}></div>
                  <img
                    src={card.image}
                    alt={card.nameFr || card.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {card.isHolo && (
                    <div className="absolute top-2 right-2 bg-yellow-500/80 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                      Holo
                    </div>
                  )}
                  {card.isReverse && (
                    <div className="absolute top-2 left-2 bg-purple-500/80 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Reverse
                    </div>
                  )}
                  {(card.rarity === "Ultra Rare" || card.rarity === "Secret Rare") && (
                    <div className="absolute bottom-2 left-2 right-2 bg-gradient-to-r from-red-500/80 via-purple-500/80 to-blue-500/80 text-white text-xs px-2 py-0.5 rounded-full font-medium text-center">
                      {card.rarity}
                    </div>
                  )}
                </div>
                <CardContent className="p-2">
                  <h3 className="font-medium text-sm truncate">{card.nameFr || card.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{frSeries}</p>
                </CardContent>
                <CardFooter className="p-2 pt-0">
                  <span className="text-sm font-semibold">{card.price.toFixed(2)} €</span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  };

  const renderRegionsTab = () => {
    return (
      <div className="space-y-8">
        {POKEMON_REGIONS.map(region => (
          <div key={region.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {region.name} <span className="text-sm text-muted-foreground ml-2">Gen {region.generation}</span>
              </h3>
              <Link 
                to={`/inventory?region=${region.id}`} 
                className="text-sm text-primary hover:underline flex items-center"
              >
                Voir tout <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            {regionCards[region.id] && regionCards[region.id].length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {regionCards[region.id].map(card => {
                  const { fr: frSeries } = getSeriesTranslation(card.series);
                  
                  return (
                    <Link 
                      key={card.id} 
                      to={`/inventory?card=${card.id}`}
                      className="block transform transition-transform hover:scale-105"
                    >
                      <Card className="overflow-hidden h-full">
                        <div className="relative aspect-[3/4]">
                          <img
                            src={card.image}
                            alt={card.nameFr || card.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-2">
                          <h3 className="font-medium text-sm truncate">{card.nameFr || card.name}</h3>
                          <p className="text-xs text-muted-foreground truncate">{frSeries}</p>
                        </CardContent>
                        <CardFooter className="p-2 pt-0">
                          <span className="text-sm font-semibold">{card.price.toFixed(2)} €</span>
                        </CardFooter>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Aucune carte de cette région</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <Sparkles className="text-yellow-500 mr-2 h-6 w-6" />
            Cartes Vedettes
          </h2>
          <p className="text-muted-foreground mt-1">
            Découvrez nos cartes les plus précieuses et populaires
          </p>
        </div>
        <Link 
          to="/inventory" 
          className="flex items-center text-primary hover:underline group"
        >
          Voir tout
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
          <TabsTrigger value="rare" className="flex items-center justify-center">
            <Award className="mr-2 h-4 w-4" />
            Ultra Rares
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center justify-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Populaires
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center justify-center">
            <GlobeIcon className="mr-2 h-4 w-4" />
            Par Région
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rare" className="mt-0">
          {renderCards(rareCards)}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          {renderCards(popularCards)}
        </TabsContent>
        
        <TabsContent value="regions" className="mt-0">
          {renderRegionsTab()}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default FeaturedCards;
