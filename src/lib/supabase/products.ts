import { Product, ProductInsert, ProductUpdate } from '@/types/product';
import { createClient } from '@/lib/supabase/browser';
import { useState } from 'react';

export const useProducts = () => {
  const [supabase] = useState(() => createClient());

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

    // Upload an image to the storage bucket
    uploadImage: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage.from('product-images').upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);

      return publicUrl;
    },
  };
};
