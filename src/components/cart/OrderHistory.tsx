
import React, { useState, useEffect } from "react";
import { fetchOrdersByUsername } from "@/lib/orderService";
import { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import OrderSearchForm from "./OrderSearchForm";
import OrderCard from "./OrderCard";
import OrderStatusMessage from "./OrderStatusMessage";

const OrderHistory: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim().length < 3) {
      toast({
        title: "Pseudo invalide",
        description: "Le pseudo doit contenir au moins 3 caractères",
        variant: "destructive",
      });
      return;
    }
    setUsername(searchUsername.trim());
  };

  useEffect(() => {
    const loadOrders = async () => {
      if (!username) {
        setOrders([]);
        return;
      }
      
      setLoading(true);
      
      try {
        const userOrders = await fetchOrdersByUsername(username);
        setOrders(userOrders);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des commandes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [username, toast]);

  return (
    <div className="space-y-6">
      <OrderSearchForm 
        searchUsername={searchUsername}
        setSearchUsername={setSearchUsername}
        handleSearch={handleSearch}
      />

      <OrderStatusMessage 
        loading={loading} 
        username={username} 
        orders={orders} 
      />

      {!loading && username && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
