
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Search, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { fetchOrdersByUsername } from "@/lib/orderService";
import { Order } from "@/lib/types";
import Button from "@/components/common/Button";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

const Orders = () => {
  const [searchParams] = useSearchParams();
  const usernameParam = searchParams.get("username");
  
  const [username, setUsername] = useState(usernameParam || "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les commandes si un nom d'utilisateur est fourni
  useEffect(() => {
    if (usernameParam) {
      fetchOrders(usernameParam);
    }
  }, [usernameParam]);

  const fetchOrders = async (name: string) => {
    if (!name.trim()) {
      setError("Veuillez entrer un pseudo");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = await fetchOrdersByUsername(name);
      setOrders(orderData);
      
      if (orderData.length === 0) {
        setError(`Aucune commande trouvée pour "${name}"`);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes:", err);
      setError("Erreur lors de la récupération des commandes");
      toast.error("Erreur", { description: "Impossible de récupérer les commandes" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(username);
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Suivi de commandes</h1>
          <p className="text-muted-foreground mt-1">
            Retrouvez vos commandes en entrant votre pseudo
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Entrez votre pseudo..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 pl-9 rounded-md border border-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            <Button type="submit" disabled={loading}>
              Rechercher
            </Button>
          </div>
        </form>

        {/* Orders content */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader size="lg" text="Chargement des commandes..." />
          </div>
        ) : error ? (
          <div className="bg-card rounded-lg border p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-2">{error}</h2>
            <p className="text-muted-foreground mb-6">
              Vérifiez que vous avez entré le bon pseudo ou essayez d'effectuer une nouvelle commande.
            </p>
            <Link to="/inventory">
              <Button size="lg" className="animate-fade-in">
                Parcourir l'inventaire
              </Button>
            </Link>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="text-sm">Commandes trouvées pour <span className="font-medium">{usernameParam}</span></p>
            </div>
            
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border overflow-hidden">
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
                              {item.card.series} · #{item.card.number}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm">Quantité: {item.quantity}</span>
                              <span className="font-medium">{(item.card.price * item.quantity).toFixed(2)} €</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : usernameParam ? (
          <div className="bg-card rounded-lg border p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Aucune commande trouvée</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore passé de commande ou vous avez entré un pseudo incorrect.
            </p>
            <Link to="/inventory">
              <Button size="lg" className="animate-fade-in">
                Parcourir l'inventaire
              </Button>
            </Link>
          </div>
        ) : null}
        
        <div className="mt-8">
          <Link 
            to="/" 
            className="flex items-center text-primary hover:underline text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orders;
