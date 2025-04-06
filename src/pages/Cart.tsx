
import React, { useState } from "react";
import { ShoppingBag, ShoppingCart, History, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CartItemsBySeries from "@/components/cart/CartItemsBySeries";
import OrderHistory from "@/components/cart/OrderHistory";
import { saveOrder } from "@/lib/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Définir le schéma de validation pour le formulaire
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Le pseudo doit contenir au moins 3 caractères",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("cart");
  
  // Initialiser le formulaire
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleCheckout = async (values: FormValues) => {
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des cartes à votre panier avant de passer commande",
        variant: "destructive",
      });
      return;
    }

    try {
      const username = values.username.trim();
      
      const orderId = await saveOrder(username, items);

      if (orderId) {
        toast({
          title: "Commande passée avec succès",
          description: `Commande #${orderId.substring(0, 8)} enregistrée`,
        });
        
        clearCart();
        form.reset();
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
          <Tabs 
            defaultValue="cart" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
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
        </div>

        {activeTab === "cart" && (
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="username">Votre pseudo</Label>
                        <FormControl>
                          <Input
                            id="username"
                            placeholder="Entrez votre pseudo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3 pt-3">
                    <Button 
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={items.length === 0}
                    >
                      Passer commande
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/inventory")}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continuer les achats
                    </Button>
                    
                    {items.length > 0 && (
                      <Button
                        type="button"
                        variant="link"
                        className="w-full text-muted-foreground"
                        onClick={clearCart}
                      >
                        Vider le panier
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
