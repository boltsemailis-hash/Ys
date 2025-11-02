# Firebase & ImageKit Integration Guide

This guide explains how to connect your fashion catalogue app to Firebase Firestore and ImageKit for a fully functional backend-powered e-commerce platform.

## Project Overview

Your app is now configured with:
- **Firebase Authentication** - Email/password login and signup
- **Firebase Firestore** - Real-time product and wishlist database
- **ImageKit** - Image optimization, storage, and fast delivery
- **Admin Dashboard** - Easy product management interface

## Firebase Setup

### 1. Firebase Project Configuration

The Firebase config is already set up in your project:

**File:** `src/lib/firebase.ts`

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyDMjtQR2O9sldWOCtg-tVDb4t-8Bv3q0dY",
  authDomain: "yash-exe.firebaseapp.com",
  projectId: "yash-exe",
  storageBucket: "yash-exe.firebasestorage.app",
  messagingSenderId: "15598401831",
  appId: "1:15598401831:web:450da19ee470e57fd75102"
};
```

### 2. Required Firebase Setup Steps

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project "yash-exe"
3. Enable these services:

#### Authentication Setup:
- Go to Authentication → Sign-in method
- Enable "Email/Password"
- Save

#### Firestore Database Setup:
- Go to Firestore Database
- Click "Create Database"
- Choose "Start in production mode"
- Select region: us-east1
- Click "Enable"

#### Create Firestore Collections:

**Collection: products**
- Auto ID documents with this structure:
```
{
  name: string,
  description: string,
  category: string,
  fabric: string,
  originalPrice: number,
  discountPrice: number,
  discountPercent: number,
  images: array,
  sizes: array,
  colors: array,
  stock: boolean,
  trending: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Collection: wishlists**
- Auto ID documents with this structure:
```
{
  userId: string,
  productId: string,
  createdAt: timestamp
}
```

**Collection: users**
- Document ID = user uid with this structure:
```
{
  email: string,
  fullName: string,
  role: "user" (or "admin"),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3. Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products - publicly readable
    match /products/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid != null &&
                                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Wishlists - users can only access their own
    match /wishlists/{document=**} {
      allow read, create, delete: if request.auth.uid == resource.data.userId ||
                                     request.auth.uid == request.resource.data.userId;
    }

    // Users - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## ImageKit Setup

### 1. ImageKit Configuration

The ImageKit config is already set up in your project:

**File:** `src/lib/imagekit.ts`

```typescript
const imageKit = new ImageKit({
  publicKey: 'public_6F7KIvmANRRlg+HBY58Dt+1KLq0=',
  urlEndpoint: 'https://ik.imagekit.io/fjn9qk47o/',
});
```

### 2. Get Your ImageKit Credentials

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Sign up or log in
3. Navigate to "URL-endpoint" in Settings
4. Copy your URL endpoint (format: `https://ik.imagekit.io/YOUR_IMAGEKIT_ID/`)
5. Get your Public Key from Settings
6. Get your Private Key from Settings

### 3. Update ImageKit Config

If using a different ImageKit account, update `src/lib/imagekit.ts`:

```typescript
const imageKit = new ImageKit({
  publicKey: 'YOUR_PUBLIC_KEY',
  urlEndpoint: 'https://ik.imagekit.io/YOUR_IMAGEKIT_ID/',
});
```

### 4. ImageKit Features

- **Automatic Upload** - Images are automatically uploaded when you add a product
- **URL Storage** - Image URLs are stored in Firestore
- **CDN Delivery** - ImageKit's CDN serves images globally (fast!)
- **Auto-Optimization** - Images are automatically optimized for web

## Using the Admin Dashboard

### Accessing the Dashboard

1. Sign up/login at `/login`
2. Navigate to `/admin` or `/admin/dashboard`
3. Click "Add Product" to create a new product

### Adding a Product

1. **Fill in Product Details:**
   - Product Name (required)
   - Description
   - Category (Sarees, Kurtis, Lehengas, Dresses, Accessories, Jewelry)
   - Fabric type
   - Original Price (required)
   - Discount Price (auto-calculates discount %)
   - Mark as Trending (optional)
   - In Stock checkbox

2. **Upload Images:**
   - Click the upload area
   - Select one or multiple images
   - Images are automatically uploaded to ImageKit
   - URLs are stored when you save the product

3. **Save Product:**
   - Click "Add Product" button
   - Product appears in the catalog immediately

### Editing Products

1. Find the product in the dashboard
2. Click the pencil icon
3. Update details/images
4. Click "Update Product"

### Deleting Products

1. Find the product in the dashboard
2. Click the trash icon
3. Confirm deletion

## File Structure

```
src/
├── lib/
│   ├── firebase.ts              # Firebase config & initialization
│   ├── firebase-auth.ts         # Authentication functions
│   ├── firebase-db.ts           # Firestore database operations
│   └── imagekit.ts              # ImageKit configuration & upload
├── contexts/
│   ├── FirebaseAuthContext.tsx  # Auth state management
│   └── FirebaseProductContext.tsx # Products & wishlist state
└── pages/
    ├── AdminDashboard.tsx        # Admin product management
    ├── Login.tsx                 # Authentication page
    ├── Home.tsx                  # Product listing
    ├── Category.tsx              # Category-specific products
    ├── ProductDetail.tsx         # Individual product page
    └── Wishlist.tsx              # User wishlist
```

## API Functions

### Authentication (`src/lib/firebase-auth.ts`)

```typescript
signUp({ email, password, fullName })     // Create new account
signIn({ email, password })               // Login
signOut()                                  // Logout
getCurrentUser()                           // Get current user
getUserData(userId)                        // Get user profile
onAuthStateChange(callback)                // Listen to auth changes
```

### Database (`src/lib/firebase-db.ts`)

**Products:**
```typescript
addProduct(data)              // Add new product
updateProduct(id, data)       // Update product
deleteProduct(id)             // Delete product
getProducts()                 // Get all products
getProductById(id)            // Get single product
getProductsByCategory(cat)    // Filter by category
getTrendingProducts()         // Get trending items
```

**Wishlists:**
```typescript
addToWishlist(userId, productId)          // Add to wishlist
removeFromWishlist(userId, productId)     // Remove from wishlist
getWishlist(userId)                       // Get wishlist product IDs
isProductInWishlist(userId, productId)    // Check if in wishlist
```

### ImageKit (`src/lib/imagekit.ts`)

```typescript
uploadToImageKit(file)        // Upload image, returns URL
getImageUrl(fileId)           // Get image URL by ID
```

## Using in Components

### Accessing Auth State

```typescript
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

export function MyComponent() {
  const { user, loading, signOut } = useFirebaseAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return <div>Welcome {user.email}!</div>;
}
```

### Accessing Products

```typescript
import { useFirebaseProducts } from '@/contexts/FirebaseProductContext';

export function ProductList() {
  const {
    products,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist
  } = useFirebaseProducts();

  const handleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleWishlist(product.id)}>
            {isInWishlist(product.id) ? 'Remove' : 'Add'} Wishlist
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Deployment

### Before Deploying

1. **Update ImageKit Endpoint** - Use your own ImageKit account ID
2. **Set Firebase Rules** - Apply security rules above
3. **Test Admin Dashboard** - Add/edit/delete a product
4. **Test Login** - Create account and login
5. **Test Wishlist** - Add product to wishlist

### Deploy to Production

```bash
npm run build
# Deploy to Vercel, Netlify, or your hosting
```

### Environment Variables

No additional env variables needed - Firebase config is embedded in code (public keys only).

## Troubleshooting

### Products not loading?
- Check Firestore console for data
- Verify collections exist with correct names
- Check security rules allow reads

### Images not uploading?
- Verify ImageKit config is correct
- Check browser console for errors
- Ensure file size is reasonable (<5MB)

### Can't sign up?
- Verify authentication is enabled in Firebase
- Check email format is valid
- Try a different email if it exists

### Wishlist not saving?
- Verify user is logged in
- Check Firestore collection exists
- Check security rules allow writes

### Admin dashboard not accessible?
- Verify you're logged in
- Check user role in Firestore is "admin" (optional - any user can access for now)

## Security Considerations

1. **Public Keys** - The Firebase and ImageKit public keys are safe to commit
2. **Private Keys** - NEVER commit private keys to Git
3. **Firestore Rules** - Always use the security rules provided above
4. **Admin Access** - Make admin access role-based (optional: uncomment rule)
5. **Image Validation** - ImageKit handles image validation automatically

## Best Practices

1. **Always Filter by User** - When fetching wishlists, filter by user ID
2. **Cache Products** - Products change rarely, cache in context
3. **Optimize Images** - ImageKit auto-optimizes, but keep source files <5MB
4. **Error Handling** - Always handle errors in async operations
5. **Loading States** - Show loading indicators while fetching data

## Next Steps

1. Upload sample products via admin dashboard
2. Test complete user flow (signup → browse → wishlist)
3. Configure email verification (optional)
4. Set up admin user role restrictions (optional)
5. Add product reviews/ratings (future enhancement)
6. Implement product search (future enhancement)

## Support

- Firebase Docs: https://firebase.google.com/docs
- ImageKit Docs: https://docs.imagekit.io
- React Documentation: https://react.dev

## FAQ

**Q: Can multiple admins add products?**
A: Yes, any logged-in user can access the admin dashboard. Modify security rules to restrict admin access.

**Q: What's the image upload limit?**
A: ImageKit allows up to 5MB per image by default.

**Q: Can users upload images?**
A: Currently only through admin dashboard. You can add user product uploads in future versions.

**Q: How do I backup my data?**
A: Use Firebase's built-in export feature in the console.

**Q: Can I use a custom domain for images?**
A: Yes, set up a custom domain in ImageKit settings.

## Changelog

- v1.0.0 - Initial Firebase + ImageKit integration
  - Firebase Firestore for products & wishlists
  - ImageKit for image storage
  - Admin dashboard for product management
  - Email/password authentication
