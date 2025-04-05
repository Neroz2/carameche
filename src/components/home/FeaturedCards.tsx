
import { useState, useEffect } from "react";
import { PokemonCard } from "@/lib/types";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, TrendingUp, Shield, Award } from "lucide-react";
import { fetchPokemonCards } from "@/lib/api";
import Loader from "@/components/ui/Loader";
import Card, { CardContent, CardFooter } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSeriesTranslation } from "@/lib/seriesUtils";

const FeaturedCards = () => {
  const [rareCards, setRareCards] = useState<PokemonCard[]>([]);
  const [holoCards, setHoloCards] = useState<PokemonCard[]>([]);
  const [popularsCards, setPopularsCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rare");

  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        setLoading(true);
        // Fetch high-value cards
        const { cards: rareCardsData } = await fetchPokemonCards("", 1, 6, {
          search: "",
          series: [],
          rarity: ["Ultra Rare", "Secret Rare"],
          priceMin: 20,
          priceMax: 1000,
          condition: [],
          language: [],
          isHolo: null,
          isReverse: null,
          isPromo: null
        });
        setRareCards(rareCardsData);

        // Fetch holo cards
        const { cards: holoCardsData } = await fetchPokemonCards("", 1, 6, {
          search: "",
          series: [],
          rarity: [],
          priceMin: 5,
          priceMax: 1000,
          condition: [],
          language: [],
          isHolo: true,
          isReverse: null,
          isPromo: null
        });
        setHoloCards(holoCardsData);

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
        setPopularsCards(popularsCardsData);
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
                  {card.rarity === "Ultra Rare" && (
                    <div className="absolute bottom-2 left-2 right-2 bg-red-500/80 text-white text-xs px-2 py-0.5 rounded-full font-medium text-center">
                      Ultra Rare
                    </div>
                  )}
                  {card.rarity === "Secret Rare" && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full font-medium text-center">
                      Secret Rare
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
          <TabsTrigger value="holo" className="flex items-center justify-center">
            <Star className="mr-2 h-4 w-4" />
            Holos
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center justify-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Populaires
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rare" className="mt-0">
          {renderCards(rareCards)}
        </TabsContent>
        
        <TabsContent value="holo" className="mt-0">
          {renderCards(holoCards)}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          {renderCards(popularsCards)}
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default FeaturedCards;
