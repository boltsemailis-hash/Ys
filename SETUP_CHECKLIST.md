# Firebase & ImageKit Setup Checklist

Complete these steps to get your fashion catalogue live!

## Pre-Setup (5 minutes)
- [ ] Have Firebase project credentials ready
- [ ] Have ImageKit account ready
- [ ] Node.js installed on your computer
- [ ] Code editor (VS Code recommended)

## Firebase Setup (10 minutes)

### Authentication
- [ ] Go to Firebase Console → Authentication
- [ ] Enable "Email/Password" provider
- [ ] Click Save

### Firestore Database
- [ ] Go to Firebase Console → Firestore Database
- [ ] Click "Create Database"
- [ ] Choose "Production mode"
- [ ] Select region: us-east1
- [ ] Click "Enable"

### Create Collections
- [ ] Create collection named: `products`
- [ ] Create collection named: `wishlists`
- [ ] Create collection named: `users`

### Security Rules
- [ ] Go to Firestore → Rules tab
- [ ] Copy security rules from `FIREBASE_SETUP.md`
- [ ] Paste and click "Publish"

## ImageKit Setup (5 minutes)

### Get Credentials
- [ ] Go to ImageKit Dashboard → Settings
- [ ] Copy your Public Key
- [ ] Copy your URL Endpoint
- [ ] (Optional: Update `src/lib/imagekit.ts` if using different account)

## Local Setup (5 minutes)

### Install & Run
```bash
[ ] npm install              # Install dependencies
[ ] npm run dev              # Start development server
```

- [ ] Open browser to http://localhost:5173
- [ ] App loads without errors

## Test Workflow (10 minutes)

### Create Account
- [ ] Go to Login page (`/login`)
- [ ] Fill in email and password
- [ ] Click "Sign Up"
- [ ] Account created successfully

### Add First Product
- [ ] Logged in (see wishlist and admin icons)
- [ ] Click admin icon (📦) in header
- [ ] Click "Add Product" button
- [ ] Fill in product details:
  - [ ] Product Name: "Test Saree"
  - [ ] Category: "Sarees"
  - [ ] Original Price: 5000
  - [ ] Discount Price: 3500
  - [ ] Description: "Beautiful test saree"
- [ ] Upload image(s)
- [ ] Click "Add Product"
- [ ] Success message appears

### View Products
- [ ] Click home/back to main page
- [ ] See test product in catalog
- [ ] Click on product
- [ ] Product details page loads
- [ ] Image displays correctly

### Test Wishlist
- [ ] On product details page
- [ ] Click heart icon
- [ ] "Added to wishlist" message
- [ ] Click wishlist icon in header
- [ ] See saved product

### Edit Product
- [ ] Go to admin dashboard
- [ ] Click pencil icon on product
- [ ] Edit details
- [ ] Click "Update Product"
- [ ] Changes appear instantly

### Delete Product
- [ ] In admin dashboard
- [ ] Click trash icon on product
- [ ] Confirm deletion
- [ ] Product disappears from list

## Database Verification (5 minutes)

### Check Firestore
- [ ] Go to Firebase Console → Firestore
- [ ] Check "products" collection has your product
- [ ] Check "users" collection has your account
- [ ] Check "wishlists" collection has your wishlist item

### Check ImageKit
- [ ] Go to ImageKit Dashboard
- [ ] Check "Media Library" for uploaded images
- [ ] Images should be under "fashion-catalogue" tag

## Production Deployment (10 minutes)

### Build for Production
```bash
[ ] npm run build            # Create production build
```

- [ ] No errors in build output
- [ ] `dist/` folder created

### Choose Hosting Platform

#### Option A: Vercel (Easiest)
```bash
[ ] npm install -g vercel
[ ] vercel                   # Follow prompts
```
- [ ] Project deployed
- [ ] App accessible at provided URL

#### Option B: Netlify (Easy)
- [ ] Connect your GitHub repo to Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Deploy
- [ ] App accessible at Netlify URL

#### Option C: Firebase Hosting (Advanced)
```bash
[ ] npm install -g firebase-tools
[ ] firebase login
[ ] firebase init hosting
[ ] firebase deploy
```
- [ ] App deployed to Firebase
- [ ] Accessible at firebase URL

## Post-Deployment (5 minutes)

### Final Tests
- [ ] Sign up on live app
- [ ] Add product via admin dashboard
- [ ] Browse products
- [ ] Add to wishlist
- [ ] Images load quickly

### Share Your Store
- [ ] Copy your app URL
- [ ] Share with friends/family
- [ ] Get feedback
- [ ] Add more products

## Customization (Optional)

- [ ] Change brand name (in Header.tsx)
- [ ] Update categories (in AdminDashboard.tsx)
- [ ] Customize colors (in tailwind.config.ts)
- [ ] Add more product fields (in firebase-db.ts)
- [ ] Update store description

## Optimization (Optional)

- [ ] Add meta tags for SEO
- [ ] Set up analytics
- [ ] Configure email notifications
- [ ] Add payment integration (future)
- [ ] Set up product reviews (future)

## Troubleshooting Checklist

If something doesn't work:

### App Won't Start
- [ ] Check Node.js version (14+)
- [ ] Delete `node_modules` and run `npm install`
- [ ] Check for errors in terminal

### Firebase Connection Issues
- [ ] Verify Firebase credentials in `src/lib/firebase.ts`
- [ ] Check internet connection
- [ ] Verify Firestore is enabled
- [ ] Check security rules are published

### Image Upload Issues
- [ ] Verify ImageKit credentials
- [ ] Check image file size (<5MB)
- [ ] Verify ImageKit URL endpoint is correct
- [ ] Check browser console for errors

### Authentication Issues
- [ ] Verify Firebase auth is enabled
- [ ] Use valid email format
- [ ] Check password is 6+ characters
- [ ] Try with different email

### Products Not Showing
- [ ] Check Firestore has documents
- [ ] Verify collection name is "products"
- [ ] Wait 30 seconds for sync
- [ ] Refresh page
- [ ] Check browser console

### Products Won't Delete/Edit
- [ ] Verify you're logged in
- [ ] Check security rules allow operations
- [ ] Verify user ID matches document
- [ ] Check Firestore console permissions

## Success Indicators

You'll know everything is working when:
✅ You can sign up and log in
✅ Admin dashboard is accessible
✅ You can add products with images
✅ Products appear on home page immediately
✅ Images load quickly (via ImageKit)
✅ Wishlist saves your products
✅ You can edit and delete products
✅ Your store works on mobile
✅ App is deployed and live

## Quick Reference

| Task | File/Location |
|------|---------------|
| Update Firebase config | `src/lib/firebase.ts` |
| Update ImageKit config | `src/lib/imagekit.ts` |
| Add product categories | `src/pages/AdminDashboard.tsx` |
| Change brand name | `src/components/Header.tsx` |
| Customize colors | `tailwind.config.ts` |
| View product code | `src/pages/Home.tsx` |
| View admin code | `src/pages/AdminDashboard.tsx` |

## Support

Need help?
- 📖 Read `FIREBASE_SETUP.md` for detailed instructions
- ⚡ Read `FIREBASE_QUICKSTART.md` for 5-minute setup
- 📚 Check `README_FIREBASE.md` for documentation
- 🔍 Check `IMPLEMENTATION_SUMMARY.md` for overview

## Time Estimates

- Firebase Setup: 10-15 minutes
- ImageKit Setup: 5 minutes
- Local Testing: 10 minutes
- Deployment: 5-10 minutes
- **Total: 30-40 minutes to launch!**

---

## ✅ Final Checklist

Once complete, you should have:
- [ ] Working Firebase backend
- [ ] ImageKit image storage
- [ ] Admin dashboard
- [ ] Product catalog
- [ ] User authentication
- [ ] Wishlist functionality
- [ ] Live deployment
- [ ] Mobile-responsive design

## 🎉 Ready to Launch!

Once all items are checked, your fashion catalogue is ready for real customers!

**Next Step:** Open `FIREBASE_QUICKSTART.md` and start setup!
