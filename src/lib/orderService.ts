
import { supabase } from "@/integrations/supabase/client";
import { CartItem, Order, SupabaseOrder, SupabaseOrderItem, PokemonCard } from "@/lib/types";

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

    // Créer une liste pour stocker les commandes complètes (avec les items)
    const fullOrders: Order[] = [];

    // Pour chaque commande, récupérer ses items
    for (const order of ordersData) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;

      // Convertir les items de la base de données en CartItems
      const cartItems: CartItem[] = itemsData?.map(item => ({
        card: {
          id: item.card_id,
          name: item.card_name,
          nameEn: item.card_name,
          nameFr: item.card_name,
          number: item.card_number,
          series: item.card_series,
          rarity: '',
          image: item.card_image,
          price: item.price,
          stock: 0,
          condition: '',
          language: '',
          isHolo: false,
          isReverse: item.is_reverse || false,
          isPromo: false
        },
        quantity: item.quantity
      })) || [];

      // Créer l'objet Order complet
      fullOrders.push({
        id: order.id,
        username: order.username,
        items: cartItems,
        totalPrice: order.total_price,
        createdAt: order.created_at,
        status: order.status as 'pending' | 'completed' | 'cancelled'
      });
    }

    return fullOrders;
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

    // Créer une liste pour stocker les commandes complètes (avec les items)
    const userOrders: Order[] = [];

    // Pour chaque commande, récupérer ses items
    for (const order of ordersData) {
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;

      // Convertir les items de la base de données en CartItems
      const cartItems: CartItem[] = itemsData?.map(item => ({
        card: {
          id: item.card_id,
          name: item.card_name,
          nameEn: item.card_name,
          nameFr: item.card_name,
          number: item.card_number,
          series: item.card_series,
          rarity: '',
          image: item.card_image,
          price: item.price,
          stock: 0,
          condition: '',
          language: '',
          isHolo: false,
          isReverse: item.is_reverse || false,
          isPromo: false
        },
        quantity: item.quantity
      })) || [];

      // Créer l'objet Order complet
      userOrders.push({
        id: order.id,
        username: order.username,
        items: cartItems,
        totalPrice: order.total_price,
        createdAt: order.created_at,
        status: order.status as 'pending' | 'completed' | 'cancelled'
      });
    }

    return userOrders;
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

    // Insérer la commande
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        username,
        total_price: totalPrice,
        total_items: totalItems,
        status: 'pending'
      })
      .select('id')
      .single();

    if (orderError) throw orderError;
    if (!orderData) throw new Error("Échec de création de la commande");

    const orderId = orderData.id;

    // Préparer les items de la commande
    const orderItems = items.map(item => ({
      order_id: orderId,
      card_id: item.card.id,
      card_name: item.card.nameFr || item.card.name,
      card_number: item.card.number,
      card_series: item.card.series,
      card_image: item.card.image,
      price: item.card.price,
      quantity: item.quantity,
      is_reverse: item.card.isReverse  // Utilisation du champ is_reverse dans le schema
    }));

    // Insérer les items de la commande
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderId;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la commande:', error);
    throw error;
  }
};
