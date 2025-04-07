
import React from "react";
import { CartItem } from "@/lib/types";
import { getSeriesTranslation } from "@/lib/seriesUtils";
import OrderItemDetails from "./OrderItemDetails";

interface OrderSeriesItemsProps {
  cardsBySeries: Record<string, CartItem[]>;
}

const OrderSeriesItems: React.FC<OrderSeriesItemsProps> = ({ cardsBySeries }) => {
  return (
    <>
      {Object.entries(cardsBySeries).map(([series, items]) => (
        <div key={series} className="border-b last:border-b-0">
          <div className="bg-muted/30 p-3 font-medium text-sm">
            {getSeriesTranslation(series).fr} ({items.length} carte{items.length > 1 ? 's' : ''})
          </div>
          <div className="p-3">
            <OrderItemDetails items={items} />
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderSeriesItems;
