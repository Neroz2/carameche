
import React from "react";

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
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (username && orders.length === 0) {
    return (
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          Aucune commande trouvée pour le pseudo "{username}".
        </p>
      </div>
    );
  }
  
  if (!username) {
    return (
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          Entrez votre pseudo pour voir votre historique de commandes.
        </p>
      </div>
    );
  }
  
  return null;
};

export default OrderStatusMessage;
