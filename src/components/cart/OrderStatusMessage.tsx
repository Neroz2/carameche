
import React from "react";
import { AlertCircle, Clock, Search, Package2 } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center p-8 bg-card border rounded-lg animate-pulse shadow-sm">
        <div className="relative">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <Clock className="h-5 w-5 text-muted-foreground absolute inset-0 m-auto" />
        </div>
        <p className="text-muted-foreground mt-2">Chargement des commandes...</p>
      </div>
    );
  }
  
  if (username && orders.length === 0) {
    return (
      <div className="flex flex-col items-center p-8 bg-card border rounded-lg text-center animate-fade-in shadow-sm">
        <div className="bg-amber-100 p-3 rounded-full mb-3">
          <AlertCircle className="h-6 w-6 text-amber-500" />
        </div>
        <h3 className="font-medium text-lg mb-2">Aucune commande trouvée</h3>
        <p className="text-muted-foreground max-w-md">
          Nous n'avons trouvé aucune commande associée au pseudo "<span className="font-medium text-foreground">{username}</span>".
          Vérifiez l'orthographe ou essayez un autre pseudo.
        </p>
      </div>
    );
  }
  
  if (!username) {
    return (
      <div className="flex flex-col items-center p-8 bg-card border rounded-lg text-center animate-fade-in shadow-sm">
        <div className="bg-primary/10 p-3 rounded-full mb-3">
          <Package2 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium text-lg mb-2">Historique de vos commandes</h3>
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
