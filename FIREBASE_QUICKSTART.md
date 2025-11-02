# Firebase + ImageKit Quick Start Guide

Get your fashion catalogue running with Firebase and ImageKit in 5 minutes!

## Prerequisites

You need:
1. A Firebase account (FREE tier is enough)
2. An ImageKit account (FREE tier is enough)
3. Node.js installed

## Step 1: Firebase Setup (2 minutes)

### Go to Firebase Console
1. Open https://console.firebase.google.com
2. Select project "yash-exe" (already created)

### Enable Authentication
1. Click "Authentication" in left menu
2. Click "Get Started"
3. Select "Email/Password" provider
4. Click "Enable" and "Save"

### Create Firestore Database
1. Click "Firestore Database" in left menu
2. Click "Create Database"
3. Choose "Start in production mode"
4. Select region: `us-east1`
5. Click "Enable"

### Create Collections
Go to "Firestore Database" → Collections and create:

**Collection 1: `products`**
- Click "Start collection"
- Enter: `products`
- Click "Auto-ID" for document
- Click "Save"

**Collection 2: `wishlists`**
- Click "Start collection"
- Enter: `wishlists`
- Click "Auto-ID" for document
- Click "Save"

**Collection 3: `users`**
- Click "Start collection"
- Enter: `users`
- Click "Auto-ID" for document
- Click "Save"

### Set Security Rules
1. Go to "Firestore Database" → "Rules" tab
2. Replace all code with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid != null;
    }
    match /wishlists/{document=**} {
      allow read, create, delete: if request.auth.uid == resource.data.userId ||
                                     request.auth.uid == request.resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 2: ImageKit Setup (2 minutes)

### Get Your ImageKit Keys
1. Go to https://imagekit.io/dashboard
2. Sign up if needed
3. In the dashboard, go to "Settings"
4. Copy these values:
   - **Public Key** (looks like: `public_xxxxx`)
   - **URL Endpoint** (looks like: `https://ik.imagekit.io/xxxxx/`)

### Update ImageKit Config (Optional)
If you're using a different ImageKit account:

Edit `src/lib/imagekit.ts`:
```typescript
const imageKit = new ImageKit({
  publicKey: 'YOUR_PUBLIC_KEY',
  urlEndpoint: 'https://ik.imagekit.io/YOUR_IMAGEKIT_ID/',
});
```

## Step 3: Run the App (1 minute)

### Start Development Server
```bash
npm run dev
```

App opens at `http://localhost:5173`

## Step 4: Test the Workflow (2 minutes)

### 1. Create Account
- Go to Login page
- Click "Sign up"
- Enter email and password
- Click "Sign Up"

### 2. Add Products
- Click admin icon (📦) in header
- Click "Add Product" button
- Fill in:
  - Product Name: "Elegant Silk Saree"
  - Category: "Sarees"
  - Price: 5000
  - Upload an image
  - Click "Add Product"

### 3. Browse Products
- Click home to see products
- Click product to view details
- Click heart to add to wishlist

### 4. View Wishlist
- Click heart icon in header
- See saved products

## Deploying to Production

### Option 1: Vercel (Recommended)
```bash
npm run build
# Drag dist folder to https://vercel.com
```

### Option 2: Netlify
```bash
npm run build
# Drag dist folder to https://app.netlify.com
```

### Option 3: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/firebase.ts` | Firebase initialization |
| `src/lib/firebase-auth.ts` | Login/signup logic |
| `src/lib/firebase-db.ts` | Product database operations |
| `src/lib/imagekit.ts` | Image upload logic |
| `src/pages/AdminDashboard.tsx` | Product management |
| `src/pages/Login.tsx` | Auth page |

## Admin Dashboard Features

✅ Add products with images
✅ Edit existing products
✅ Delete products
✅ Mark products as trending
✅ Set prices and discounts
✅ Upload multiple images per product
✅ Auto image optimization via ImageKit

## Common Issues & Fixes

### "Authentication not enabled"
→ Go to Firebase Console → Authentication → Enable Email/Password

### "Firestore permission denied"
→ Check security rules are published correctly

### "Images not uploading"
→ Check ImageKit URL endpoint is correct

### "Products not showing up"
→ Wait 30 seconds, refresh page
→ Check Firestore console has documents

### "Can't login"
→ Check email format is valid
→ Try a different email address

## Architecture Overview

```
User Interface (React)
      ↓
Firebase Auth (Login/Signup)
      ↓
Firebase Firestore (Products/Wishlists)
      ↓
ImageKit (Image Storage)
```

## Free Tier Limits

**Firebase:**
- 1GB storage
- 100 concurrent users
- 50,000 reads/day
- 20,000 writes/day

**ImageKit:**
- 10GB bandwidth/month
- 10,000 transformations/month
- Perfect for small shops!

## Next Steps

1. **Add more products** via admin dashboard
2. **Customize categories** in `src/pages/AdminDashboard.tsx`
3. **Add product reviews** (future feature)
4. **Set up email confirmations** (optional)
5. **Add payment integration** like Stripe (future)

## Support Resources

- Firebase: https://firebase.google.com/docs
- ImageKit: https://docs.imagekit.io
- React: https://react.dev
- Vite: https://vitejs.dev

## Security Checklist

- ✅ Firebase security rules configured
- ✅ Public keys safe in code (no private keys)
- ✅ ImageKit endpoints secure
- ✅ Password hashing automatic (Firebase Auth)
- ✅ User data isolated (Firestore rules)

---

**You're all set! 🎉**

Start adding products and share your store!

For detailed setup, see `FIREBASE_SETUP.md`
