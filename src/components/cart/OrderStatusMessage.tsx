
import React from "react";
import { AlertCircle, Clock, Search } from "lucide-react";

interface OrderStatusMessageProps {
  loading: boolean;
  username: string;
  orders: any[];
}

const OrderStatusMessage: React.FC<OrderStatusMessageProps> = ({ 
  loading, 
  username, 
  orders 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-card border rounded-lg animate-pulse">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground text-sm">Chargement des commandes...</p>
      </div>
    );
  }
  
  if (username && orders.length === 0) {
    return (
      <div className="flex flex-col items-center p-8 bg-card border rounded-lg text-center animate-fade-in">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-3" />
        <h3 className="font-medium text-lg mb-1">Aucune commande trouvée</h3>
        <p className="text-muted-foreground max-w-md">
          Nous n'avons trouvé aucune commande associée au pseudo "<span className="font-medium">{username}</span>".
          Vérifiez l'orthographe ou essayez un autre pseudo.
        </p>
      </div>
    );
  }
  
  if (!username) {
    return (
      <div className="flex flex-col items-center p-8 bg-card border rounded-lg text-center animate-fade-in">
        <Search className="h-10 w-10 text-primary/60 mb-3" />
        <h3 className="font-medium text-lg mb-1">Recherchez vos commandes</h3>
        <p className="text-muted-foreground max-w-md">
          Entrez votre pseudo dans le champ ci-dessus pour consulter 
          l'historique de vos commandes.
        </p>
      </div>
    );
  }
  
  return null;
};

export default OrderStatusMessage;
