
import { supabase } from "@/integrations/supabase/client";
import { CartItem, Order, PokemonCard, SupabaseOrder } from "@/lib/types";

// Récupère toutes les commandes
export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    // Récupérer toutes les commandes
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    if (!ordersData) return [];

    // Convertir les données JSON en objets Order
    const orders: Order[] = ordersData.map((order: SupabaseOrder) => {
      // Parse the card_data JSON to get the items
      const items: CartItem[] = order.card_data.map((item: any) => ({
        card: {
          id: item.card_id,
          name: item.card_name,
          nameEn: item.card_name,
          nameFr: item.card_name,
          number: item.card_number,
          series: item.card_series,
          rarity: item.rarity || '',
          image: item.card_image,
          price: item.price,
          stock: 0,
          condition: item.condition || '',
          language: item.language || '',
          isHolo: item.is_holo || false,
          isReverse: item.is_reverse || false,
          isPromo: item.is_promo || false
        },
        quantity: item.quantity
      }));

      return {
        id: order.id,
        username: order.username,
        items: items,
        totalPrice: order.total_price,
        createdAt: order.created_at,
        status: order.status as 'pending' | 'completed' | 'cancelled'
      };
    });

    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
};

// Récupère les commandes d'un utilisateur spécifique par son pseudo
export const fetchOrdersByUsername = async (username: string): Promise<Order[]> => {
  try {
    // Récupérer les commandes de l'utilisateur
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    if (!ordersData) return [];

    // Convertir les données JSON en objets Order
    const orders: Order[] = ordersData.map((order: SupabaseOrder) => {
      // Parse the card_data JSON to get the items
      const items: CartItem[] = order.card_data.map((item: any) => ({
        card: {
          id: item.card_id,
          name: item.card_name,
          nameEn: item.card_name,
          nameFr: item.card_name,
          number: item.card_number,
          series: item.card_series,
          rarity: item.rarity || '',
          image: item.card_image,
          price: item.price,
          stock: 0,
          condition: item.condition || '',
          language: item.language || '',
          isHolo: item.is_holo || false,
          isReverse: item.is_reverse || false,
          isPromo: item.is_promo || false
        },
        quantity: item.quantity
      }));

      return {
        id: order.id,
        username: order.username,
        items: items,
        totalPrice: order.total_price,
        createdAt: order.created_at,
        status: order.status as 'pending' | 'completed' | 'cancelled'
      };
    });

    return orders;
  } catch (error) {
    console.error(`Erreur lors de la récupération des commandes pour ${username}:`, error);
    throw error;
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', error);
    throw error;
  }
};

// Sauvegarder une nouvelle commande
export const saveOrder = async (username: string, items: CartItem[]): Promise<string> => {
  try {
    // Calculer le total
    const totalPrice = items.reduce((total, item) => total + (item.card.price * item.quantity), 0);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    // Préparer les données du panier au format JSON
    const cardData = items.map(item => ({
      card_id: item.card.id,
      card_name: item.card.nameFr || item.card.name,
      card_number: item.card.number,
      card_series: item.card.series,
      card_image: item.card.image,
      price: item.card.price,
      quantity: item.quantity,
      rarity: item.card.rarity,
      condition: item.card.condition,
      language: item.card.language,
      is_holo: item.card.isHolo,
      is_reverse: item.card.isReverse,
      is_promo: item.card.isPromo
    }));

    // Insérer la commande avec toutes les données
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        username,
        card_data: cardData,
        total_price: totalPrice,
        total_items: totalItems,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) throw orderError;
    if (!orderData) throw new Error("Échec de création de la commande");

    return orderData.id;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la commande:', error);
    throw error;
  }
};
