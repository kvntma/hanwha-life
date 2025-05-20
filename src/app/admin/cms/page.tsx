'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProducts } from '@/lib/supabase/products';
import { Product, ProductInsert } from '@/types/product';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import DebugToken from '@/components/common/debug-token';

export default function AdminProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const productsApi = useProducts();

  // Fetch products
  const {
    data: products,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getProducts,
  });

  // Add product mutation
  const addProduct = useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddDialogOpen(false);
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product. Are you an admin?');
    },
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productsApi.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product. Are you an admin?');
    },
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product. Are you an admin?');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      inventory_count: parseInt(formData.get('inventory_count') as string),
      available: formData.get('available') === 'true',
      tagline: formData.get('tagline') as string,
      weight: formData.get('weight') as string,
      featured: formData.get('featured') === 'true',
      category: formData.get('category') as string,
      nutrition: formData.get('calories')
        ? {
            calories: parseInt(formData.get('calories') as string),
            protein: parseInt(formData.get('protein') as string),
            carbs: parseInt(formData.get('carbs') as string),
            fat: parseInt(formData.get('fat') as string),
          }
        : undefined,
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct.id, product: productData });
    } else {
      addProduct.mutate(productData as ProductInsert);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (fetchError) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">
          Error loading products: {fetchError.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <DebugToken />
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" name="tagline" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="inventory_count">Inventory Count</Label>
                <Input id="inventory_count" name="inventory_count" type="number" required />
              </div>
              <div>
                <Label htmlFor="available">Available</Label>
                <select
                  id="available"
                  name="available"
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" name="weight" required />
              </div>
              <div>
                <Label htmlFor="featured">Featured</Label>
                <select
                  id="featured"
                  name="featured"
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" required />
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Nutrition Information (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input id="calories" name="calories" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input id="protein" name="protein" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input id="carbs" name="carbs" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input id="fat" name="fat" type="number" />
                  </div>
                </div>
              </div>
              <Button type="submit">Save Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.inventory_count}</TableCell>
              <TableCell>{product.available ? 'Available' : 'Unavailable'}</TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct.mutate(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingProduct.name} required />
              </div>
              <div>
                <Label htmlFor="edit-tagline">Tagline</Label>
                <Input
                  id="edit-tagline"
                  name="tagline"
                  defaultValue={editingProduct.tagline || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingProduct.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct.price}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-inventory_count">Inventory Count</Label>
                <Input
                  id="edit-inventory_count"
                  name="inventory_count"
                  type="number"
                  defaultValue={editingProduct.inventory_count}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-available">Available</Label>
                <select
                  id="edit-available"
                  name="available"
                  className="w-full p-2 border rounded"
                  defaultValue={editingProduct.available.toString()}
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-weight">Weight</Label>
                <Input
                  id="edit-weight"
                  name="weight"
                  defaultValue={editingProduct.weight || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-featured">Featured</Label>
                <select
                  id="edit-featured"
                  name="featured"
                  className="w-full p-2 border rounded"
                  defaultValue={editingProduct.featured.toString()}
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  name="category"
                  defaultValue={editingProduct.category || ''}
                  required
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Nutrition Information (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-calories">Calories</Label>
                    <Input
                      id="edit-calories"
                      name="calories"
                      type="number"
                      defaultValue={editingProduct.nutrition?.calories}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-protein">Protein (g)</Label>
                    <Input
                      id="edit-protein"
                      name="protein"
                      type="number"
                      defaultValue={editingProduct.nutrition?.protein}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-carbs">Carbs (g)</Label>
                    <Input
                      id="edit-carbs"
                      name="carbs"
                      type="number"
                      defaultValue={editingProduct.nutrition?.carbs}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-fat">Fat (g)</Label>
                    <Input
                      id="edit-fat"
                      name="fat"
                      type="number"
                      defaultValue={editingProduct.nutrition?.fat}
                    />
                  </div>
                </div>
              </div>
              <Button type="submit">Update Product</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
