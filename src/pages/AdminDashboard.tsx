import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useFirebaseProducts } from '@/contexts/FirebaseProductContext';
import { addProduct, updateProduct, deleteProduct, Product } from '@/lib/firebase-db';
import { uploadToImageKit } from '@/lib/imagekit';
import { toast } from 'sonner';

const CATEGORIES = ['Sarees', 'Kurtis', 'Lehengas', 'Dresses', 'Accessories', 'Jewelry'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { products, refreshProducts } = useFirebaseProducts();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    fabric: '',
    originalPrice: 0,
    discountPrice: 0,
    stock: true,
    trending: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToImageKit(files[i]);
        setImages(prev => [...prev, url]);
        toast.success(`Image ${i + 1} uploaded successfully`);
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.originalPrice || images.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const discountPercent = Math.round(
        ((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100
      );

      const productData = {
        ...formData,
        discountPercent,
        images,
        originalPrice: Number(formData.originalPrice),
        discountPrice: Number(formData.discountPrice),
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }

      await refreshProducts();
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      toast.error('Failed to save product');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      await refreshProducts();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      fabric: product.fabric || '',
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      stock: product.stock,
      trending: product.trending,
    });
    setImages(product.images);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      fabric: '',
      originalPrice: 0,
      discountPrice: 0,
      stock: true,
      trending: false,
    });
    setImages([]);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Manage your products</p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
              className="rounded-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full h-9 w-9"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full h-9 w-9"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {product.category}
                  </span>
                  {product.trending && (
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                      Trending
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">₹{product.discountPrice}</p>
                    {product.discountPercent > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: product.stock ? '#10b98120' : '#ef444420',
                      color: product.stock ? '#059669' : '#dc2626'
                    }}
                  >
                    {product.stock ? 'In Stock' : 'Out'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Update product details' : 'Create a new product with images and details'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Elegant Silk Saree"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-lg border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="rounded-lg border-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the product..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-lg border-2 min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fabric" className="text-sm font-semibold">Fabric</Label>
                <Input
                  id="fabric"
                  placeholder="e.g., Silk, Cotton"
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  className="rounded-lg border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">Original Price *</Label>
                <Input
                  id="original-price"
                  type="number"
                  placeholder="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="rounded-lg border-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount-price" className="text-sm font-semibold">Discount Price</Label>
                <Input
                  id="discount-price"
                  type="number"
                  placeholder="0"
                  value={formData.discountPrice || ''}
                  onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                  className="rounded-lg border-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Discount %</Label>
                <div className="h-11 rounded-lg border-2 border-input bg-muted flex items-center px-3">
                  <span className="text-sm font-semibold">
                    {formData.originalPrice && formData.discountPrice
                      ? Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-sm font-semibold">
                Upload Images * ({images.length} uploaded)
              </Label>
              <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload images</span>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.trending}
                  onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Mark as Trending</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 h-11 rounded-lg font-semibold"
              >
                {editingId ? 'Update Product' : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-lg font-semibold"
                onClick={() => {
                  resetForm();
                  setOpenDialog(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
