
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { PokemonCard, CartItem } from "@/lib/types";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addToCart: (card: PokemonCard, quantity?: number) => void;
  removeFromCart: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  itemCount: 0,
  totalPrice: 0,
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "pokecartopia-cart";

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (card: PokemonCard, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.card.id === card.id);
      
      if (existingItem) {
        // S'il y a déjà cet article dans le panier avec quantité négative, on supprime l'élément
        if (existingItem.quantity + quantity <= 0) {
          toast("Carte supprimée du panier", {
            description: existingItem.card.nameFr || existingItem.card.name,
          });
          return prevItems.filter(item => item.card.id !== card.id);
        }
        
        // Make sure we don't exceed the available stock
        const newQuantity = Math.min(existingItem.quantity + quantity, card.stock);
        
        if (newQuantity === existingItem.quantity && quantity > 0) {
          toast("Quantité maximale atteinte", {
            description: `Vous ne pouvez pas ajouter plus de ${card.stock} exemplaires de cette carte`,
          });
          return prevItems;
        }
        
        toast("Carte ajoutée au panier", {
          description: `Quantité mise à jour: ${newQuantity}`,
        });
        
        return prevItems.map((item) =>
          item.card.id === card.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Ne pas ajouter de carte si la quantité est négative ou nulle
        if (quantity <= 0) return prevItems;
        
        toast("Carte ajoutée au panier", {
          description: card.nameFr || card.name,
        });
        
        return [...prevItems, { card, quantity: Math.min(quantity, card.stock) }];
      }
    });
  };

  const removeFromCart = (cardId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.card.id === cardId);
      if (item) {
        toast("Carte supprimée du panier", {
          description: item.card.nameFr || item.card.name,
        });
      }
      return prevItems.filter((item) => item.card.id !== cardId);
    });
  };

  const updateQuantity = (cardId: string, quantity: number) => {
    setItems((prevItems) => 
      prevItems.map((item) => {
        if (item.card.id === cardId) {
          // Make sure we don't exceed the available stock
          const newQuantity = Math.min(quantity, item.card.stock);
          
          if (newQuantity !== quantity) {
            toast("Quantité maximale atteinte", {
              description: `Vous ne pouvez pas ajouter plus de ${item.card.stock} exemplaires de cette carte`,
            });
          }
          
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    toast("Panier vidé", {
      description: "Toutes les cartes ont été supprimées du panier",
    });
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (total, item) => total + item.card.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
