
import React from "react";
import { CartItem } from "@/lib/types";
import { getSeriesTranslation } from "@/lib/seriesUtils";
import OrderItemDetails from "./OrderItemDetails";
import { ChevronRight, Package2 } from "lucide-react";

interface OrderSeriesItemsProps {
  cardsBySeries: Record<string, CartItem[]>;
}

const OrderSeriesItems: React.FC<OrderSeriesItemsProps> = ({ cardsBySeries }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {Object.entries(cardsBySeries).map(([series, items]) => (
        <div 
          key={series} 
          className="border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 duration-300"
        >
          <div className="bg-muted/40 p-4 font-medium flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package2 className="h-4 w-4 text-primary" />
              <span className="text-foreground">{getSeriesTranslation(series).fr}</span>
              <span className="bg-primary/15 text-primary text-xs px-2.5 py-0.5 rounded-full font-medium">
                {items.length} carte{items.length > 1 ? 's' : ''}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 bg-card/50">
            <OrderItemDetails items={items} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSeriesItems;
