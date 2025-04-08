
import React, { useState } from "react";
import { ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartTabs from "@/components/cart/CartTabs";
import CartSummary from "@/components/cart/CartSummary";

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<string>("cart");
  
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <header className="mb-8 border-b pb-4">
        <h1 className="page-title text-3xl font-bold flex items-center gap-3 mb-2 text-primary">
          <ShoppingCart className="h-8 w-8" />
          {activeTab === "cart" ? "Votre Panier" : "Historique des Commandes"}
        </h1>
        <p className="subtitle text-muted-foreground mt-2 flex items-center gap-2">
          {activeTab === "cart" ? 
            (items.length === 0 ? (
              <span className="text-muted-foreground">Votre panier est actuellement vide</span>
            ) : (
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>
                  Vous avez <span className="font-medium text-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)}</span> cartes dans votre panier
                </span>
              </span>
            )) : (
              <span>Consultez l'historique de vos commandes passées</span>
            )
          }
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CartTabs 
            items={items}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value)}
          />
        </div>

        {activeTab === "cart" && (
          <div className="animate-fade-in">
            <CartSummary onOrderComplete={() => setActiveTab("history")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
