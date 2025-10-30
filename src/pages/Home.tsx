import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { Product, getProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/Footer';
import { Categories } from '@/components/Categories';
import { AnimatedSection } from '@/components/AnimatedSection';
import { AppSidebar } from '@/components/AppSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'discount-desc'>('relevance');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 30;
  const navigate = useNavigate();

  // Derive price bounds from data
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = products.map((p) => p.discountPrice);
    return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
  }, [products]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
    setIsLoading(false);
    // Initialize filters from URL if present
    const urlCategory = searchParams.get('cat');
    const urlQuery = searchParams.get('q');
    const urlSort = searchParams.get('sort') as typeof sortBy | null;
    const urlPrice = searchParams.get('price'); // format: min-max
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlQuery) setSearchQuery(urlQuery);
    if (urlSort && ['relevance', 'price-asc', 'price-desc', 'discount-desc'].includes(urlSort)) {
      setSortBy(urlSort);
    }
    if (urlPrice) {
      const [min, max] = urlPrice.split('-').map((v) => parseInt(v, 10));
      if (!Number.isNaN(min) && !Number.isNaN(max)) setPriceRange([min, max]);
    }
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    const [min, max] = priceRange;
    if (min || max) {
      filtered = filtered.filter((p) => p.discountPrice >= min && p.discountPrice <= max);
    }

    // Sorting
    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.discountPrice - b.discountPrice);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.discountPrice - a.discountPrice);
    if (sortBy === 'discount-desc') sorted.sort((a, b) => b.discountPercent - a.discountPercent);

    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  // Initialize price range once prices are known
  useEffect(() => {
    if (minPrice !== 0 || maxPrice !== 0) {
      setPriceRange((prev) => (prev[0] === 0 && prev[1] === 0 ? [minPrice, maxPrice] : prev));
    }
  }, [minPrice, maxPrice]);

  // Sync URL parameters
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory && selectedCategory !== 'All') params.cat = selectedCategory;
    if (searchQuery) params.q = searchQuery;
    if (sortBy !== 'relevance') params.sort = sortBy;
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
      params.price = `${priceRange[0]}-${priceRange[1]}`;
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchQuery, sortBy, priceRange, minPrice, maxPrice, setSearchParams]);

  const trendingProducts = products.filter((p) => p.trending);

  // Clear all filters function
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('relevance');
    setPriceRange([minPrice, maxPrice]);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== 'All' ||
    searchQuery !== '' ||
    sortBy !== 'relevance' ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice;

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <Header onSearch={setSearchQuery} />

      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <main className="w-full">
          <div className="w-full px-3 py-3 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full h-8 px-3 text-xs">
                  <SlidersHorizontal className="h-3 w-3 mr-1.5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1.5 h-1.5 w-1.5 bg-primary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
            </div>

            <AnimatedSection animation="scaleIn">
              <div className="rounded-xl overflow-hidden">
                <HeroCarousel />
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <Categories />
            </AnimatedSection>

            {trendingProducts.length > 0 && selectedCategory === 'All' && !searchQuery && (
              <AnimatedSection>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                    <div>
                      <h2 className="text-base font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Trending Now
                      </h2>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Most popular items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
                    <div className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-semibold text-primary">Hot</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-3 px-3">
                    {trendingProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="min-w-[140px] snap-start"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'fade-in 0.5s ease-out forwards'
                        }}
                      >
                        <ProductCard product={product} onSelect={() => {}} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
                </div>
              </AnimatedSection>
            )}

            <AnimatedSection>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-0.5 bg-gradient-to-b from-primary to-accent rounded-full flex-shrink-0"></div>
                  <div>
                    <h2 className="text-sm font-heading font-bold text-foreground">
                      {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                    </h2>
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
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    {currentProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-fade-in"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: 'fade-in 0.5s ease-out forwards'
                        }}
                      >
                        <ProductCard product={product} onSelect={() => {}} />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9 px-3"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="h-9 w-9 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9 px-3"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
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
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setPriceRange([minPrice, maxPrice]);
                      setSortBy('relevance');
                    }}
                    variant="outline"
                    className="rounded-full px-4 h-8 text-xs"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </AnimatedSection>
          </div>
        </main>

        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-base font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileFilterOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <AppSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                if (cat !== 'All') {
                  navigate(`/category/${encodeURIComponent(cat)}`);
                  setIsMobileFilterOpen(false);
                } else {
                  setSelectedCategory(cat);
                  setIsMobileFilterOpen(false);
                }
              }}
              sortBy={sortBy}
              onSortChange={setSortBy}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onClearFilters={() => {
                clearAllFilters();
                setIsMobileFilterOpen(false);
              }}
              hasActiveFilters={hasActiveFilters}
              productCount={filteredProducts.length}
              totalCount={products.length}
              isCollapsed={false}
              onToggle={() => {}}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}