import { useState, useEffect, useCallback } from 'react';
import { X, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, getCurrentUser, getWishlist, saveWishlist } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  // Always call useCallback hooks, but make them safe for when product is null
  const nextImage = useCallback(() => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  }, [product?.images?.length]);

  const prevImage = useCallback(() => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  }, [product?.images?.length]);

  useEffect(() => {
    if (user && product) {
      const wishlist = getWishlist(user.id);
      setIsWishlisted(wishlist.includes(product.id));
    }
  }, [user, product]);

  // Keyboard navigation - always call this hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!product) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product, nextImage, prevImage, onClose]);

  // Debug logging
  console.log('ProductDetailModal - product:', product);
  console.log('ProductDetailModal - product images:', product?.images);

  if (!product) {
    console.log('ProductDetailModal - No product, returning null');
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

  console.log('ProductDetailModal - Rendering dialog with product:', product.name);

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-hidden p-0 bg-white shadow-2xl rounded-2xl">
        <div className="flex flex-col h-full max-h-[92vh] overflow-y-auto">
          <div className="w-full px-6 pt-6 pb-4 bg-gradient-to-b from-slate-50/50 to-white">
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 max-w-md mx-auto">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 transition-opacity duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwMCAxMjVMMjI1IDE1MEwxNzUgMTUwTDIwMCAxMjVaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />

                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/95 hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 rounded-full"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5 text-slate-700" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/95 hover:bg-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 rounded-full"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5 text-slate-700" />
                    </Button>
                  </>
                )}

                {product.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 px-1 justify-center scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${currentImageIndex === index
                        ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-400'
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
          </div>

          <div className="w-full px-6 pb-6 flex flex-col bg-white">
            <div className="space-y-5">
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-slate-900 leading-snug tracking-tight">{product.name}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full font-medium bg-slate-100 text-slate-700 border-0">
                      {product.category}
                    </Badge>
                    {product.fabric && (
                      <Badge variant="outline" className="text-xs px-3 py-1 rounded-full font-medium border-slate-200 text-slate-600">
                        {product.fabric}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-bold text-slate-900">₹{product.discountPrice}</span>
                    {product.discountPercent > 0 && (
                      <span className="text-base text-slate-400 line-through font-medium">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {product.discountPercent > 0 && (
                    <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                      {product.discountPercent}% OFF
                    </Badge>
                  )}
                </div>

                <div className="flex items-center pt-1">
                  {product.stock ? (
                    <Badge className="bg-emerald-500 text-white flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Available Sizes</h3>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 hover:border-slate-300 transition-colors"
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {product.colors && product.colors.length > 0 && (
                <>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Available Colors</h3>
                    <div className="flex gap-2.5 flex-wrap">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-9 h-9 rounded-full border-2 border-slate-200 shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 ring-2 ring-white cursor-pointer"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3 pt-6 mt-2">
              <div className="flex gap-3">
                <Button
                  onClick={toggleWishlist}
                  variant={isWishlisted ? "default" : "outline"}
                  className="flex-1 h-11 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
                  disabled={!product.stock}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Saved' : 'Add to Wishlist'}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="h-11 px-5 text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
                  disabled={!product.stock}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {!product.stock && (
                <div className="text-center py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium">This item is currently out of stock</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};