
import React, { useState } from "react";
import { Order } from "@/lib/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { getStatusBgClass, getStatusIcon, getStatusText, getStatusBorderClass } from "@/lib/orderUtils";
import { getSeriesTranslation } from "@/lib/seriesUtils";
import OrderSeriesItems from "./OrderSeriesItems";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const getCardsBySeries = (order: Order) => {
    const seriesMap: Record<string, typeof order.items> = {};
    
    order.items.forEach(item => {
      if (!seriesMap[item.card.series]) {
        seriesMap[item.card.series] = [];
      }
      seriesMap[item.card.series].push(item);
    });
    
    Object.keys(seriesMap).forEach(series => {
      seriesMap[series].sort((a, b) => {
        const numA = parseInt(a.card.number.split('/')[0], 10) || 0;
        const numB = parseInt(b.card.number.split('/')[0], 10) || 0;
        return numA - numB;
      });
    });
    
    return seriesMap;
  };

  return (
    <Card key={order.id} className="overflow-hidden">
      <div className={`border-l-4 ${getStatusBorderClass(order.status)}`}>
        <CardHeader className="bg-card py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CardTitle className="text-base">
              Commande #{order.id.substring(0, 8)}
            </CardTitle>
            <div className="flex items-center gap-3 text-sm">
              <span>
                {format(new Date(order.createdAt), "dd MMMM yyyy", { locale: fr })}
              </span>
              <span 
                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusBgClass(order.status)}`}
              >
                {getStatusIcon(order.status)}
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 flex justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                {order.items.reduce((total, item) => total + item.quantity, 0)} cartes • {order.totalPrice.toFixed(2)} €
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleExpand}
              className="gap-1"
            >
              {expanded ? (
                <>Masquer détails <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Voir détails <ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          </div>
          
          {expanded && (
            <div className="border-t bg-muted/10">
              <OrderSeriesItems cardsBySeries={getCardsBySeries(order)} />
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default OrderCard;
