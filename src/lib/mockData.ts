export interface Product {
  id: string;
  name: string;
  category: string;
  fabric?: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  stock: boolean;
  images: string[];
  trending?: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export const CATEGORIES = [
  'All',
  'Kurti',
  'Kurta Sets',
  'Sarees',
  'Ready to Wear Sarees',
  'Blouses',
  'Lehengas',
  'Palazzos',
  'Indo Western Dress',
  'Dupattas',
] as const;

const generateProducts = (): Product[] => {
  const baseImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800',
    'https://images.unsplash.com/photo-1610030469046-98bf6c561251?w=800',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
    'https://images.unsplash.com/photo-1611916656173-875e4277bea6?w=800',
    'https://images.unsplash.com/photo-1583391265492-eb4a7b5d03f3?w=800',
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
    'https://images.unsplash.com/photo-1583391265841-83afd6cbc10e?w=800',
    'https://images.unsplash.com/photo-1617519019082-2964fcdc29ad?w=800',
    'https://images.unsplash.com/photo-1583391265855-4768eadf3e80?w=800',
  ];

  const colors = ['#C2185B', '#FF7043', '#FFD54F', '#1565C0', '#4A148C', '#D32F2F', '#212121'];
  const fabrics = ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Net', 'Rayon', 'Linen', 'Crepe'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const products: Product[] = [];
  let id = 1;

  const categoryData = {
    'Kurti': {
      names: ['Elegant', 'Floral', 'Printed', 'Embroidered', 'Designer', 'Casual', 'Festive', 'Traditional', 'Modern', 'Classic'],
      priceRange: [1299, 2999],
      fabrics: ['Cotton', 'Rayon', 'Georgette', 'Crepe'],
    },
    'Kurta Sets': {
      names: ['Royal', 'Premium', 'Designer', 'Embellished', 'Classic', 'Festive', 'Wedding', 'Party', 'Ethnic', 'Traditional'],
      priceRange: [2499, 5999],
      fabrics: ['Silk Blend', 'Cotton', 'Georgette', 'Rayon'],
    },
    'Sarees': {
      names: ['Traditional', 'Silk', 'Designer', 'Banarasi', 'Kanjivaram', 'Wedding', 'Party', 'Festive', 'Classic', 'Royal'],
      priceRange: [4999, 14999],
      fabrics: ['Pure Silk', 'Georgette', 'Chiffon', 'Cotton Silk'],
    },
    'Ready to Wear Sarees': {
      names: ['Pre-stitched', 'Ready', 'Easy Drape', 'Modern', 'Convenient', 'Quick Wear', 'Working', 'Contemporary', 'Stylish', 'Fusion'],
      priceRange: [1999, 4999],
      fabrics: ['Georgette', 'Chiffon', 'Silk Blend', 'Crepe'],
    },
    'Blouses': {
      names: ['Embroidered', 'Designer', 'Plain', 'Printed', 'Fancy', 'Simple', 'Traditional', 'Modern', 'Stylish', 'Elegant'],
      priceRange: [599, 1999],
      fabrics: ['Cotton', 'Silk', 'Georgette', 'Brocade'],
    },
    'Lehengas': {
      names: ['Designer', 'Wedding', 'Bridal', 'Party', 'Festive', 'Embroidered', 'Sequin', 'Heavy', 'Royal', 'Grand'],
      priceRange: [7999, 24999],
      fabrics: ['Georgette', 'Net', 'Silk', 'Velvet'],
    },
    'Palazzos': {
      names: ['Cotton', 'Printed', 'Plain', 'Designer', 'Casual', 'Comfortable', 'Flowy', 'Wide Leg', 'Trendy', 'Modern'],
      priceRange: [499, 1499],
      fabrics: ['Cotton', 'Rayon', 'Georgette', 'Crepe'],
    },
    'Indo Western Dress': {
      names: ['Fusion', 'Contemporary', 'Modern', 'Stylish', 'Party', 'Cocktail', 'Designer', 'Trendy', 'Chic', 'Elegant'],
      priceRange: [3499, 8999],
      fabrics: ['Net', 'Silk', 'Georgette', 'Crepe'],
    },
    'Dupattas': {
      names: ['Embroidered', 'Silk', 'Chiffon', 'Designer', 'Plain', 'Printed', 'Fancy', 'Traditional', 'Modern', 'Lightweight'],
      priceRange: [399, 1999],
      fabrics: ['Chiffon', 'Georgette', 'Silk', 'Net'],
    },
  };

  Object.entries(categoryData).forEach(([category, data]) => {
    for (let i = 0; i < 35; i++) {
      const namePrefix = data.names[i % data.names.length];
      const colorName = ['Pink', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Black', 'White', 'Orange', 'Maroon'][i % 10];
      const fabric = data.fabrics[i % data.fabrics.length];
      const basePrice = data.priceRange[0] + Math.floor((data.priceRange[1] - data.priceRange[0]) * (i / 35));
      const discountPercent = 15 + Math.floor(Math.random() * 30);
      const discountPrice = Math.floor(basePrice * (1 - discountPercent / 100));

      products.push({
        id: String(id++),
        name: `${namePrefix} ${colorName} ${category}`,
        category,
        fabric,
        description: `Beautiful ${fabric} ${category.toLowerCase()} perfect for all occasions. Features premium quality material and excellent craftsmanship.`,
        originalPrice: basePrice,
        discountPrice,
        discountPercent,
        stock: i % 10 !== 0,
        trending: i < 4,
        images: [baseImages[i % baseImages.length], baseImages[(i + 1) % baseImages.length]],
        sizes: category === 'Sarees' || category === 'Ready to Wear Sarees' || category === 'Dupattas' ? ['Free Size'] : sizes,
        colors: [colors[i % colors.length], colors[(i + 1) % colors.length], colors[(i + 2) % colors.length]],
      });
    }
  });

  return products;
};

export const mockProducts: Product[] = generateProducts();

export const heroImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200',
    title: 'Festive Picks',
    subtitle: 'Up to 30% Off',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200',
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1610030469046-98bf6c561251?w=1200',
    title: 'Shop the Look',
    subtitle: 'Trending Now',
  },
];

const STORAGE_KEYS = {
  PRODUCTS: 'priya_products',
  WISHLIST: 'priya_wishlist',
  USER: 'priya_user',
  USERS: 'priya_users',
};

export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { id: 'admin-1', email: 'admin@priyascollection.com', password: 'admin123', role: 'admin' },
      { id: 'user-1', email: 'user@example.com', password: 'user123', role: 'user' },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
};

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return stored ? JSON.parse(stored) : mockProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getWishlist = (userId: string): string[] => {
  const stored = localStorage.getItem(`${STORAGE_KEYS.WISHLIST}_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveWishlist = (userId: string, productIds: string[]) => {
  localStorage.setItem(`${STORAGE_KEYS.WISHLIST}_${userId}`, JSON.stringify(productIds));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
};

export const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  return user ? { id: user.id, email: user.email, role: user.role } : null;
};

export const registerUser = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    role: 'user' as const,
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return { id: newUser.id, email: newUser.email, role: newUser.role };
};
