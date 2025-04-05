
import React from "react";
import { PokemonCard } from "@/lib/types";
import { ShoppingCart, Star, Sparkles, Check } from "lucide-react";
import Card, { CardHeader, CardContent, CardFooter } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getSeriesTranslation } from "@/lib/seriesUtils";

interface InventoryGridProps {
  cards: PokemonCard[];
  addToCart: (card: PokemonCard, quantity: number) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ cards, addToCart }) => {
  const handleAddToCart = (e: React.MouseEvent, card: PokemonCard) => {
    e.stopPropagation();
    if (card.stock > 0) {
      addToCart(card, 1);
      toast.success(`Carte ajoutée au panier`, {
        description: card.nameFr || card.name,
        icon: <Check className="h-4 w-4" />
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const { fr: seriesFr } = getSeriesTranslation(card.series);
        
        return (
          <Card 
            key={card.id} 
            className={`overflow-hidden h-full group hover:ring-2 hover:ring-primary/50 transition-all
              ${card.isReverse ? 'bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-500/5' : ''}`}
            interactive
          >
            <div className="aspect-[3/4] relative overflow-hidden group">
              <div className={`absolute inset-0 ${
                card.isReverse 
                  ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
                  : ''
              }`}></div>
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
                <Badge className="bg-amber-500/90 text-white text-xs px-2 py-0.5 font-normal shadow-md">
                  {card.rarity}
                </Badge>
                <Badge variant="outline" className="bg-black/70 text-white text-xs px-2 py-0.5 border-transparent shadow-md">
                  #{card.number}
                </Badge>
                {card.isReverse && (
                  <Badge className="bg-purple-500/90 text-white text-xs px-2 py-0.5 font-normal flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    Reverse
                  </Badge>
                )}
              </div>
              <img
                src={card.image}
                alt={card.nameFr || card.name}
                className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
            </div>
            <CardHeader className="pb-2">
              <div>
                <h3 className="font-medium truncate">{card.nameFr || card.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {seriesFr}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {card.condition}
                </Badge>
                <Badge variant="outline" className="text-xs font-normal flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    card.language === 'FR' ? 'bg-blue-500' :
                    card.language === 'JP' ? 'bg-red-500' :
                    card.language === 'EN' ? 'bg-green-500' :
                    card.language === 'DE' ? 'bg-yellow-500' :
                    card.language === 'IT' ? 'bg-emerald-500' : 
                    'bg-orange-500'
                  }`}></span>
                  {card.language}
                </Badge>
                {card.isPromo && (
                  <Badge className="bg-red-500/80 hover:bg-red-500 text-xs font-normal">
                    Promo
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t flex-col items-stretch gap-3">
              <div className="w-full flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">
                  {card.price.toFixed(2)} €
                </span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  card.stock > 5 ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                  card.stock > 0 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                  'bg-red-500/20 text-red-700 dark:text-red-300'
                }`}>
                  Stock: {card.stock}
                </span>
              </div>
              <Button
                fullWidth
                onClick={(e) => handleAddToCart(e, card)}
                disabled={card.stock === 0}
                icon={<ShoppingCart className="w-4 h-4" />}
                variant={card.stock === 0 ? "outline" : "default"}
                className={card.stock === 0 ? "opacity-60" : "animate-in fade-in"}
              >
                {card.stock === 0 ? "Épuisé" : "Ajouter au panier"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryGrid;
