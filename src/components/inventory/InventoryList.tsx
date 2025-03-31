
import React from "react";
import { PokemonCard } from "@/lib/types";
import { ShoppingCart, Star } from "lucide-react";
import Button from "@/components/common/Button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

interface InventoryListProps {
  cards: PokemonCard[];
}

const InventoryList: React.FC<InventoryListProps> = ({ cards }) => {
  const { addToCart } = useCart();

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div 
          key={card.id}
          className={`border rounded-md overflow-hidden transition-all hover:shadow-md hover:border-primary/30
            ${card.isReverse ? 'bg-accent/30 dark:bg-accent/10' : 'bg-card'}`}
        >
          <div className="flex gap-4 p-4">
            <div className="w-16 h-22 flex-shrink-0 relative rounded overflow-hidden">
              <div className={`absolute inset-0 rounded ${
                card.isReverse 
                  ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
                  : ''
              }`}></div>
              <img
                src={card.image}
                alt={card.nameFr || card.name}
                className="w-full h-full object-cover relative z-10"
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
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">#{card.number}</span>
                      <span className="text-sm text-muted-foreground">{card.series}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold whitespace-nowrap text-primary">
                      {card.price.toFixed(2)} €
                    </span>
                    <span className="text-xs text-muted-foreground">
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
                  
                  <Badge className="bg-amber-500/80 hover:bg-amber-500 text-xs font-normal">
                    {card.rarity}
                  </Badge>
                  
                  {card.isReverse && (
                    <Badge className="bg-purple-500/80 hover:bg-purple-500 text-xs font-normal flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Reverse
                    </Badge>
                  )}
                  
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (card.stock > 0) {
                      addToCart(card, 1);
                    }
                  }}
                  disabled={card.stock === 0}
                  icon={<ShoppingCart size={14} />}
                  variant={card.stock === 0 ? "outline" : "default"}
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
