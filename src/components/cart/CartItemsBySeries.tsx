
import React, { useMemo } from "react";
import { CartItem } from "@/lib/types";
import { Trash2, Minus, Plus } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Separator } from "@/components/ui/separator";
import { getSeriesTranslation } from "@/lib/seriesUtils";
import { Button } from "@/components/ui/button";

interface CartItemsBySeriesProps {
  items: CartItem[];
  updateQuantity: (cardId: string, quantity: number) => void;
  removeFromCart: (cardId: string) => void;
}

const CartItemsBySeries: React.FC<CartItemsBySeriesProps> = ({
  items,
  updateQuantity,
  removeFromCart,
}) => {
  // Regrouper les cartes par série
  const groupedItems = useMemo(() => {
    const groups: Record<string, CartItem[]> = {};
    
    items.forEach(item => {
      const seriesName = item.card.series;
      if (!groups[seriesName]) {
        groups[seriesName] = [];
      }
      groups[seriesName].push(item);
    });
    
    // Tri par nom de série
    return Object.entries(groups).sort((a, b) => {
      const aName = getSeriesTranslation(a[0]).fr;
      const bName = getSeriesTranslation(b[0]).fr;
      return aName.localeCompare(bName);
    });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="text-center p-8 bg-card rounded-lg border">
        <h3 className="text-xl font-medium mb-2">Votre panier est vide</h3>
        <p className="text-muted-foreground">
          Ajoutez des cartes à votre panier pour les voir apparaître ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedItems.map(([seriesName, seriesItems]) => {
        const { fr: seriesFr } = getSeriesTranslation(seriesName);
        
        return (
          <Card key={seriesName} className="overflow-hidden animate-in fade-in">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg">{seriesFr}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {seriesItems.map((item) => (
                  <div key={item.card.id} className="p-4 flex items-center gap-4">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 relative rounded overflow-hidden">
                      <img
                        src={item.card.image}
                        alt={item.card.nameFr || item.card.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">
                        {item.card.nameFr || item.card.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                        <span>#{item.card.number}</span>
                        <span className="hidden sm:block">•</span>
                        <span>{item.card.rarity}</span>
                        <span className="hidden sm:block">•</span>
                        <span>{item.card.condition}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-semibold text-primary">
                        {(item.card.price * item.quantity).toFixed(2)} €
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                          disabled={item.quantity >= item.card.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 ml-2"
                          onClick={() => removeFromCart(item.card.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CartItemsBySeries;
