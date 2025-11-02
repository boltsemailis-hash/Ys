import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getProducts,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isProductInWishlist,
  Product,
} from '@/lib/firebase-db';
import { useFirebaseAuth } from './FirebaseAuthContext';
import { toast } from 'sonner';

interface FirebaseProductContextType {
  products: Product[];
  loading: boolean;
  wishlistIds: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshProducts: () => Promise<void>;
}

const FirebaseProductContext = createContext<FirebaseProductContextType | undefined>(undefined);

export const FirebaseProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useFirebaseAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    try {
      const ids = await getWishlist(user.uid);
      setWishlistIds(ids);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [user]);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    fetchWishlist();
  }, [user, fetchWishlist]);

  const handleAddToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      throw new Error('User must be authenticated');
    }

    try {
      await addToWishlist(user.uid, productId);
      setWishlistIds(prev => [...prev, productId]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      throw error;
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      await removeFromWishlist(user.uid, productId);
      setWishlistIds(prev => prev.filter(id => id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      throw error;
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <FirebaseProductContext.Provider
      value={{
        products,
        loading,
        wishlistIds,
        addToWishlist: handleAddToWishlist,
        removeFromWishlist: handleRemoveFromWishlist,
        isInWishlist,
        refreshProducts,
      }}
    >
      {children}
    </FirebaseProductContext.Provider>
  );
};

export const useFirebaseProducts = () => {
  const context = useContext(FirebaseProductContext);
  if (context === undefined) {
    throw new Error('useFirebaseProducts must be used within a FirebaseProductProvider');
  }
  return context;
};
