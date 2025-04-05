
import React from "react";
import { PokemonCard } from "@/lib/types";
import { ShoppingCart, Star, Sparkles, Check } from "lucide-react";
import Button from "@/components/common/Button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface InventoryListProps {
  cards: PokemonCard[];
}

const InventoryList: React.FC<InventoryListProps> = ({ cards }) => {
  const { addToCart } = useCart();

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
    <div className="space-y-4">
      {cards.map((card) => (
        <div 
          key={card.id}
          className={`border rounded-lg overflow-hidden transition-all hover:shadow-md hover:border-primary/30
            ${card.isReverse ? 'bg-gradient-to-r from-purple-500/5 to-blue-500/5 dark:bg-accent/10' : 'bg-card'}`}
        >
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <div className="w-full sm:w-24 h-32 flex-shrink-0 relative rounded-md overflow-hidden">
              <div className={`absolute inset-0 rounded-md ${
                card.isReverse 
                  ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
                  : ''
              }`}></div>
              <div className="absolute top-1 right-1 z-20 flex flex-col gap-1 items-end">
                {card.isReverse && (
                  <Badge className="bg-purple-500/90 text-white text-xs px-1.5 py-0.5 font-normal shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                  </Badge>
                )}
              </div>
              <img
                src={card.image}
                alt={card.nameFr || card.name}
                className="w-full h-full object-cover relative z-10 transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium truncate">
                      {card.nameFr || card.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">#{card.number}</span>
                      <Badge className="bg-amber-500/80 hover:bg-amber-500 text-xs text-white font-normal">
                        {card.rarity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{card.series}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold whitespace-nowrap text-primary">
                      {card.price.toFixed(2)} €
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                      card.stock > 5 ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                      card.stock > 0 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                      'bg-red-500/20 text-red-700 dark:text-red-300'
                    }`}>
                      Stock: {card.stock}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
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
              </div>
              
              <div className="flex justify-end items-center mt-3 pt-3 border-t">
                <Button
                  size="sm"
                  onClick={(e) => handleAddToCart(e, card)}
                  disabled={card.stock === 0}
                  icon={<ShoppingCart size={14} />}
                  variant={card.stock === 0 ? "outline" : "default"}
                  className={card.stock === 0 ? "opacity-60" : ""}
                >
                  {card.stock === 0 ? "Épuisé" : "Ajouter au panier"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
