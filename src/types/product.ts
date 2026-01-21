export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory_count: number;
  stripe_product_id: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
  image: string | null;
  tagline: string | null;
  weight: string | null; // Used for "Quantity per tin"
  featured: boolean;
  category: string | null;
  strength_mg?: number;
  flavor_profile?: string;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  stripe_product_id?: string | null;
};
export type ProductUpdate = Partial<ProductInsert>;
