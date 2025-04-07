
import React from "react";
import { CartItem } from "@/lib/types";
import { getSeriesTranslation } from "@/lib/seriesUtils";
import OrderItemDetails from "./OrderItemDetails";
import { ChevronRight } from "lucide-react";

interface OrderSeriesItemsProps {
  cardsBySeries: Record<string, CartItem[]>;
}

const OrderSeriesItems: React.FC<OrderSeriesItemsProps> = ({ cardsBySeries }) => {
  return (
    <div className="space-y-3 animate-fade-in">
      {Object.entries(cardsBySeries).map(([series, items]) => (
        <div key={series} className="border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
          <div className="bg-muted/50 p-3 font-medium text-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getSeriesTranslation(series).fr} 
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {items.length} carte{items.length > 1 ? 's' : ''}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-3 bg-card">
            <OrderItemDetails items={items} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSeriesItems;
