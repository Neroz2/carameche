
import { useState, useEffect } from "react";
import { Eye, ChevronDown, ChevronUp, Search, CheckCircle, Filter, X, AlertTriangle } from "lucide-react";
import { Order } from "@/lib/types";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import Button from "@/components/common/Button";
import Loader from "@/components/ui/Loader";
import { fetchAllOrders, updateOrderStatus } from "@/lib/orderService";
import { toast } from "sonner";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

  // Charger les commandes depuis Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Toggle order expansion
  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Apply filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        (item.card.nameFr || item.card.name).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Mark order as completed
  const markAsCompleted = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "completed");
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "completed" }
            : order
        )
      );
      
      toast.success("Statut mis à jour", {
        description: "La commande a été marquée comme complétée"
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "cancelled");
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "cancelled" }
            : order
        )
      );
      
      toast.success("Statut mis à jour", {
        description: "La commande a été annulée"
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  // Obtenez les cartes de la commande triées par série puis par numéro
  const getSortedCards = (order: Order) => {
    return [...order.items].sort((a, b) => {
      // D'abord, trier par série
      if (a.card.series < b.card.series) return -1;
      if (a.card.series > b.card.series) return 1;
      
      // Ensuite, trier par numéro de carte
      const numA = parseInt(a.card.number.split('/')[0], 10) || 0;
      const numB = parseInt(b.card.number.split('/')[0], 10) || 0;
      return numA - numB;
    });
  };

  // Regrouper les cartes par série
  const getCardsBySeries = (order: Order) => {
    const seriesMap: Record<string, typeof order.items> = {};
    
    order.items.forEach(item => {
      if (!seriesMap[item.card.series]) {
        seriesMap[item.card.series] = [];
      }
      seriesMap[item.card.series].push(item);
    });
    
    // Trier les cartes par numéro dans chaque série
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
    <div className="min-h-screen pb-12">
      {/* Header section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des commandes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par ID, utilisateur ou produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-9 rounded-md border border-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-40 p-2 rounded-md border border-input bg-background"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Complétées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader size="lg" text="Chargement des commandes..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-card rounded-lg border p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Aucune commande trouvée</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos filtres ou d'effectuer une recherche différente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-medium">Commande #{order.id.slice(0, 8)}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {order.status === "completed" 
                          ? "Complétée" 
                          : order.status === "cancelled"
                          ? "Annulée"
                          : "En attente"
                        }
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Client: <span className="font-medium">{order.username}</span> · 
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm">
                      {order.items.length} article{order.items.length !== 1 ? 's' : ''} · 
                      <span className="font-medium"> {order.totalPrice.toFixed(2)} €</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-muted-foreground">
                      {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </div>
                </div>
                
                {expandedOrderId === order.id && (
                  <div className="border-t p-4 animate-slide-down">
                    <h4 className="font-medium mb-2">Détails de la commande</h4>
                    
                    {/* Afficher les cartes groupées par série */}
                    <div className="space-y-6 mb-6">
                      {Object.entries(getCardsBySeries(order)).map(([series, items]) => (
                        <div key={series} className="border rounded-md overflow-hidden">
                          <div className="bg-muted/30 p-3 font-medium text-sm">
                            {series} ({items.length} carte{items.length > 1 ? 's' : ''})
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
                                      <img 
                                        src={item.card.image} 
                                        alt={item.card.nameFr || item.card.name}
                                        className="w-14 h-20 object-cover rounded"
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.card.nameFr || item.card.name}</TableCell>
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
                    
                    {order.status === "pending" && (
                      <div className="flex gap-4 mt-4 pt-4 border-t">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsCompleted(order.id);
                          }}
                          icon={<CheckCircle size={16} />}
                        >
                          Marquer comme complétée
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelOrder(order.id);
                          }}
                          icon={<AlertTriangle size={16} />}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
