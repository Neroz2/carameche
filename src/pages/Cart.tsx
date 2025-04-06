
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartTabs from "@/components/cart/CartTabs";
import CartSummary from "@/components/cart/CartSummary";

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<string>("cart");
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Votre Panier
        </h1>
        <p className="text-muted-foreground mt-2">
          {activeTab === "cart" ? 
            (items.length === 0
              ? "Votre panier est actuellement vide"
              : `Vous avez ${items.reduce((sum, item) => sum + item.quantity, 0)} cartes dans votre panier`) 
            : "Consultez l'historique de vos commandes"
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
          <div>
            <CartSummary onOrderComplete={() => setActiveTab("history")} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
