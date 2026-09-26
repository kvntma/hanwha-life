import { recordFailure, recordSuccess } from '@/lib/alerts/failure-tracker';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/product';

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    recordFailure('supabase:getProducts', error);
    throw error;
  }

  recordSuccess('supabase:getProducts');
  return data as Product[];
}

export async function getFeaturedProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    recordFailure('supabase:getFeaturedProducts', error);
    throw error;
  }

  recordSuccess('supabase:getFeaturedProducts');
  return data as Product[];
}

export async function getProduct(id: string) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    recordFailure('supabase:getProduct', error);
    console.error('Error fetching product:', error);
    return null;
  }

  recordSuccess('supabase:getProduct');
  return product;
}
