import { Product, ProductInsert, ProductUpdate } from '@/types/product';
import { useSupabaseClient } from '@/hooks/clerk/useSupabaseClient';

export const useProducts = () => {
  const supabase = useSupabaseClient();

  return {
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
      console.log('Creating product:', product);
      try {
        const { data, error } = await supabase.from('products').insert(product).select().single();

        if (error) {
          console.error('Supabase error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }
        return data as Product;
      } catch (error) {
        console.error('Error creating product:', error);
        throw error;
      }
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
};
