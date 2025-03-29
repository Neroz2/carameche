
import { useState, useEffect } from "react";
import { PokemonCard } from "@/lib/types";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { fetchPokemonCards } from "@/lib/api";
import Loader from "@/components/ui/Loader";
import Card, { CardContent, CardFooter } from "@/components/common/Card";

const FeaturedCards = () => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        setLoading(true);
        // Fetch high-value and/or holo cards
        const { cards } = await fetchPokemonCards("", 1, 6, {
          search: "",
          series: [],
          rarity: ["Ultra Rare", "Secret Rare"],
          priceMin: 10,
          priceMax: 1000,
          condition: [],
          language: [],
          isHolo: true,
          isReverse: null,
          isPromo: null
        });
        setCards(cards);
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

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <Star className="text-yellow-500 mr-2 h-6 w-6" />
            Cartes Vedettes
          </h2>
          <p className="text-muted-foreground mt-1">
            Découvrez nos cartes les plus précieuses
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Link 
            key={card.id} 
            to={`/inventory`}
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
              </div>
              <CardContent className="p-2">
                <h3 className="font-medium text-sm truncate">{card.nameFr || card.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{card.series}</p>
              </CardContent>
              <CardFooter className="p-2 pt-0">
                <span className="text-sm font-semibold">{card.price.toFixed(2)} €</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCards;
