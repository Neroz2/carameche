
import React from "react";
import { ShoppingCart, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartItem } from "@/lib/types";
import CartItemsBySeries from "@/components/cart/CartItemsBySeries";
import OrderHistory from "@/components/cart/OrderHistory";

interface CartTabsProps {
  items: CartItem[];
  removeFromCart: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const CartTabs: React.FC<CartTabsProps> = ({
  items,
  removeFromCart,
  updateQuantity,
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs 
      defaultValue="cart" 
      className="w-full"
      onValueChange={(value) => onTabChange(value)}
    >
      <TabsList className="w-full mb-6">
        <TabsTrigger value="cart" className="flex-1">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Panier
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-1">
          <History className="mr-2 h-4 w-4" />
          Historique
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="cart">
        <CartItemsBySeries 
          items={items} 
          removeFromCart={removeFromCart} 
          updateQuantity={updateQuantity} 
        />
      </TabsContent>
      
      <TabsContent value="history">
        <OrderHistory />
      </TabsContent>
    </Tabs>
  );
};

export default CartTabs;
