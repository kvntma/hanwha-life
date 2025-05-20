import { createClient } from '@supabase/supabase-js';
import { Product, ProductInsert, ProductUpdate } from '@/types/product';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const productsApi = {
  // Get all available products
  getProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  // Get a single product by ID
  getProduct: async (id: string) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error) throw error;
    return data as Product;
  },

  // Create a new product
  createProduct: async (product: ProductInsert) => {
    const { data, error } = await supabase.from('products').insert(product).select().single();

    if (error) throw error;
    return data as Product;
  },

  // Update a product
  updateProduct: async (id: string, product: ProductUpdate) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  // Delete a product
  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;
  },

  // Update inventory count
  updateInventory: async (id: string, count: number) => {
    const { data, error } = await supabase
      .from('products')
      .update({ inventory_count: count })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },
};
