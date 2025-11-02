import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  fabric?: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: boolean;
  trending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  name: string;
  description: string;
  category: string;
  fabric?: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent?: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: boolean;
  trending?: boolean;
}

// Products
export const addProduct = async (data: ProductInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      discountPercent: data.discountPercent || Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100),
      trending: data.trending || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<ProductInput>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'products', id), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'products', id));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('trending', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Product));
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
};

// Wishlists
export const addToWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    await addDoc(collection(db, 'wishlists'), {
      userId,
      productId,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (userId: string, productId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const getWishlist = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'wishlists'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().productId);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
};

export const isProductInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'wishlists'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};
