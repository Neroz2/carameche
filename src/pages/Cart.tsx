import React from "react";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CartItemsBySeries from "@/components/cart/CartItemsBySeries";
import { saveOrder } from "@/lib/orderService";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des cartes à votre panier avant de passer commande",
        variant: "destructive",
      });
      return;
    }

    try {
      // Supposons que nous avons un nom d'utilisateur fictif pour cette démo
      const username = "client@example.com";
      
      const orderId = await saveOrder(username, items);

      if (orderId) {
        toast({
          title: "Commande passée avec succès",
          description: `Commande #${orderId.substring(0, 8)} enregistrée`,
        });
        
        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur s'est produite lors du traitement de votre commande",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Votre Panier
        </h1>
        <p className="text-muted-foreground mt-2">
          {items.length === 0
            ? "Votre panier est actuellement vide"
            : `Vous avez ${items.reduce((sum, item) => sum + item.quantity, 0)} cartes dans votre panier`}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CartItemsBySeries 
            items={items} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity} 
          />
        </div>

        <div>
          <div className="bg-card border rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span>Gratuit</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-xl text-primary">{totalPrice.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={items.length === 0}
              >
                Passer commande
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/inventory")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continuer les achats
              </Button>
              
              {items.length > 0 && (
                <Button
                  variant="link"
                  className="w-full text-muted-foreground"
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
