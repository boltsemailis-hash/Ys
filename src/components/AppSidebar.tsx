import { Filter, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CATEGORIES } from '@/lib/mockData';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'discount-desc';
  onSortChange: (sort: 'relevance' | 'price-asc' | 'price-desc' | 'discount-desc') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  productCount: number;
  totalCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileSheet?: boolean;
  onMobileClose?: () => void;
}

export const AppSidebar = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  onClearFilters,
  hasActiveFilters,
  productCount,
  totalCount,
  isCollapsed,
  onToggle,
  isMobileSheet = false,
  onMobileClose,
}: AppSidebarProps) => {
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange);
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempSortBy, setTempSortBy] = useState(sortBy);

  useEffect(() => {
    setTempPriceRange(priceRange);
    setTempCategory(selectedCategory);
    setTempSortBy(sortBy);
  }, [priceRange, selectedCategory, sortBy]);

  const handleApplyFilters = () => {
    onPriceRangeChange(tempPriceRange);
    onSelectCategory(tempCategory);
    onSortChange(tempSortBy);
    if (isMobileSheet && onMobileClose) {
      onMobileClose();
    }
  };

  const handleResetFilters = () => {
    setTempPriceRange([minPrice, maxPrice]);
    setTempCategory('All');
    setTempSortBy('relevance');
    onClearFilters();
    if (isMobileSheet && onMobileClose) {
      onMobileClose();
    }
  };


  return (
    <aside className={cn("h-full bg-card flex flex-col transition-all duration-300 relative", isMobileSheet ? "border-0" : "", isCollapsed ? "w-16" : "w-full")}>
      {!isMobileSheet && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-2 sm:top-3 md:top-4 z-50 h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 bg-card shadow-lg hover:bg-accent hover:scale-110 transition-all duration-200"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
        </Button>
      )}

      {isMobileSheet && (
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters & Sort
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {productCount} of {totalCount} products
          </p>
        </div>
      )}

      <div className={cn("space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 flex-1 overflow-y-auto", isCollapsed ? "p-1.5 sm:p-2" : isMobileSheet ? "p-4" : "p-3 sm:p-4 md:p-5 lg:p-6")}>
        {!isCollapsed ? (
          <div>
            {!isMobileSheet && (
              <>
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold flex items-center gap-1.5 sm:gap-2">
                    <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary" />
                    <span>Filters</span>
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearFilters}
                      className="h-6 sm:h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs"
                    >
                      <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      <span className="hidden sm:inline">Reset</span>
                    </Button>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-2.5 md:p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-[10px] sm:text-xs md:text-sm font-medium">
                      {productCount} of {totalCount}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <div>
                <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1.5 sm:mb-2 md:mb-3">Category</h3>
                <div className="space-y-0.5 sm:space-y-1">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={(isMobileSheet ? tempCategory : selectedCategory) === category ? 'default' : 'ghost'}
                      className="w-full justify-start text-[10px] sm:text-xs md:text-sm h-7 sm:h-8 md:h-9 transition-all"
                      size="sm"
                      onClick={() => isMobileSheet ? setTempCategory(category) : onSelectCategory(category)}
                    >
                      <span className="truncate">{category}</span>
                      {(isMobileSheet ? tempCategory : selectedCategory) === category && (
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-auto flex-shrink-0" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1.5 sm:mb-2 md:mb-3">Price Range</h3>
                <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                  <div className="px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-primary text-center">
                      ₹{(isMobileSheet ? tempPriceRange[0] : priceRange[0]).toLocaleString()} - ₹{(isMobileSheet ? tempPriceRange[1] : priceRange[1]).toLocaleString()}
                    </p>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={isMobileSheet ? [tempPriceRange[0], tempPriceRange[1]] : [priceRange[0], priceRange[1]]}
                      onValueChange={(v) => isMobileSheet ? setTempPriceRange([v[0], v[1]]) : onPriceRangeChange([v[0], v[1]])}
                      min={minPrice}
                      max={maxPrice}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground px-1">
                    <span>₹{minPrice.toLocaleString()}</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1.5 sm:mb-2 md:mb-3">Sort By</h3>
                <Select value={isMobileSheet ? tempSortBy : sortBy} onValueChange={(v) => isMobileSheet ? setTempSortBy(v as typeof sortBy) : onSortChange(v as typeof sortBy)}>
                  <SelectTrigger className="w-full h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm">
                    <SelectValue placeholder="Sort products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance" className="text-[10px] sm:text-xs md:text-sm">Relevance</SelectItem>
                    <SelectItem value="price-asc" className="text-[10px] sm:text-xs md:text-sm">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="text-[10px] sm:text-xs md:text-sm">Price: High to Low</SelectItem>
                    <SelectItem value="discount-desc" className="text-[10px] sm:text-xs md:text-sm">Discount: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isMobileSheet && (
        <div className="border-t bg-card p-4 space-y-2">
          <Button
            onClick={handleApplyFilters}
            className="w-full h-11 text-sm font-semibold"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="w-full h-11 text-sm font-semibold"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
      )}
    </aside>
  );
};
