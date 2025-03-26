
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash, ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/common/Button";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, itemCount } = useCart();
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Prepare order data
    const orderData = {
      username,
      items,
      totalPrice,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    try {
      // In a real app, this would send to Supabase
      console.log("Submitting order:", orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      toast.success("Commande envoyée avec succès !", {
        description: "Votre commande a été enregistrée et sera traitée prochainement."
      });
      
      // Clear cart after successful order
      clearCart();
      setUsername("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Erreur lors de l'envoi de la commande", {
        description: "Veuillez réessayer ultérieurement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Votre Panier</h1>
          <p className="text-muted-foreground mt-1">
            {itemCount} article{itemCount !== 1 ? 's' : ''} dans votre panier
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
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
                    
                    <button 
                      onClick={clearCart}
                      className="text-sm text-destructive hover:underline mt-2 w-full text-center"
                      disabled={isSubmitting || items.length === 0}
                    >
                      Vider le panier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
