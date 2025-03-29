
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Trash, ArrowLeft, ChevronUp, ChevronDown, Search, Clock, CheckCircle, X, Package, Truck, CalendarDays, CalendarClock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/common/Button";
import { toast } from "sonner";
import { saveOrder } from "@/lib/orderService";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { fetchOrdersByUsername } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/Loader";

const Cart = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "cart";
  const initialUsername = searchParams.get("username") || "";

  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount } = useCart();
  const [username, setUsername] = useState(initialUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si un nom d'utilisateur est fourni et que l'onglet est "orders",
    // charger automatiquement les commandes
    if (initialUsername && initialTab === "orders") {
      fetchUserOrders(initialUsername);
    }
  }, [initialUsername, initialTab]);

  const handleSubmitOrder = async () => {
    if (!username.trim()) {
      toast.error("Veuillez entrer un pseudo");
      return;
    }

    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    setIsSubmitting(true);

    try {
      // Sauvegarder la commande dans Supabase
      const orderId = await saveOrder(username, items);
      
      // Success
      toast.success("Commande envoyée avec succès !", {
        description: "Votre commande a été enregistrée et sera traitée prochainement."
      });
      
      // Stocker l'ID de commande temporairement
      setSavedOrderId(orderId);
      
      // Clear cart after successful order
      clearCart();
      
      // Après 5 secondes, rediriger vers la page principale
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Erreur lors de l'envoi de la commande", {
        description: "Veuillez réessayer ultérieurement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchUserOrders = async (usernameToFetch: string) => {
    if (!usernameToFetch.trim()) {
      toast.error("Veuillez entrer un pseudo pour voir vos commandes");
      return;
    }

    setLoadingOrders(true);
    try {
      const orders = await fetchOrdersByUsername(usernameToFetch);
      setUserOrders(orders);
      
      if (orders.length === 0) {
        toast.info(`Aucune commande trouvée pour ${usernameToFetch}`);
      } else {
        toast.success(`${orders.length} commande(s) trouvée(s)`);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Erreur lors de la récupération des commandes");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTrackOrder = () => {
    if (username.trim()) {
      setActiveTab("orders");
      fetchUserOrders(username);
    } else {
      toast.error("Veuillez entrer un pseudo pour suivre vos commandes");
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Complétée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Votre Espace Client</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre panier et suivez vos commandes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {savedOrderId ? (
          <div className="bg-card rounded-lg border p-8 text-center animate-fade-in">
            <div className="flex justify-center mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium mb-2">Commande enregistrée !</h2>
            <p className="text-muted-foreground mb-6">
              Votre commande a été enregistrée avec succès. Vous serez redirigé vers la page d'accueil dans quelques secondes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/">
                <Button size="lg">
                  Retour à l'accueil
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleTrackOrder}
              >
                Suivre ma commande
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-8">
              <TabsTrigger value="cart" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Panier ({itemCount})
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">
                <Package className="mr-2 h-4 w-4" />
                Suivi de commandes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cart">
              {items.length === 0 ? (
                <div className="bg-card rounded-lg border p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-medium mb-2">Votre panier est vide</h2>
                  <p className="text-muted-foreground mb-6">
                    Parcourez notre collection et ajoutez des cartes à votre panier.
                  </p>
                  <Link to="/inventory">
                    <Button size="lg" className="animate-fade-in">
                      Parcourir l'inventaire
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cart items */}
                  <div className="lg:col-span-2">
                    <div className="bg-card rounded-lg border overflow-hidden animate-slide-up">
                      <div className="p-4 border-b bg-muted/30">
                        <h2 className="font-medium">Articles dans votre panier ({itemCount})</h2>
                      </div>
                      
                      <div className="divide-y">
                        {items.map((item) => (
                          <div key={item.card.id} className="p-4 flex flex-col sm:flex-row gap-4">
                            {/* Card image */}
                            <div className="w-20 h-28 flex-shrink-0">
                              <img 
                                src={item.card.image} 
                                alt={item.card.nameFr || item.card.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            
                            {/* Card details */}
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                  <h3 className="font-medium">
                                    {item.card.nameFr || item.card.name}
                                    <span className="ml-1 text-sm text-muted-foreground">
                                      · {item.card.series}
                                    </span>
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    #{item.card.number}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                                      {item.card.rarity}
                                    </span>
                                    <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                                      {item.card.condition}
                                    </span>
                                    {item.card.isHolo && (
                                      <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
                                        Holo
                                      </span>
                                    )}
                                    {item.card.isReverse && (
                                      <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                                        Reverse
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end mt-2 sm:mt-0">
                                  <div className="flex gap-x-2 items-center">
                                    <span className="text-sm text-muted-foreground">
                                      {item.card.price.toFixed(2)} € × {item.quantity}
                                    </span>
                                    <p className="font-medium">{(item.card.price * item.quantity).toFixed(2)} €</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Actions */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1 border rounded-md">
                                  <button 
                                    className="p-1 hover:bg-muted transition-colors"
                                    onClick={() => updateQuantity(item.card.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                  >
                                    <ChevronDown size={16} />
                                  </button>
                                  <span className="px-2 py-1 text-sm">{item.quantity}</span>
                                  <button 
                                    className="p-1 hover:bg-muted transition-colors"
                                    onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.card.stock}
                                  >
                                    <ChevronUp size={16} />
                                  </button>
                                </div>
                                <button 
                                  className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors"
                                  onClick={() => removeFromCart(item.card.id)}
                                  aria-label="Remove item"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t">
                        <Link 
                          to="/inventory" 
                          className="flex items-center text-primary hover:underline text-sm"
                        >
                          <ArrowLeft size={16} className="mr-1" />
                          Continuer mes achats
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-card rounded-lg border overflow-hidden sticky top-20 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                      <div className="p-4 border-b bg-muted/30">
                        <h2 className="font-medium">Récapitulatif de commande</h2>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Sous-total ({itemCount} article{itemCount !== 1 ? 's' : ''})
                          </span>
                          <span>{totalPrice.toFixed(2)} €</span>
                        </div>
                        
                        <div className="flex justify-between items-center font-medium text-lg pt-2 border-t">
                          <span>Total</span>
                          <span>{totalPrice.toFixed(2)} €</span>
                        </div>
                        
                        <div className="pt-4">
                          <label htmlFor="username" className="block text-sm font-medium mb-1">
                            Votre pseudo
                          </label>
                          <input
                            id="username"
                            type="text"
                            className="w-full p-2 rounded-md border border-input mb-4"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entrez votre pseudo"
                            required
                          />
                          
                          <Button 
                            onClick={handleSubmitOrder} 
                            loading={isSubmitting}
                            disabled={isSubmitting || items.length === 0}
                            fullWidth
                            size="lg"
                          >
                            Envoyer la commande
                          </Button>
                          
                          <div className="flex mt-2 space-x-2">
                            <button 
                              onClick={clearCart}
                              className="text-sm text-destructive hover:underline w-full text-center"
                              disabled={isSubmitting || items.length === 0}
                            >
                              Vider le panier
                            </button>
                            
                            <span className="text-muted-foreground">|</span>
                            
                            <button 
                              onClick={handleTrackOrder}
                              className="text-sm text-primary hover:underline w-full text-center"
                            >
                              Suivre mes commandes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex justify-between items-center flex-wrap gap-4">
                  <h2 className="font-medium">Suivi de vos commandes</h2>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Entrez votre pseudo"
                      className="p-2 rounded-md border border-input text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => fetchUserOrders(username)}
                      loading={loadingOrders}
                      disabled={loadingOrders || !username.trim()}
                    >
                      <Search size={16} className="mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  {loadingOrders ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader size="lg" text="Chargement de vos commandes..." />
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">Aucune commande trouvée</h3>
                      <p className="text-muted-foreground mb-6">
                        Nous n'avons pas trouvé de commandes associées à ce pseudo. 
                        Vérifiez l'orthographe ou passez une nouvelle commande.
                      </p>
                      <Button 
                        onClick={() => setActiveTab("cart")} 
                        variant="outline"
                      >
                        Retour au panier
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="font-medium text-lg">
                        {userOrders.length} commande{userOrders.length > 1 ? 's' : ''} pour {username}
                      </h3>
                      
                      {userOrders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardHeader className={`p-4 border-l-4 ${
                            order.status === 'completed' 
                              ? 'border-l-green-500' 
                              : order.status === 'cancelled' 
                              ? 'border-l-red-500' 
                              : 'border-l-yellow-500'
                          }`}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                  Commande #{order.id.slice(0, 8)}
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-normal ${
                                    order.status === 'completed' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                      : order.status === 'cancelled' 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {getStatusIcon(order.status)}
                                    {getStatusText(order.status)}
                                  </span>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  <CalendarClock className="inline-block mr-1 h-3 w-3" />
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{order.totalPrice.toFixed(2)} €</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="p-4 border-t">
                              <h4 className="font-medium mb-3">Articles commandés</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {order.items.map((item) => (
                                  <div 
                                    key={item.card.id}
                                    className="flex gap-2 p-2 border rounded-md bg-muted/20"
                                  >
                                    <div className="w-10 h-14 flex-shrink-0">
                                      <img 
                                        src={item.card.image}
                                        alt={item.card.nameFr || item.card.name}
                                        className="w-full h-full object-cover rounded"
                                        loading="lazy"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">
                                        {item.card.nameFr || item.card.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.card.number} · {item.card.series}
                                      </p>
                                      <p className="text-xs">
                                        {item.quantity} × {item.card.price.toFixed(2)} €
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {order.status === 'completed' && (
                              <div className="p-4 border-t bg-green-50 dark:bg-green-900/10">
                                <div className="flex items-center text-green-600 dark:text-green-400 gap-2">
                                  <Truck size={16} />
                                  <p className="text-sm font-medium">Votre commande a été traitée et expédiée.</p>
                                </div>
                              </div>
                            )}
                            
                            {order.status === 'pending' && (
                              <div className="p-4 border-t bg-yellow-50 dark:bg-yellow-900/10">
                                <div className="flex items-center text-yellow-600 dark:text-yellow-400 gap-2">
                                  <Clock size={16} />
                                  <p className="text-sm font-medium">Votre commande est en cours de traitement.</p>
                                </div>
                              </div>
                            )}
                            
                            {order.status === 'cancelled' && (
                              <div className="p-4 border-t bg-red-50 dark:bg-red-900/10">
                                <div className="flex items-center text-red-600 dark:text-red-400 gap-2">
                                  <X size={16} />
                                  <p className="text-sm font-medium">Votre commande a été annulée.</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Cart;
