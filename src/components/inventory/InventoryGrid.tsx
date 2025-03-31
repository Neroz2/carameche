
import React from "react";
import { PokemonCard } from "@/lib/types";
import { ShoppingCart, Minus, Plus, Star } from "lucide-react";
import Card, { CardHeader, CardContent, CardFooter } from "@/components/common/Card";
import Button from "@/components/common/Button";

interface InventoryGridProps {
  cards: PokemonCard[];
  addToCart: (card: PokemonCard, quantity: number) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ cards, addToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card 
          key={card.id} 
          className={`overflow-hidden h-full transition-all border dark:border-gray-700 ${
            card.isReverse ? 'bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-purple-500/5' : ''
          }`}
        >
          <div className="aspect-[3/4] relative overflow-hidden">
            <div className={`absolute inset-0 ${
              card.isReverse 
                ? 'bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-400/20' 
                : ''
            }`}></div>
            <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
              <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                {card.rarity}
              </span>
              <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
                # {card.number}
              </span>
              {card.isReverse && (
                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Star className="mr-1" size={12} />
                  Reverse
                </span>
              )}
            </div>
            <img
              src={card.image}
              alt={card.nameFr || card.name}
              className="w-full h-full object-cover relative z-10"
              loading="lazy"
            />
          </div>
          <CardHeader className="pb-2">
            <div>
              <h3 className="font-medium truncate">{card.nameFr || card.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {card.series}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-secondary px-2 py-1 rounded">
                {card.condition}
              </span>
              <span className="text-xs bg-secondary px-2 py-1 rounded flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  card.language === 'FR' ? 'bg-blue-500' :
                  card.language === 'JP' ? 'bg-red-500' :
                  card.language === 'EN' ? 'bg-green-500' : 'bg-gray-500'
                }`}></span>
                {card.language}
              </span>
              {card.isReverse && (
                <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Reverse
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t flex-col items-stretch gap-3">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-semibold text-primary">
                {card.price.toFixed(2)} €
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                Stock: {card.stock}
              </span>
            </div>
            <div className="w-full flex gap-2 items-center">
              <div className="flex items-center border rounded-md dark:border-gray-700 flex-1">
                <button 
                  className="p-2 hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(card, -1);
                  }}
                  disabled={card.stock === 0}
                >
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center">1</span>
                <button 
                  className="p-2 hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(card, 1);
                  }}
                  disabled={card.stock === 0}
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (card.stock > 0) {
                    addToCart(card, 1);
                  }
                }}
                disabled={card.stock === 0}
                variant={card.stock === 0 ? "outline" : "default"}
              >
                {card.stock === 0 ? "Épuisé" : "Ajouter"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default InventoryGrid;
