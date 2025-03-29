
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, Trash, ArrowLeft, ChevronUp, ChevronDown, Search, Calendar, Clock, CheckCircle2, XCircle, Package2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/common/Button";
import { toast } from "sonner";
import { saveOrder, fetchOrdersByUsername } from "@/lib/orderService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount } = useCart();
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("cart");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Récupérer le nom d'utilisateur depuis les paramètres d'URL
  useEffect(() => {
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
      setActiveTab("orders");
      // Charger les commandes de l'utilisateur
      fetchOrders(usernameParam);
    }
  }, [searchParams]);

  const fetchOrders = async (usernameToFetch: string) => {
    if (!usernameToFetch.trim()) return;
    
    setIsLoadingOrders(true);
    try {
      const orders = await fetchOrdersByUsername(usernameToFetch);
      setUserOrders(orders);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      toast.error("Impossible de récupérer vos commandes");
    } finally {
      setIsLoadingOrders(false);
    }
  };

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
      
      // Charger les commandes de l'utilisateur pour afficher la nouvelle commande
      fetchOrders(username);
      
      // Passer à l'onglet commandes
      setActiveTab("orders");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Erreur lors de l'envoi de la commande", {
        description: "Veuillez réessayer ultérieurement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = () => {
    if (username.trim()) {
      fetchOrders(username);
      setActiveTab("orders");
    } else {
      toast.error("Veuillez entrer un pseudo pour suivre vos commandes");
    }
  };

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-500 hover:bg-green-600";
      case 'cancelled':
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return "Complétée";
      case 'cancelled':
        return "Annulée";
      default:
        return "En attente";
    }
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

  return (
    <div className="min-h-screen pb-12">
      {/* Header section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Panier & Commandes</h1>
          <div className="flex items-center mt-2">
            <input
              type="text"
              className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre pseudo"
            />
            <button 
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors flex items-center"
              onClick={handleTrackOrder}
            >
              <Search className="h-4 w-4 mr-1" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <Tabs 
          defaultValue="cart" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="cart" className="text-base">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Panier ({itemCount})
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-base">
              <Package2 className="h-4 w-4 mr-2" />
              Mes commandes
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet Panier */}
          <TabsContent value="cart">
            {savedOrderId ? (
              <div className="bg-card rounded-lg border p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium mb-2">Commande enregistrée !</h2>
                <p className="text-muted-foreground mb-6">
                  Votre commande a été enregistrée avec succès. Vous pouvez la consulter dans l'onglet "Mes commandes".
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
                    onClick={() => {
                      setActiveTab("orders");
                      setSavedOrderId(null);
                    }}
                  >
                    Voir mes commandes
                  </Button>
                </div>
              </div>
            ) : items.length === 0 ? (
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
                                    <span className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
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
          
          {/* Onglet Commandes */}
          <TabsContent value="orders">
            {isLoadingOrders ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="bg-card rounded-lg border p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Package2 className="h-16 w-16 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-medium mb-2">Aucune commande trouvée</h2>
                <p className="text-muted-foreground mb-6">
                  {username ? 
                    `Aucune commande trouvée pour le pseudo "${username}".` : 
                    "Veuillez entrer votre pseudo pour voir vos commandes."}
                </p>
                <Link to="/inventory">
                  <Button size="lg" className="animate-fade-in">
                    Parcourir l'inventaire
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">
                  Commandes de {username}
                </h2>
                
                {userOrders.map((order) => {
                  const orderDate = new Date(order.createdAt);
                  const formattedDate = format(orderDate, 'dd MMMM yyyy à HH:mm', { locale: fr });
                  const cardsBySeries = organizeCardsBySeriesAndNumber(order);
                  
                  return (
                    <Card key={order.id} className="animate-fade-in">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <CardTitle>Commande #{order.id.substring(0, 8)}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formattedDate}
                            </CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} flex items-center`}>
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {/* Organiser les cartes par série */}
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
                      
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            {order.items.reduce((total, item) => total + item.quantity, 0)} articles
                          </span>
                        </div>
                        <div className="font-bold text-lg">
                          Total: {order.totalPrice.toFixed(2)}€
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Cart;
