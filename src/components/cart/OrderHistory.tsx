
import React, { useState, useEffect } from "react";
import { Clock, Package, Search, User, ChevronDown, ChevronUp, RotateCw } from "lucide-react";
import { fetchOrdersByUsername } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { getStatusBgClass, getStatusIcon, getStatusText, getStatusBorderClass } from "@/lib/orderUtils";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getSeriesTranslation } from "@/lib/seriesUtils";

const OrderHistory: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim().length < 3) {
      toast({
        title: "Pseudo invalide",
        description: "Le pseudo doit contenir au moins 3 caractères",
        variant: "destructive",
      });
      return;
    }
    setUsername(searchUsername.trim());
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (!username) {
        setOrders([]);
        return;
      }
      
      setLoading(true);
      
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

  const toggleExpand = (orderId: string) => {
    if (expanded === orderId) {
      setExpanded(null);
    } else {
      setExpanded(orderId);
    }
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
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <User className="h-4 w-4" /> Rechercher vos commandes
          </h3>
          <div className="flex gap-2">
            <Input
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Entrez votre pseudo"
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : username && orders.length === 0 ? (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            Aucune commande trouvée pour le pseudo "{username}".
          </p>
        </div>
      ) : !username ? (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            Entrez votre pseudo pour voir votre historique de commandes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                      onClick={() => toggleExpand(order.id)}
                      className="gap-1"
                    >
                      {expanded === order.id ? (
                        <>Masquer détails <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>Voir détails <ChevronDown className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                  
                  {expanded === order.id && (
                    <div className="border-t bg-muted/10">
                      {Object.entries(getCardsBySeries(order)).map(([series, items]) => (
                        <div key={series} className="border-b last:border-b-0">
                          <div className="bg-muted/30 p-3 font-medium text-sm">
                            {getSeriesTranslation(series).fr} ({items.length} carte{items.length > 1 ? 's' : ''})
                          </div>
                          <div className="p-3">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[80px]">Image</TableHead>
                                  <TableHead>Carte</TableHead>
                                  <TableHead>Numéro</TableHead>
                                  <TableHead className="text-right">Qté</TableHead>
                                  <TableHead className="text-right">Prix</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {items.map((item) => (
                                  <TableRow key={item.card.id}>
                                    <TableCell>
                                      <div className="relative w-14 h-20">
                                        <img 
                                          src={item.card.image} 
                                          alt={item.card.nameFr || item.card.name}
                                          className="w-14 h-20 object-cover rounded"
                                        />
                                        {item.card.isReverse && (
                                          <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5">
                                            <RotateCw size={12} />
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {item.card.nameFr || item.card.name}
                                      {item.card.isReverse && (
                                        <span className="ml-2 text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded inline-flex items-center gap-1">
                                          <RotateCw size={10} />
                                          Reverse
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>{item.card.number}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{(item.card.price * item.quantity).toFixed(2)} €</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
