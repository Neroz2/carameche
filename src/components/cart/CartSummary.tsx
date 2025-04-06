
import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form validation schema
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Le pseudo doit contenir au moins 3 caractères",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CartSummaryProps {
  onOrderComplete: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onOrderComplete }) => {
  const { items, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize form
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
        onOrderComplete();
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
  );
};

export default CartSummary;
