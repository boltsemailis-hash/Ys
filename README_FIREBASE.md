# Priya's Collection - Fashion Catalogue with Firebase & ImageKit

A modern, fully-functional e-commerce fashion platform built with React, Firebase Firestore, and ImageKit for image storage.

## Features

### For Customers
- 🛍️ Browse fashion products by category
- ❤️ Save favorite items to wishlist
- 🔍 Search products by name or category
- 📱 Mobile-first responsive design
- 🎨 Beautiful UI with smooth animations
- 👤 User authentication (email/password)

### For Admins
- 📦 Easy product management dashboard
- 🖼️ Automatic image upload to ImageKit
- ✏️ Edit/update product details
- 🗑️ Delete products
- 📊 Real-time product sync
- ⚡ Lightning-fast image delivery

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation

### Backend
- **Firebase Firestore** - Real-time database
- **Firebase Authentication** - User management
- **Firebase Storage** - File hosting

### Image Management
- **ImageKit** - Image optimization & CDN

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd project
npm install
```

### 2. Firebase Setup
See `FIREBASE_QUICKSTART.md` for step-by-step instructions

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

### 4. Add Your First Product
1. Sign up at `/login`
2. Click admin icon (📦)
3. Add a product with images
4. See it live on home page!

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation & search
│   ├── ProductCard.tsx # Product display
│   └── ...
├── pages/              # Page components
│   ├── Home.tsx        # Product listing
│   ├── AdminDashboard.tsx # Product management
│   ├── Login.tsx       # Authentication
│   └── ...
├── contexts/           # State management
│   ├── FirebaseAuthContext.tsx
│   └── FirebaseProductContext.tsx
├── lib/                # Utilities & APIs
│   ├── firebase.ts     # Firebase config
│   ├── firebase-auth.ts # Auth functions
│   ├── firebase-db.ts  # Database functions
│   └── imagekit.ts     # Image upload
└── App.tsx             # Root component
```

## Database Schema

### Collection: `products`
```
{
  id: string (auto)
  name: string
  description: string
  category: string
  fabric: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  images: string[] (ImageKit URLs)
  sizes: string[]
  colors: string[]
  stock: boolean
  trending: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Collection: `wishlists`
```
{
  id: string (auto)
  userId: string (Firebase UID)
  productId: string
  createdAt: timestamp
}
```

### Collection: `users`
```
{
  id: string (Firebase UID)
  email: string
  fullName: string
  role: string ("user" or "admin")
  createdAt: timestamp
  updatedAt: timestamp
}
```

## API Reference

### Authentication (`src/lib/firebase-auth.ts`)
```typescript
signUp(credentials)           // Create account
signIn(credentials)           // Login
signOut()                      // Logout
getCurrentUser()               // Get current user
onAuthStateChange(callback)    // Listen to auth changes
```

### Database (`src/lib/firebase-db.ts`)
```typescript
// Products
addProduct(data)               // Create product
updateProduct(id, data)        // Update product
deleteProduct(id)              // Delete product
getProducts()                  // Get all products
getProductById(id)             // Get single product
getProductsByCategory(cat)     // Filter by category
getTrendingProducts()          // Get trending items

// Wishlists
addToWishlist(userId, productId)
removeFromWishlist(userId, productId)
getWishlist(userId)
isProductInWishlist(userId, productId)
```

### Image Upload (`src/lib/imagekit.ts`)
```typescript
uploadToImageKit(file)         // Upload & get URL
getImageUrl(fileId)            // Get image URL
```

## Using Firebase Contexts

### Access Auth State
```typescript
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

function MyComponent() {
  const { user, loading, signOut } = useFirebaseAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return <div>Welcome {user.email}</div>;
}
```

### Access Products & Wishlist
```typescript
import { useFirebaseProducts } from '@/contexts/FirebaseProductContext';

function MyComponent() {
  const {
    products,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist
  } = useFirebaseProducts();

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => addToWishlist(product.id)}>
            {isInWishlist(product.id) ? 'Remove' : 'Add'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## Environment Variables

No environment variables needed! Firebase config is embedded in the code (uses public keys only).

## Security

### Firestore Rules
All data access is controlled by security rules in Firebase Console:
- Products: Public read, auth required for write
- Wishlists: Users can only access their own
- Users: Users can only read/write their own data

### Private Keys
Never commit private keys. The code only uses public Firebase keys which are safe.

## Performance

### Image Optimization
- ImageKit auto-optimizes all images
- Images served via global CDN
- Instant load times

### Database Queries
- Firestore indexes optimize common queries
- Real-time updates via Firestore listeners
- Efficient pagination with Firestore cursors

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Check email format, try different account |
| Products not loading | Check Firestore collections exist |
| Images not uploading | Verify ImageKit config, check file size |
| Slow product load | Check Firestore indexes in console |
| Auth state not persisting | Clear browser cache, check security rules |

## Customization

### Add More Categories
Edit `src/pages/AdminDashboard.tsx`:
```typescript
const CATEGORIES = [
  'Sarees',
  'Kurtis',
  'Lehengas',
  'YOUR_CATEGORY' // Add here
];
```

### Change Branding
Edit `src/components/Header.tsx`:
```typescript
<h1>Your Store Name</h1>
```

### Modify Color Scheme
Edit `tailwind.config.ts` for custom colors

### Add Product Fields
1. Update `ProductInput` type in `src/lib/firebase-db.ts`
2. Add form fields in `src/pages/AdminDashboard.tsx`
3. Update `Product` interface for display

## Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Product reviews & ratings
- [ ] Advanced search & filters
- [ ] Product inventory tracking
- [ ] Order management
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Social sharing
- [ ] Product recommendations

## Contributing

Contributions welcome! Please follow these steps:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues & questions:
- 📖 Firebase Docs: https://firebase.google.com/docs
- 🖼️ ImageKit Docs: https://docs.imagekit.io
- ⚛️ React Docs: https://react.dev

## Detailed Guides

- **Setup Guide**: See `FIREBASE_SETUP.md`
- **Quick Start**: See `FIREBASE_QUICKSTART.md`

---

**Made with ❤️ using Firebase + ImageKit + React**

Start selling fashion today! 🛍️
