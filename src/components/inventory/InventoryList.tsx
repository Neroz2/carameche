
import React from "react";
import { PokemonCard } from "@/lib/types";
import { ShoppingCart, Star } from "lucide-react";
import Button from "@/components/common/Button";
import { useCart } from "@/context/CartContext";

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
          className={`bg-card border rounded-md p-4 flex gap-4 hover:shadow-md transition-shadow
            ${card.isReverse ? 'bg-gray-50/80 dark:bg-gray-800/50' : ''}`}
        >
          <div className="w-20 h-28 flex-shrink-0 relative">
            <div className={`absolute inset-0 rounded ${
              card.isReverse 
                ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
                : ''
            }`}></div>
            <img
              src={card.image}
              alt={card.nameFr || card.name}
              className="w-full h-full object-cover rounded relative z-10"
              loading="lazy"
            />
          </div>
          <div className="flex-grow flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {card.nameFr || card.name} <span className="text-sm text-muted-foreground">#{card.number}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.series}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-semibold whitespace-nowrap">
                    {card.price.toFixed(2)} €
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stock: {card.stock}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {card.condition}
                </span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {card.language}
                </span>
                {card.isHolo && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded border border-yellow-500/30">
                    Holo
                  </span>
                )}
                {card.isReverse && (
                  <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-500/30 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Reverse
                  </span>
                )}
                {card.isPromo && (
                  <span className="text-xs bg-red-500/20 text-red-700 dark:text-red-300 px-2 py-1 rounded border border-red-500/30">
                    Promo
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end items-center mt-4 border-t pt-3">
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
      ))}
    </div>
  );
};

export default InventoryList;
