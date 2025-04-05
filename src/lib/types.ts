
export interface PokemonSeries {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  releaseDate: string;
  totalCards: number;
  block?: string;
  description?: string;
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
  isHolo: boolean | null;
  isReverse: boolean | null;
  isPromo: boolean | null;
  expansionId?: number | null;
}

// Add Supabase database types to align with our database schema
export interface SupabaseOrder {
  id: string;
  username: string;
  card_data: any[];
  total_price: number;
  total_items: number;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled';
}
