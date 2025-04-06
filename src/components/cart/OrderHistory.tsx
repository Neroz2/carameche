
import React, { useState, useEffect } from "react";
import { Clock, Package } from "lucide-react";
import { fetchOrdersByUsername } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getStatusBgClass, getStatusIcon, getStatusText } from "@/lib/orderUtils";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/Loader";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OrderHistoryProps {
  username: string;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ username }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!username) {
        setLoading(false);
        return;
      }
      
      try {
        const userOrders = await fetchOrdersByUsername(username);
        setOrders(userOrders);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des commandes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [username, toast]);

  if (loading) {
    return <Loader />;
  }

  if (!username) {
    return (
      <div className="text-center p-4 bg-muted/30 rounded-lg mt-8">
        <p className="text-muted-foreground">
          Entrez votre pseudo dans le formulaire de commande pour voir votre historique.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-4 bg-muted/30 rounded-lg mt-8">
        <p className="text-muted-foreground">
          Aucune commande trouvée pour le pseudo "{username}".
        </p>
      </div>
    );
  }

  const toggleExpand = (orderId: string) => {
    if (expanded === orderId) {
      setExpanded(null);
    } else {
      setExpanded(orderId);
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Historique des commandes
      </h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
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
                  onClick={() => toggleExpand(order.id)}
                >
                  {expanded === order.id ? "Masquer détails" : "Voir détails"}
                </Button>
              </div>
              
              {expanded === order.id && (
                <div className="border-t p-4 bg-muted/20 space-y-2">
                  <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" /> Détails de la commande
                  </h3>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.card.nameFr || item.card.name} 
                          <span className="text-muted-foreground ml-1">
                            ({item.card.series})
                          </span>
                        </span>
                        <span className="font-medium">
                          {(item.card.price * item.quantity).toFixed(2)} €
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
