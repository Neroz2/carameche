
import { useState, useEffect } from "react";
import { Eye, ChevronDown, ChevronUp, Search, CheckCircle } from "lucide-react";
import { Order } from "@/lib/types";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import Button from "@/components/common/Button";
import Loader from "@/components/ui/Loader";

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

  // Load mock orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from Supabase
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock orders
        const mockOrders: Order[] = Array.from({ length: 10 }).map((_, idx) => ({
          id: `order-${idx + 1}`,
          username: `user${idx + 1}`,
          items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, itemIdx) => ({
            card: {
              id: `card-${idx}-${itemIdx}`,
              name: `Pokémon Card ${idx}-${itemIdx}`,
              nameEn: `Pokémon Card ${idx}-${itemIdx}`,
              nameFr: `Carte Pokémon ${idx}-${itemIdx}`,
              number: `${Math.floor(Math.random() * 200) + 1}/200`,
              series: ["Scarlet & Violet", "Paldea Evolved", "Obsidian Flames"][Math.floor(Math.random() * 3)],
              rarity: ["Common", "Uncommon", "Rare", "Ultra Rare"][Math.floor(Math.random() * 4)],
              image: "https://archives.bulbagarden.net/media/upload/thumb/f/f5/006Charizard.png/250px-006Charizard.png",
              price: Math.round((Math.random() * 50 + 0.5) * 100) / 100,
              stock: Math.floor(Math.random() * 20) + 1,
              condition: ["Mint", "Near Mint", "Excellent"][Math.floor(Math.random() * 3)],
              language: Math.random() > 0.5 ? "FR" : "EN",
              isHolo: Math.random() > 0.7,
              isReverse: Math.random() > 0.7,
              isPromo: Math.random() > 0.9
            },
            quantity: Math.floor(Math.random() * 3) + 1
          })),
          totalPrice: Math.round((Math.random() * 100 + 10) * 100) / 100,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          status: ["pending", "completed", "cancelled"][Math.floor(Math.random() * 3)] as "pending" | "completed" | "cancelled"
        }));
        
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
  const markAsCompleted = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "completed" }
          : order
      )
    );
  };

  // Cancel order
  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: "cancelled" }
          : order
      )
    );
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
                      <h3 className="font-medium">Commande #{order.id}</h3>
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
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.card.id} className="flex gap-4">
                          <div className="w-16 h-22">
                            <img 
                              src={item.card.image} 
                              alt={item.card.nameFr || item.card.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.card.nameFr || item.card.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.card.series} · {item.card.number}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm">Quantité: {item.quantity}</span>
                              <span className="font-medium">{(item.card.price * item.quantity).toFixed(2)} €</span>
                            </div>
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
