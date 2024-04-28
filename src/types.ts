import { Database, Json } from "./database.types";

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

export type Product = {
  avg_rating: number | null
  brand: string | null
  category: string | null
  count: number | null
  created_at: string
  description: string | null
  id: string
  image: string | null
  images: string[] | null
  old_price: number | null
  price: number | null
  product_details: Json | null
  ratings: number | null
  sub_category: string | null
  title: string | null
  discount: number | null
};

export type Address = {
  city: string | null
  country: string | null
  created_at: string
  email: string | null
  first_name: string | null
  id: string
  is_selected: boolean | null
  last_name: string | null
  phone: string | null
  state: string | null
  street: string | null
  street2: string | null
  user_id: string | null
  zip_code: string | null
}

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
  product_id: string;
};


export const OrderStatusList: OrderStatus[] = [
  "NEW",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export type OrderStatus = "NEW" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export type Order = {
  address_id?: string
  created_at?: string
  id?: string
  status?: OrderStatus | null
  total: number
  user_id: string | null
  order_items?: OrderItem[];
  //processed_at?: Date | null
};

export type OrderItem = {
  id: string;
  quantity: number;
  product: Product;
  product_id: string;
  order_id: string;
};

export type Profile = {
  id: string;
  group?: string;
  avatar_url: string;
  email: string;
  full_name: string;
  phone: string;
};

export type Apod = {
  date: string;

  url: string;
  hdurl: string;

  title: string;
  explanation: string;

  copyright?: string;
};
