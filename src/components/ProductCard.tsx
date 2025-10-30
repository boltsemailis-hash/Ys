import { Heart } from 'lucide-react';
import { Product, getCurrentUser, getWishlist, saveWishlist } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const wishlist = getWishlist(user.id);
      setIsWishlisted(wishlist.includes(product.id));
    }
  }, [user, product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    const wishlist = getWishlist(user.id);
    const newWishlist = isWishlisted
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];

    saveWishlist(user.id, newWishlist);
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 active:scale-[0.98] rounded-lg border-2 hover:border-primary/20 animate-fade-in"
      onClick={handleClick}
      aria-label={product.name}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNzUgMzUwSDMyNVY0NTBIMjc1VjM1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwMCAyNzVMMzI1IDMwMEwyNzUgMzAwTDMwMCAyNzVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iNTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-1.5 right-1.5 h-7 w-7 bg-background/95 hover:bg-background backdrop-blur-sm transition-all duration-300 rounded-full shadow-md active:scale-90 ${isWishlisted ? 'text-primary' : 'text-muted-foreground'
              }`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-3.5 w-3.5 transition-all ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          {product.discountPercent > 0 && (
            <Badge className="absolute top-1.5 left-1.5 text-[10px] bg-accent text-accent-foreground font-bold shadow-md px-1.5 py-0.5">
              {product.discountPercent}% OFF
            </Badge>
          )}
          {!product.stock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-xs px-2.5 py-1">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-2 space-y-0.5">
          <h3 className="font-heading font-semibold text-[11px] line-clamp-2 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
          {product.fabric && (
            <p className="text-[9px] text-muted-foreground font-medium">{product.fabric}</p>
          )}
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-sm font-bold text-primary">₹{product.discountPrice}</span>
            {product.discountPercent > 0 && (
              <span className="text-[9px] text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {product.stock && (
            <p className="text-[9px] font-semibold text-green-600 flex items-center gap-0.5">
              <span className="w-1 h-1 bg-green-600 rounded-full animate-pulse"></span>
              In Stock
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};