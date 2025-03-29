
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { PokemonCard } from "@/lib/types";
import { useEffect, useState } from "react";
import { fetchPokemonCards } from "@/lib/api";
import Loader from "@/components/ui/Loader";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const FeaturedCards = () => {
  const [featuredCards, setFeaturedCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // On limite à 10 cartes pour la section "cartes populaires"
        const cards = await fetchPokemonCards({ 
          priceMin: 10, // Cartes ayant une certaine valeur
          isHolo: true, // Seulement les holos pour des cartes de valeur
          language: ["FR"], // On privilégie les cartes françaises
          limit: 10
        });
        setFeaturedCards(cards);
      } catch (error) {
        console.error("Erreur lors du chargement des cartes populaires:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleAddToCart = (card: PokemonCard) => {
    addToCart(card, 1);
    toast.success(`${card.nameFr || card.name} ajoutée au panier`, {
      description: "Retrouvez cette carte dans votre panier",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader size="lg" text="Chargement des cartes populaires..." />
      </div>
    );
  }

  if (featuredCards.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">Cartes populaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Découvrez notre sélection de cartes Pokémon les plus populaires et complétez votre collection.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredCards.map((card) => (
              <CarouselItem key={card.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <Link to={`/inventory?search=${encodeURIComponent(card.name)}`}>
                  <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardContent className="p-0 relative">
                      <div className="relative aspect-[7/10] overflow-hidden">
                        <img 
                          src={card.image} 
                          alt={card.nameFr || card.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                        
                        {/* Overlay with info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                          <h3 className="text-white font-medium truncate">
                            {card.nameFr || card.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2 mt-1">
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded",
                                card.isHolo ? "bg-yellow-500/20 text-yellow-300" : "bg-secondary text-secondary-foreground"
                              )}>
                                {card.isHolo ? "Holo" : card.rarity}
                              </span>
                              <span className="text-xs bg-secondary/20 text-white px-2 py-0.5 rounded">
                                {card.series}
                              </span>
                            </div>
                            <span className="text-white font-bold">
                              {card.price.toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add to cart button overlay */}
                      <button 
                        className="absolute right-2 top-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(card);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 sm:left-4" />
          <CarouselNext className="right-1 sm:right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedCards;
