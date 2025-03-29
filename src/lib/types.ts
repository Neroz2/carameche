
export interface PokemonSeries {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  releaseDate: string;
  totalCards: number;
}

export interface PokemonCard {
  id: string;
  name: string;
  nameEn: string;
  nameFr: string;
  number: string;
  series: string;
  rarity: string;
  image: string;
  price: number;
  stock: number;
  condition: string;
  language: string;
  isHolo: boolean;
  isReverse: boolean;
  isPromo: boolean;
  expansionId?: number;
}

export interface CartItem {
  card: PokemonCard;
  quantity: number;
}

export interface Order {
  id: string;
  username: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface SupabaseOrder {
  id: string;
  username: string;
  total_price: number;
  total_items: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  card_id: string;
  card_name: string;
  card_number: string;
  card_series: string;
  card_image: string;
  price: number;
  quantity: number;
}

export type SortOption = "name-asc" | "name-desc" | "number-asc" | "number-desc" | "price-asc" | "price-desc";

export type ViewMode = "grid" | "list";

export interface FilterOptions {
  search: string;
  series: string[];
  rarity: string[];
  priceMin: number;
  priceMax: number;
  condition: string[];
  language: string[];
  isHolo: boolean | null; // Conservé pour compatibilité mais on ne l'utilisera plus dans l'UI
  isReverse: boolean | null;
  isPromo: boolean | null;
  expansionId?: number | null;
}
