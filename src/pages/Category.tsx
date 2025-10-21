import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, getProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/Footer';

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount-desc'>('relevance');
  const [isLoading, setIsLoading] = useState(true);

  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = products.map((p) => p.discountPrice);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 0]);
  const [tempSortBy, setTempSortBy] = useState(sortBy);

  useEffect(() => {
    const allProducts = getProducts();
    const categoryProducts = allProducts.filter((p) => p.category === category);
    setProducts(categoryProducts);
    setFilteredProducts(categoryProducts);
    setIsLoading(false);
  }, [category]);

  useEffect(() => {
    if (minPrice !== 0 || maxPrice !== 0) {
      setPriceRange([minPrice, maxPrice]);
      setTempPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    let filtered = products;

    const [min, max] = priceRange;
    if (min || max) {
      filtered = filtered.filter((p) => p.discountPrice >= min && p.discountPrice <= max);
    }

    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.discountPrice - b.discountPrice);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.discountPrice - a.discountPrice);
    if (sortBy === 'discount-desc') sorted.sort((a, b) => b.discountPercent - a.discountPercent);

    setFilteredProducts(sorted);
  }, [products, priceRange, sortBy]);

  const handleApplyFilters = () => {
    setPriceRange(tempPriceRange);
    setSortBy(tempSortBy);
  };

  const handleResetFilters = () => {
    setTempPriceRange([minPrice, maxPrice]);
    setPriceRange([minPrice, maxPrice]);
    setTempSortBy('relevance');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    sortBy !== 'relevance' ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice;

  if (!category) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b shadow-sm">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-base font-heading font-bold">{category}</h1>
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="w-full px-3 py-3 space-y-4">
          <div className="bg-card rounded-xl border p-4 space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-2">Price Range</h3>
                <div className="space-y-3">
                  <div className="px-3 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <p className="text-xs font-bold text-primary text-center">
                      ₹{tempPriceRange[0].toLocaleString()} - ₹{tempPriceRange[1].toLocaleString()}
                    </p>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={[tempPriceRange[0], tempPriceRange[1]]}
                      onValueChange={(v) => setTempPriceRange([v[0], v[1]])}
                      min={minPrice}
                      max={maxPrice}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>₹{minPrice.toLocaleString()}</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-2">Sort By</h3>
                <Select value={tempSortBy} onValueChange={(v) => setTempSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-full h-10 text-sm">
                    <SelectValue placeholder="Sort products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance" className="text-sm">Relevance</SelectItem>
                    <SelectItem value="price-asc" className="text-sm">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="text-sm">Price: High to Low</SelectItem>
                    <SelectItem value="discount-desc" className="text-sm">Discount: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 h-10 text-sm font-semibold"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="flex-1 h-10 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-0.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <div>
                <h2 className="text-sm font-heading font-bold text-foreground">Products</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-2.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
                >
                  <ProductCard product={product} onSelect={setSelectedProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-sm font-heading font-bold mb-1.5">No products found</h3>
              <p className="text-muted-foreground text-xs mb-3 px-4">
                Try adjusting your filters
              </p>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="rounded-full px-4 h-8 text-xs"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <Footer />
    </div>
  );
}
