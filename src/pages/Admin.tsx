import { useState, useEffect } from "react";
import { Eye, ChevronDown, ChevronUp, Search, CheckCircle, Filter, X, AlertTriangle, BarChart, Users, ShoppingBag, DollarSign, Activity, RotateCw } from "lucide-react";
import { Order } from "@/lib/types";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import Button from "@/components/common/Button";
import Loader from "@/components/ui/Loader";
import { fetchAllOrders, updateOrderStatus } from "@/lib/orderService";
import { toast } from "sonner";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import OrderStatistics from "@/components/admin/OrderStatistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStatusText, getStatusColor, getStatusIcon, getStatusBgClass, getStatusBorderClass } from "@/lib/orderUtils";

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

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

  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

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

  const totalRevenue = orders.reduce((sum, order) => {
    return order.status !== "cancelled" ? sum + order.totalPrice : sum;
  }, 0);

  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const cancelledOrders = orders.filter(order => order.status === "cancelled").length;
  
  const uniqueCustomers = new Set(orders.map(order => order.username)).size;
  
  const totalItems = orders.reduce((sum, order) => {
    if (order.status !== "cancelled") {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }
    return sum;
  }, 0);

  const getSortedCards = (order: Order) => {
    return [...order.items].sort((a, b) => {
      if (a.card.series < b.card.series) return -1;
      if (a.card.series > b.card.series) return 1;
      
      const numA = parseInt(a.card.number.split('/')[0], 10) || 0;
      const numB = parseInt(b.card.number.split('/')[0], 10) || 0;
      return numA - numB;
    });
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
    <div className="min-h-screen pb-12 bg-muted/20">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des commandes et suivi de l'activité
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</p>
                  <h3 className="text-2xl font-bold mt-1">{totalRevenue.toFixed(2)} €</h3>
                </div>
                <div className="p-3 bg-primary/10 text-primary rounded-full">
                  <DollarSign size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commandes totales</p>
                  <h3 className="text-2xl font-bold mt-1">{orders.length}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-full">
                  <ShoppingBag size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clients uniques</p>
                  <h3 className="text-2xl font-bold mt-1">{uniqueCustomers}</h3>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
                  <Users size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Articles vendus</p>
                  <h3 className="text-2xl font-bold mt-1">{totalItems}</h3>
                </div>
                <div className="p-3 bg-teal-500/10 text-teal-500 rounded-full">
                  <BarChart size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="statistics" className="flex-1">
              <Activity size={16} className="mr-2" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-1">
              <ShoppingBag size={16} className="mr-2" />
              Commandes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Analyse des commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderStatistics orders={orders} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Statut des commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>En attente</span>
                      </div>
                      <span className="font-medium">{pendingOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Complétées</span>
                      </div>
                      <span className="font-medium">{completedOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Annulées</span>
                      </div>
                      <span className="font-medium">{cancelledOrders}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      {orders.length > 0 && (
                        <>
                          <div 
                            className="absolute top-0 left-0 h-full bg-yellow-500" 
                            style={{ width: `${(pendingOrders / orders.length) * 100}%` }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-full bg-green-500" 
                            style={{ 
                              width: `${(completedOrders / orders.length) * 100}%`,
                              marginLeft: `${(pendingOrders / orders.length) * 100}%`
                            }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-full bg-red-500" 
                            style={{ 
                              width: `${(cancelledOrders / orders.length) * 100}%`,
                              marginLeft: `${((pendingOrders + completedOrders) / orders.length) * 100}%`
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-0">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border">
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
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer border-l-4 ${getStatusBorderClass(order.status)}`}
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-medium">Commande #{order.id.slice(0, 8)}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusBgClass(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
