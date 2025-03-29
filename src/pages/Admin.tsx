
import { useEffect, useState, useMemo } from "react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/orderService";
import { Order } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, subDays, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { CheckCircle2, XCircle, Clock, TrendingUp, CreditCard, Package, Users, ShoppingCart } from "lucide-react";

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await fetchAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
        toast.error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Mettre à jour l'état local
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));
      toast.success(`Statut de la commande mis à jour: ${newStatus}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (!orders.length) return {
      totalOrders: 0,
      totalRevenue: 0,
      totalItems: 0,
      avgOrderValue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      recentOrders: 0,
      uniqueUsers: 0
    };

    const now = new Date();
    const recentDate = subDays(now, 7);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const recentOrders = orders.filter(o => isAfter(parseISO(o.createdAt), recentDate)).length;
    
    const uniqueUsers = new Set(orders.map(o => o.username)).size;
    
    const totalRevenue = orders.reduce((sum, order) => 
      order.status !== 'cancelled' ? sum + order.totalPrice : sum, 0);
    
    const totalItems = orders.reduce((sum, order) => 
      order.status !== 'cancelled' 
        ? sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0) 
        : sum, 0);

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalItems,
      avgOrderValue: totalRevenue / (pendingOrders + completedOrders) || 0,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
      uniqueUsers
    };
  }, [orders]);

  // Préparer les données pour les graphiques
  const statusData = useMemo(() => {
    return [
      { name: 'En attente', value: stats.pendingOrders, color: '#facc15' },
      { name: 'Complétées', value: stats.completedOrders, color: '#4ade80' },
      { name: 'Annulées', value: stats.cancelledOrders, color: '#f87171' },
    ];
  }, [stats]);

  // Données des commandes récentes (7 derniers jours)
  const recentOrdersData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'dd/MM', { locale: fr }),
        fullDate: date,
        orders: 0,
        revenue: 0
      };
    }).reverse();

    orders.forEach(order => {
      const orderDate = parseISO(order.createdAt);
      const dayIndex = last7Days.findIndex(day => 
        format(day.fullDate, 'dd/MM') === format(orderDate, 'dd/MM')
      );
      
      if (dayIndex !== -1 && order.status !== 'cancelled') {
        last7Days[dayIndex].orders += 1;
        last7Days[dayIndex].revenue += order.totalPrice;
      }
    });

    return last7Days;
  }, [orders]);

  // Filtrer les commandes en fonction du statut sélectionné
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "all") return orders;
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  // Organiser les cartes par série et numéro
  const organizeCardsBySeriesAndNumber = (order: Order) => {
    // Créer un objet pour organiser les cartes par série
    const cardsBySeries: { [key: string]: typeof order.items } = {};
    
    // Grouper les cartes par série
    order.items.forEach(item => {
      if (!cardsBySeries[item.card.series]) {
        cardsBySeries[item.card.series] = [];
      }
      cardsBySeries[item.card.series].push(item);
    });
    
    // Trier les cartes par numéro dans chaque série
    Object.keys(cardsBySeries).forEach(series => {
      cardsBySeries[series].sort((a, b) => {
        // Enlever les caractères non numériques et convertir en nombre
        const numA = parseInt(a.card.number.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.card.number.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
    });
    
    return cardsBySeries;
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground">Gérez les commandes et consultez les statistiques</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" text="Chargement des commandes..." />
        </div>
      ) : (
        <Tabs defaultValue="stats">
          <TabsList className="mb-8">
            <TabsTrigger value="stats" className="text-base">
              <TrendingUp className="h-4 w-4 mr-2" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-base">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Statistiques */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenu Total
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)}€</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalOrders} commandes au total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Valeur Moyenne
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgOrderValue.toFixed(2)}€</div>
                  <p className="text-xs text-muted-foreground">
                    Par commande
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Articles Vendus
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalItems}</div>
                  <p className="text-xs text-muted-foreground">
                    Cartes au total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Utilisateurs
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Clients uniques
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Graphique des commandes récentes */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Commandes des 7 derniers jours</CardTitle>
                  <CardDescription>
                    Nombre de commandes et revenus par jour
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={recentOrdersData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orders" name="Commandes" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="revenue" name="Revenus (€)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Graphique du statut des commandes */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Statut des commandes</CardTitle>
                  <CardDescription>
                    Répartition des commandes par statut
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} commandes`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Onglet Commandes */}
          <TabsContent value="orders">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Liste des commandes</h2>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les commandes</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Complétées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border">
                <h3 className="text-lg font-medium">Aucune commande trouvée</h3>
                <p className="text-muted-foreground mt-2">
                  Il n'y a pas de commandes correspondant au filtre actuel.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredOrders.map((order) => {
                  const orderDate = new Date(order.createdAt);
                  const formattedDate = format(orderDate, 'dd MMMM yyyy à HH:mm', { locale: fr });
                  const cardsBySeries = organizeCardsBySeriesAndNumber(order);
                  
                  return (
                    <Card key={order.id} className="animate-fade-in">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                              Commande #{order.id.substring(0, 8)}
                              <Badge variant="outline" className="sm:ml-2">
                                {order.username}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              {formattedDate}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`flex items-center ${
                              order.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                              order.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' :
                              'bg-yellow-500 hover:bg-yellow-600'
                            }`}>
                              {getStatusIcon(order.status)}
                              {order.status === 'completed' ? 'Complétée' : 
                               order.status === 'cancelled' ? 'Annulée' : 'En attente'}
                            </Badge>
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value as 'pending' | 'completed' | 'cancelled')}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Changer le statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="completed">Complétée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Organiser les cartes par série pour faciliter la préparation */}
                        {Object.keys(cardsBySeries).map((series) => (
                          <div key={series} className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                              {series}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {cardsBySeries[series].map((item, index) => (
                                <div key={`${item.card.id}-${index}`} className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg">
                                  <div className="w-12 h-16 flex-shrink-0">
                                    <img 
                                      src={item.card.image} 
                                      alt={item.card.name}
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.card.name}</p>
                                    <p className="text-xs text-muted-foreground">#{item.card.number}</p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                                        {item.quantity}×
                                      </span>
                                      <span className="text-sm font-medium">
                                        {(item.card.price * item.quantity).toFixed(2)}€
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      
                      <CardContent className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {order.items.reduce((total, item) => total + item.quantity, 0)} articles
                            </span>
                          </div>
                          <div className="font-bold text-lg">
                            Total: {order.totalPrice.toFixed(2)}€
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Admin;
