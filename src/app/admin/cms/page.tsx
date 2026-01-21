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

export default function AdminProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const queryClient = useQueryClient();
  const productsApi = useProducts();

  const categories = [
    'Supplements',
    'Protein',
    'Vitamins',
    'Sports Nutrition',
    'Weight Management',
    'Health & Wellness',
  ];

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
      toast.error(
        `${error.message} Failed to add` || 'Failed to create product. Are you an admin?'
      );
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
      setProductToDelete(null);
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product. Are you an admin?');
    },
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('imageFile') as File;
    let imageUrl = formData.get('image') as string;

    if (file && file.size > 0) {
      setIsUploading(true);
      try {
        imageUrl = await productsApi.uploadImage(file);
      } catch (error: any) {
        toast.error('Failed to upload image: ' + error.message);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

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
      image: imageUrl,
      strength_mg: parseInt(formData.get('strength_mg') as string),
      flavor_profile: formData.get('flavor_profile') as string,
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
    <div className="container mx-auto py-8 px-4 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 dark:text-white">
              <div className="dark:text-white">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="dark:text-white">
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image Source</Label>
                <Input id="image" name="image" type="url" placeholder="Paste an external URL..." />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Or Upload</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" name="weight" defaultValue="10 oz" required />
              </div>
              <div>
                <Label htmlFor="featured">Featured</Label>
                <select
                  id="featured"
                  name="featured"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Tin Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="strength_mg">Strength (mg)</Label>
                    <Input id="strength_mg" name="strength_mg" type="number" defaultValue="16" />
                  </div>
                  <div>
                    <Label htmlFor="flavor_profile">Flavor Profile</Label>
                    <Input id="flavor_profile" name="flavor_profile" placeholder="e.g. Arctic / Bold" />
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isUploading || addProduct.isPending}>
                {isUploading ? 'Uploading Image...' : addProduct.isPending ? 'Saving...' : 'Save Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="dark:text-white w-[40%] md:w-auto">Name</TableHead>
            <TableHead className="dark:text-white">Price</TableHead>
            <TableHead className="dark:text-white">Inventory</TableHead>
            <TableHead className="dark:text-white hidden md:table-cell">Status</TableHead>
            <TableHead className="dark:text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map(product => (
            <TableRow key={product.id}>
              <TableCell className="dark:text-white max-w-[150px] md:max-w-none break-words">
                {product.name}
              </TableCell>
              <TableCell className="dark:text-white">${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-black dark:text-white">{product.inventory_count}</TableCell>
              <TableCell className="dark:text-white hidden md:table-cell">
                {product.available ? 'Available' : 'Unavailable'}
              </TableCell>
              <TableCell>
                <div className="flex flex-col md:flex-row gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setProductToDelete(product)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={() => {
        setProductToDelete(null);
        setDeleteConfirmation('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p>Are you sure you want to delete "{productToDelete?.name}"?</p>
              <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-confirm" className="text-sm font-medium">
                Type <span className="font-bold text-destructive">{productToDelete?.name}</span> to confirm:
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Enter product name"
                className="font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setProductToDelete(null);
              setDeleteConfirmation('');
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmation !== productToDelete?.name}
              onClick={() => {
                if (productToDelete && deleteConfirmation === productToDelete.name) {
                  deleteProduct.mutate(productToDelete.id);
                  setDeleteConfirmation('');
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={editingProduct.available.toString()}
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image Source</Label>
                <Input
                  id="edit-image"
                  name="image"
                  type="url"
                  defaultValue={editingProduct.image || ''}
                  placeholder="Paste an external URL..."
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase font-bold">Or Replace With Upload</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <Input id="edit-imageFile" name="imageFile" type="file" accept="image/*" />
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={editingProduct.featured.toString()}
                  required
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={editingProduct.category || ''}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Tin Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-strength_mg">Strength (mg)</Label>
                    <Input
                      id="edit-strength_mg"
                      name="strength_mg"
                      type="number"
                      defaultValue={editingProduct.strength_mg}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-flavor_profile">Flavor Profile</Label>
                    <Input
                      id="edit-flavor_profile"
                      name="flavor_profile"
                      defaultValue={editingProduct.flavor_profile}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button type="submit" disabled={isUploading || updateProduct.isPending}>
                  {isUploading ? 'Uploading Image...' : updateProduct.isPending ? 'Updating...' : 'Update Product'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setProductToDelete(editingProduct)}
                >
                  Delete Product
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
