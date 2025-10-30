import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, getCurrentUser, getWishlist, saveWishlist, getProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Footer } from '@/components/Footer';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const products = getProducts();
    const foundProduct = products.find(p => p.id === id);

    if (!foundProduct) {
      navigate('/');
      return;
    }

    setProduct(foundProduct);
  }, [id, navigate]);

  useEffect(() => {
    if (user && product) {
      const wishlist = getWishlist(user.id);
      setIsWishlisted(wishlist.includes(product.id));
    }
  }, [user, product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;

      if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        e.preventDefault();
        setCurrentImageIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentImageIndex < product.images.length - 1) {
        e.preventDefault();
        setCurrentImageIndex(prev => prev + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product, currentImageIndex]);

  if (!product) {
    return null;
  }

  const toggleWishlist = () => {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b">
        <div className="px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full h-9 w-9"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleWishlist}
                className={`rounded-full h-9 w-9 ${isWishlisted ? 'text-primary' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-6">
        <div className="w-full">
          <div className="relative aspect-square bg-white">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain p-4 sm:p-6 md:p-8"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwMCAxMjVMMjI1IDE1MEwxNzUgMTUwTDIwMCAxMjVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
              }}
            />

            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 rounded-full disabled:opacity-30"
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/95 hover:bg-background shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 rounded-full disabled:opacity-30"
                  onClick={nextImage}
                  disabled={currentImageIndex === product.images.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-3 px-3 mt-3 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index
                      ? 'border-primary shadow-md ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-3 sm:px-4 mt-4 space-y-5">
          <div className="space-y-3">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full font-medium">
                  {product.category}
                </Badge>
                {product.fabric && (
                  <Badge variant="outline" className="text-xs px-3 py-1 rounded-full font-medium">
                    {product.fabric}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">₹{product.discountPrice}</span>
                {product.discountPercent > 0 && (
                  <span className="text-base text-muted-foreground line-through font-medium">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              {product.discountPercent > 0 && (
                <Badge className="bg-accent text-accent-foreground text-xs px-2.5 py-1 rounded-full font-semibold">
                  {product.discountPercent}% OFF
                </Badge>
              )}
            </div>

            <div>
              {product.stock ? (
                <Badge className="bg-green-500 text-white flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium w-fit">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium w-fit">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          <div className="h-px bg-border"></div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <>
              <div className="h-px bg-border"></div>
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Available Sizes</h2>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-accent hover:border-primary transition-colors"
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {product.colors && product.colors.length > 0 && (
            <>
              <div className="h-px bg-border"></div>
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Available Colors</h2>
                <div className="flex gap-2.5 flex-wrap">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-full border-2 border-border shadow-sm hover:scale-110 transition-all duration-200 ring-2 ring-background cursor-pointer"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t p-3 sm:p-4 z-40">
        <div className="max-w-screen-xl mx-auto">
          <Button
            onClick={toggleWishlist}
            className="w-full h-12 text-base font-semibold rounded-xl transition-all duration-200 shadow-lg"
            disabled={!product.stock}
          >
            <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
            {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </Button>
          {!product.stock && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              This item is currently out of stock
            </p>
          )}
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
